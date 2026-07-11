import { DataAPIClient } from "@datastax/astra-db-ts";
import { pipeline } from "@huggingface/transformers";
import "dotenv/config";
import puppeteer, { type Page } from "puppeteer";

const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";
const VECTOR_DIMENSION = 384;
const CHUNK_SIZE = 512;
const CHUNK_OVERLAP = 100;
const REQUIRED_ENV_KEYS = [
    "ASTRA_DB_NAMESPACE",
    "ASTRA_DB_COLLECTION",
    "ASTRA_DB_API_ENDPOINT",
    "ASTRA_DB_APPLICATION_TOKEN",
] as const;

type RequiredEnv = Record<(typeof REQUIRED_ENV_KEYS)[number], string>;
type SimilarityMetric = "cosine" | "euclidean" | "dot_product";
type FeatureExtractionPipeline = (
    input: string,
    options: { pooling: "mean"; normalize: boolean }
) => Promise<{ data: Iterable<number> }>;

const clearbillData = [
    "https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleId=56908",
    "https://www.ama-assn.org/practice-management/cpt/cpt-professional-code-descriptors",
    "https://www.aapc.com/codes/cpt-codes-range/",
    "https://www.healthcare.gov/blog/understanding-your-health-insurance-bill/",
    "https://www.bcbs.com/articles/how-read-your-explanation-benefits-eob",
    "https://www.verywellhealth.com/how-to-read-your-doctors-bill-1738623",
    "https://www.humana.com/medicare/support/billing/explaining-bill",
    "https://www.cigna.com/knowledge-center/healthcare-costs/understanding-your-medical-bill",
    "https://www.fairhealthconsumer.org/",
    "https://www.healthcarebluebook.com/",
    "https://www.cms.gov/hospital-price-transparency",
    "https://www.nerdwallet.com/article/insurance/how-to-read-your-medical-bill",
    "https://www.consumerfinance.gov/about-us/blog/how-to-dispute-medical-bill/",
    "https://www.kff.org/faqs/what-to-know-about-surprise-medical-bills/",
    "https://www.aha.org/factsheet/2023-07-25-fact-sheet-understanding-hospital-billing-and-pricing",
    "https://www.cms.gov/nosurprises",
    "https://www.consumerfinance.gov/ask-cfpb/category-medical-bills/",
    "https://www.npr.org/2022/01/03/1069763473/no-surprises-act-medical-bills",
];

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

function splitText(text: string, chunkSize = CHUNK_SIZE, chunkOverlap = CHUNK_OVERLAP) {
    const normalizedText = text.replace(/\s+/g, " ").trim();
    const chunks: string[] = [];
    let start = 0;

    while (start < normalizedText.length) {
        const end = Math.min(start + chunkSize, normalizedText.length);
        chunks.push(normalizedText.slice(start, end));

        if (end === normalizedText.length) {
            break;
        }

        start = Math.max(end - chunkOverlap, start + 1);
    }

    return chunks;
}

async function scrapePage(page: Page, url: string) {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    return page.evaluate(() => ({
        text: document.body?.innerText ?? "",
        title: document.title,
    }));
}

async function main() {
    const env = getRequiredEnv();
    const client = new DataAPIClient(env.ASTRA_DB_APPLICATION_TOKEN);
    const db = client.db(env.ASTRA_DB_API_ENDPOINT, {
        keyspace: env.ASTRA_DB_NAMESPACE,
    });
    const embedder = (await pipeline("feature-extraction", EMBEDDING_MODEL)) as unknown as FeatureExtractionPipeline;

    async function createCollection(similarityMetric: SimilarityMetric = "dot_product") {
        try {
            const result = await db.createCollection(env.ASTRA_DB_COLLECTION, {
                vector: {
                    dimension: VECTOR_DIMENSION,
                    metric: similarityMetric,
                },
            });
            console.log("Collection created:", result);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            if (!message.toLowerCase().includes("already")) {
                throw error;
            }
            console.log(`Collection "${env.ASTRA_DB_COLLECTION}" already exists; continuing.`);
        }
    }

    async function loadSourceData() {
        const collection = await db.collection(env.ASTRA_DB_COLLECTION);
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        try {
            for (const url of clearbillData) {
                console.log(`Scraping: ${url}`);
                const { text, title } = await scrapePage(page, url);

                if (!text) {
                    console.warn(`No content scraped from: ${url}`);
                    continue;
                }

                for (const chunk of splitText(text)) {
                    const output = await embedder(chunk, { pooling: "mean", normalize: true });
                    const vector = Array.from(output.data);

                    const result = await collection.insertOne({
                        $vector: vector,
                        text: chunk,
                        source: url,
                        title,
                        publisher: new URL(url).hostname.replace(/^www\./, ""),
                    });

                    console.log("Inserted chunk:", result.insertedId);
                }
            }
        } finally {
            await browser.close();
        }
    }

    await createCollection();
    await loadSourceData();
}

main().catch((error) => {
    console.error("Failed to load ClearBill.AI source data:", error);
    process.exitCode = 1;
});
