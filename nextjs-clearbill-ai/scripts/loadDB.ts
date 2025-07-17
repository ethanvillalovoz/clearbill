import { DataAPIClient } from '@datastax/astra-db-ts'
import { PuppeteerWebBaseLoader } from 'langchain/document_loaders/web/puppeteer'
import { pipeline } from '@xenova/transformers'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import "dotenv/config"

// Supported similarity metrics for Astra DB vector search
type SimilarityMetric = 'cosine' | 'euclidean' | 'dot_product'

// Load environment variables
const { 
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_API_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN
} = process.env

// Initialize Astra DB client and database
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, { keyspace: ASTRA_DB_NAMESPACE })

// Configure text splitter for chunking scraped content
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
})

// List of URLs to scrape and embed
const clearbillData = [
    'https://www.cms.gov/medicare-coverage-database/view/article.aspx?articleId=56908',
    'https://www.ama-assn.org/practice-management/cpt/cpt-professional-code-descriptors',
    'https://www.aapc.com/codes/cpt-codes-range/',
    'https://www.healthcare.gov/blog/understanding-your-health-insurance-bill/',
    'https://www.bcbs.com/articles/how-read-your-explanation-benefits-eob',
    'https://www.verywellhealth.com/how-to-read-your-doctors-bill-1738623',
    'https://www.humana.com/medicare/support/billing/explaining-bill',
    'https://www.cigna.com/knowledge-center/healthcare-costs/understanding-your-medical-bill',
    'https://www.fairhealthconsumer.org/',
    'https://www.healthcarebluebook.com/',
    'https://www.cms.gov/hospital-price-transparency',
    'https://www.nerdwallet.com/article/insurance/how-to-read-your-medical-bill',
    'https://www.consumerfinance.gov/about-us/blog/how-to-dispute-medical-bill/',
    'https://www.kff.org/faqs/what-to-know-about-surprise-medical-bills/',
    'https://www.aha.org/factsheet/2023-07-25-fact-sheet-understanding-hospital-billing-and-pricing',
    'https://www.cms.gov/nosurprises',
    'https://www.consumerfinance.gov/ask-cfpb/category-medical-bills/',
    'https://www.npr.org/2022/01/03/1069763473/no-surprises-act-medical-bills'
]

// Main async function to orchestrate scraping, embedding, and DB loading
async function main() {
    // Initialize Hugging Face embedding pipeline
    const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')

    /**
     * Create a new Astra DB collection for vector storage.
     * @param similarityMetric - The similarity metric to use for vector search.
     */
    const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
        const res = await db.createCollection(ASTRA_DB_COLLECTION, {
            vector: {
                dimension: 384, // Must match the embedding model output dimension
                metric: similarityMetric,
            }
        })
        console.log('Collection created:', res)
    }

    /**
     * Scrape, split, embed, and insert data from all URLs.
     */
    const loadSampleData = async () => {
        const collect = await db.collection(ASTRA_DB_COLLECTION)
        for await (const url of clearbillData) {
            console.log(`Scraping: ${url}`)
            const content = await scrapePage(url)
            if (!content) {
                console.warn(`No content scraped from: ${url}`)
                continue
            }
            const chunks = await splitter.splitText(content)
            for await (const chunk of chunks) {
                // Generate embedding for each chunk
                const output = await embedder(chunk, { pooling: 'mean', normalize: true })
                const vector = Array.from(output.data)

                // Insert into Astra DB
                const res = await collect.insertOne({
                    $vector: vector,
                    text: chunk
                })
                console.log('Inserted chunk:', res)
            }
        }
    }

    /**
     * Scrape the main HTML content from a URL using Puppeteer.
     * @param url - The URL to scrape.
     * @returns The plain text content of the page.
     */
    const scrapePage = async (url: string): Promise<string> => {
        const loader = new PuppeteerWebBaseLoader(url, {
            launchOptions: {
                headless: true
            },
            gotoOptions: {
                waitUntil: 'domcontentloaded'
            },
            evaluate: async (page, browser) => {
                const result = await page.evaluate(() => document.body.innerHTML)
                await browser.close()
                return result
            }
        })
        // Remove HTML tags from the scraped content
        return (await loader.scrape())?.replace(/<[^>]*>/gm, '') || ''
    }

    // Run the collection creation and data loading
    await createCollection()
    await loadSampleData()
}

// Start the process
main()