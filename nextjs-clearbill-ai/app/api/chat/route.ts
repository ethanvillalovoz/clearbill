import { DataAPIClient } from "@datastax/astra-db-ts";
import { pipeline } from "@xenova/transformers";
import fetch from "node-fetch";

// -----------------------------
// Load environment variables
// -----------------------------
const { 
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_API_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN,
    HUGGINGFACE_API_TOKEN
} = process.env;

// -----------------------------
// Astra DB Client Setup
// -----------------------------
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { keyspace: ASTRA_DB_NAMESPACE });

// -----------------------------
// Embedding Pipeline (local)
// -----------------------------
const embedderPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

// -----------------------------
// Helper: Call Hugging Face Chat Completions API
// -----------------------------
async function callMistral(data) {
    const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
            headers: {
                Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
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
    const result = await response.json();
    return result.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
}

// -----------------------------
// Main API Route Handler
// -----------------------------
export async function POST(req: Request) {
    try {
        // Parse request body and extract messages
        const body = await req.json();
        const messages = body.messages ?? [];
        const latestMessage = messages.length > 0 ? messages[messages.length - 1]?.content : "";

        let docContext = "";

        // -----------------------------
        // Get embedding for the latest message
        // -----------------------------
        const embedder = await embedderPromise;
        const output = await embedder(latestMessage, { pooling: 'mean', normalize: true });
        const embedding = Array.from(output.data);

        // -----------------------------
        // Query Astra DB for relevant documents
        // -----------------------------
        try {
            const collection = await db.collection(ASTRA_DB_COLLECTION);
            const cursor = collection.find(null, {
                sort: { $vector: embedding },
                limit: 10
            });
            const documents = await cursor.toArray();
            const docsMap = documents?.map(doc => doc.text);
            docContext = JSON.stringify(docsMap);
        } catch (error) {
            console.log("Error querying Astra DB:", error);
            docContext = "";
        }

        // -----------------------------
        // Prepare chat completion payload
        // -----------------------------
        const chatData = { 
            model: "meta-llama/Llama-3.1-8B-Instruct:nebius", // Use the model string with provider suffix!
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
                    content: latestMessage
                }
            ],
            stream: false
        };

        // -----------------------------
        // Generate response from Hugging Face API
        // -----------------------------
        const answer = await callMistral(chatData);

        // -----------------------------
        // Format the answer for better Markdown rendering
        // -----------------------------
        const formattedAnswer = answer
            // Add a newline before each number or bullet for better Markdown rendering
            .replace(/(\d+\.)/g, '\n$1')
            .replace(/•/g, '\n•');

        // -----------------------------
        // Return OpenAI-style JSON response
        // -----------------------------
        return Response.json({
            id: "chatcmpl-xxx",
            object: "chat.completion",
            created: Date.now(),
            model: "meta-llama/Llama-3.1-8B-Instruct:nebius",
            choices: [
                {
                    index: 0,
                    finish_reason: "stop",
                    message: {
                        role: "assistant",
                        content: formattedAnswer
                    }
                }
            ]
        });

    } catch (error) {
        console.error("API /api/chat error:", error);
        return new Response("Error: " + error, { status: 500 });
    }
}