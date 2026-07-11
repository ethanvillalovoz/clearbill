import { DataAPIClient } from "@datastax/astra-db-ts";
import { pipeline } from "@huggingface/transformers";
import {
  buildSystemPrompt,
  dedupeSources,
  getLatestUserMessage,
  parseMessages,
  publisherFromUrl,
} from "../../lib/chat";
import type { SourceReference } from "../../types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CHAT_MODEL = process.env.HUGGINGFACE_CHAT_MODEL
  || "meta-llama/Llama-3.1-8B-Instruct:nebius";
const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";
const REQUIRED_ENV_KEYS = [
  "ASTRA_DB_NAMESPACE",
  "ASTRA_DB_COLLECTION",
  "ASTRA_DB_API_ENDPOINT",
  "ASTRA_DB_APPLICATION_TOKEN",
  "HUGGINGFACE_API_TOKEN",
] as const;

type RequiredEnv = Record<(typeof REQUIRED_ENV_KEYS)[number], string>;
type HuggingFaceChatResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};
type FeatureExtractionPipeline = (
  input: string,
  options: { pooling: "mean"; normalize: boolean },
) => Promise<{ data: Iterable<number> }>;
type RetrievedDocument = {
  text?: unknown;
  source?: unknown;
  title?: unknown;
  publisher?: unknown;
};

let embedderPromise: ReturnType<typeof pipeline> | null = null;

function getRequiredEnv(): RequiredEnv {
  const values = {} as RequiredEnv;
  for (const key of REQUIRED_ENV_KEYS) {
    const value = process.env[key];
    if (!value) throw new Error(`Missing environment variable: ${key}`);
    values[key] = value;
  }
  return values;
}

function getEmbedder() {
  embedderPromise ??= pipeline("feature-extraction", EMBEDDING_MODEL);
  return embedderPromise;
}

async function callModel(
  question: string,
  context: string,
  token: string,
): Promise<string> {
  const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: buildSystemPrompt(context) },
        { role: "user", content: question },
      ],
      max_tokens: 420,
      temperature: 0.2,
      stream: false,
    }),
    signal: AbortSignal.timeout(25_000),
  });

  if (!response.ok) {
    throw new Error(`Hugging Face request failed with status ${response.status}`);
  }

  const result = (await response.json()) as HuggingFaceChatResponse;
  const content = result.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("Hugging Face returned an empty response");
  return content;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: unknown };
    const messages = parseMessages(body.messages);
    const question = getLatestUserMessage(messages);
    if (!question) {
      return Response.json({ error: "A user question is required." }, { status: 400 });
    }

    const env = getRequiredEnv();
    const embedder = (await getEmbedder()) as unknown as FeatureExtractionPipeline;
    const output = await embedder(question, { pooling: "mean", normalize: true });
    const embedding = Array.from(output.data);

    const client = new DataAPIClient(env.ASTRA_DB_APPLICATION_TOKEN);
    const db = client.db(env.ASTRA_DB_API_ENDPOINT, { keyspace: env.ASTRA_DB_NAMESPACE });
    const collection = await db.collection(env.ASTRA_DB_COLLECTION);
    const documents = await collection.find(null, {
      sort: { $vector: embedding },
      limit: 6,
    }).toArray() as RetrievedDocument[];

    const usableDocuments = documents.filter(
      (document) => typeof document.text === "string" && document.text.trim(),
    );
    if (!usableDocuments.length) {
      return Response.json(
        { error: "No billing guidance matched that question. Try a more specific term." },
        { status: 422 },
      );
    }

    const context = usableDocuments
      .map((document, index) => `[${index + 1}] ${String(document.text)}`)
      .join("\n\n");
    const sources = dedupeSources(
      usableDocuments.flatMap((document): SourceReference[] => {
        if (typeof document.source !== "string") return [];
        return [{
          title: typeof document.title === "string"
            ? document.title
            : "Healthcare billing guidance",
          publisher: typeof document.publisher === "string"
            ? document.publisher
            : publisherFromUrl(document.source),
          url: document.source,
        }];
      }),
    ).slice(0, 4);

    const answer = await callModel(question, context, env.HUGGINGFACE_API_TOKEN);
    return Response.json({ answer, sources, mode: "live" });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }
    if (
      error instanceof Error
      && (error.message.startsWith("messages") || error.message.startsWith("each message"))
    ) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    console.error("ClearBill chat request failed", error);
    const unconfigured = error instanceof Error
      && error.message.startsWith("Missing environment variable");
    return Response.json(
      { error: unconfigured ? "Live retrieval is not configured." : "Answer generation is temporarily unavailable." },
      { status: unconfigured ? 503 : 502 },
    );
  }
}
