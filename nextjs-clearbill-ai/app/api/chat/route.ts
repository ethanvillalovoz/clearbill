import { DataAPIClient } from "@datastax/astra-db-ts";
import { pipeline } from "@huggingface/transformers";

const CHAT_MODEL = "meta-llama/Llama-3.1-8B-Instruct:nebius";
const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";
const REQUIRED_ENV_KEYS = [
    "ASTRA_DB_NAMESPACE",
    "ASTRA_DB_COLLECTION",
    "ASTRA_DB_API_ENDPOINT",
    "ASTRA_DB_APPLICATION_TOKEN",
    "HUGGINGFACE_API_TOKEN",
] as const;

type RequiredEnv = Record<(typeof REQUIRED_ENV_KEYS)[number], string>;
type HuggingFaceChatMessage = {
    role: "system" | "user" | "assistant";
    content: string;
};

type HuggingFaceChatRequest = {
    model: string;
    messages: HuggingFaceChatMessage[];
    stream: false;
};

type HuggingFaceChatResponse = {
    choices?: Array<{
        message?: {
            content?: string;
        };
    }>;
};

type FeatureExtractionPipeline = (
    input: string,
    options: { pooling: "mean"; normalize: boolean }
) => Promise<{ data: Iterable<number> }>;

let embedderPromise: ReturnType<typeof pipeline> | null = null;

function getRequiredEnv(): RequiredEnv {
    const values = {} as RequiredEnv;

    for (const key of REQUIRED_ENV_KEYS) {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
        values[key] = value;
    }

    return values;
}

function getAstraDb(env: RequiredEnv) {
    const client = new DataAPIClient(env.ASTRA_DB_APPLICATION_TOKEN);
    return client.db(env.ASTRA_DB_API_ENDPOINT, {
        keyspace: env.ASTRA_DB_NAMESPACE,
    });
}

function getEmbedder() {
    embedderPromise ??= pipeline("feature-extraction", EMBEDDING_MODEL);
    return embedderPromise;
}

function getLatestMessage(messages: unknown): string {
    if (!Array.isArray(messages)) {
        return "";
    }

    const latestMessage = messages.at(-1);
    if (
        typeof latestMessage === "object" &&
        latestMessage !== null &&
        "content" in latestMessage &&
        typeof latestMessage.content === "string"
    ) {
        return latestMessage.content;
    }

    return "";
}

async function callLlama(data: HuggingFaceChatRequest, token: string) {
    const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Hugging Face API error: ${response.status} ${response.statusText} - ${text}`);
    }

    const result = (await response.json()) as HuggingFaceChatResponse;
    return result.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
}

export async function POST(req: Request) {
    try {
        const env = getRequiredEnv();
        const db = getAstraDb(env);
        const body = (await req.json()) as { messages?: unknown };
        const latestMessage = getLatestMessage(body.messages);

        let docContext = "";

        const embedder = (await getEmbedder()) as unknown as FeatureExtractionPipeline;
        const output = await embedder(latestMessage, { pooling: "mean", normalize: true });
        const embedding = Array.from(output.data);

        try {
            const collection = await db.collection(env.ASTRA_DB_COLLECTION);
            const cursor = collection.find(null, {
                sort: { $vector: embedding },
                limit: 10,
            });
            const documents = await cursor.toArray();
            const docsMap = documents?.map((doc) => doc.text);
            docContext = JSON.stringify(docsMap);
        } catch (error) {
            console.log("Error querying Astra DB:", error);
            docContext = "";
        }

        const chatData: HuggingFaceChatRequest = {
            model: CHAT_MODEL,
            messages: [
                {
                    role: "system",
                    content: `You are a helpful assistant that provides clear and concise answers to questions about medical bills, insurance, and healthcare costs.

                    Use the following context to inform your responses:
                    --------------------
                    START CONTEXT
                    ${docContext}
                    END CONTEXT
                    --------------------

                    If the context does not contain the answer, respond based on your existing knowledge, but do not reference the source or mention what is or isn't included in the context.

                    Keep responses accurate, concise, and formatted in plain text. Do not generate images or unnecessary formatting.`
                },
                {
                    role: "user",
                    content: latestMessage,
                },
            ],
            stream: false,
        };

        const answer = await callLlama(chatData, env.HUGGINGFACE_API_TOKEN);

        const formattedAnswer = answer
            .replace(/(\d+\.)/g, "\n$1")
            .replace(/•/g, "\n•");

        return Response.json({
            id: "chatcmpl-xxx",
            object: "chat.completion",
            created: Date.now(),
            model: CHAT_MODEL,
            choices: [
                {
                    index: 0,
                    finish_reason: "stop",
                    message: {
                        role: "assistant",
                        content: formattedAnswer,
                    },
                },
            ],
        });

    } catch (error) {
        console.error("API /api/chat error:", error);
        return new Response("Error: " + error, { status: 500 });
    }
}
