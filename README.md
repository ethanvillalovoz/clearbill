# ClearBill.AI: The Medical Bill Explainer

[![CI](https://github.com/ethanvillalovoz/clearbill-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/clearbill-ai/actions/workflows/ci.yml)
[![CD](https://github.com/ethanvillalovoz/clearbill-ai/actions/workflows/cd.yml/badge.svg)](https://github.com/yourusername/clearbill-ai/actions/workflows/cd.yml)
![License](https://img.shields.io/github/license/ethanvillalovoz/clearbill-ai)

---

## 🩺 Introduction

**ClearBill.AI** is an AI-powered chatbot that helps users understand confusing medical bills. It leverages Retrieval-Augmented Generation (RAG) to provide clear, context-aware explanations using real healthcare data and advanced language models.

---

## 📖 Description

ClearBill.AI combines a vector database (Astra DB), local embeddings, and a large language model (Llama-3.1-8B-Instruct) to answer user questions about medical bills, insurance, and healthcare costs. It scrapes trusted healthcare sources, embeds the content, and uses semantic search to retrieve relevant information for each user query.

---

## 🖼️ Visuals

![ClearBill.AI Chat UI Screenshot](docs/Homepage.png)
![ClearBill.AI Example Response Screenshot](docs/example.png)

---

## 🛠️ Prerequisites / Requirements

- Node.js v18+
- npm
- Astra DB account ([Sign up here](https://astra.datastax.com))
- Hugging Face account & API token ([Get token](https://huggingface.co))
- (Optional) Vercel account for deployment

---

## ⚙️ Technologies Used

- **Next.js** (React framework)
- **TypeScript**
- **Astra DB** (Vector database)
- **@xenova/transformers** (Local embeddings)
- **LangChain** (Text splitting, document loading)
- **Llama-3.1-8B-Instruct** (LLM via Hugging Face)
- **Puppeteer** (Web scraping)
- **react-markdown** (Markdown rendering)

---


## 🛠️ Astra DB Configuration

To use ClearBill.AI, you must set up an Astra DB vector database:

1. **Create a Database**
   - Go to [Astra DB](https://astra.datastax.com) and click **Create Database**.
   - Choose **Serverless (vector)** as the database type.
   - Name your database (e.g., `clearbill-ai`).  
     *Note: The name cannot be changed later.*
   - **Provider:** Select **Amazon Web Services**.
   - **Region:** Select **us-east-2**.

2. **Create a Keyspace and Collection**
   - The `loadDB.ts` script will automatically create the required collection with the correct vector dimension and similarity metric.

3. **Get Your Credentials**
   - After the database is created, go to the **Connect** tab to find your:
     - Database ID
     - Region
     - Keyspace
     - Application Token

4. **Set Environment Variables**
   - Add these values to your `.env` file as shown in the QuickStart section.

---

## 📦 Loading Data with `loadDB.ts`

ClearBill.AI uses a script to scrape, split, embed, and load healthcare data into Astra DB.  
You can customize this process to load your own data sources.

**To use the loader:**

1. **Edit the URLs**
   - Open `nextjs-clearbill-ai/scripts/loadDB.ts`.
   - Update the `clearbillData` array with the URLs you want to scrape and embed.

2. **Run the Loader**
   ```sh
   cd nextjs-clearbill-ai
   npm run seed
   ```
   - This will:
     - Scrape each URL
     - Split the content into chunks
     - Generate embeddings
     - Insert the chunks and vectors into your Astra DB collection

**Note:**  
- The script will create the collection if it does not exist.
- Make sure your `.env` file is set up with the correct Astra DB credentials before running the script.

---

## 🚀 QuickStart Guide

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/clearbill-ai.git
   cd clearbill-ai
   ```

2. **Install dependencies**
   ```sh
   cd nextjs-clearbill-ai
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `nextjs-clearbill-ai` directory and add your Astra DB and Hugging Face credentials:

   ```env
   ASTRA_DB_NAMESPACE=your_astra_db_keyspace
   ASTRA_DB_COLLECTION=your_collection_name
   ASTRA_DB_API_ENDPOINT=your_astra_db_api_endpoint
   ASTRA_DB_APPLICATION_TOKEN=your_astra_db_application_token
   HUGGINGFACE_API_TOKEN=your_hugging_face_api_key
   ```

4. **Seed the database**
   Run the seed script to scrape data and populate your vector database:
   ```sh
   npm run seed
   ```

5. **Run the development server**
   ```sh
   npm run dev
   ```

6. **Open your browser and navigate to**
   ```
   http://localhost:3000
   ```

---

## 📚 Usage

- Ask questions about your medical bills, insurance, and healthcare costs.
- Get clear, context-aware explanations and itemizations.
- Understand your healthcare expenses better with trusted information.

---

## 🧑‍🤝‍🧑 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on how to contribute to this project.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Astra DB](https://astra.datastax.com) for the vector database
- [Hugging Face](https://huggingface.co) for the Llama-3.1-8B-Instruct model
- [Puppeteer](https://pptr.dev) for web scraping
- [react-markdown](https://github.com/remarkjs/react-markdown) for markdown rendering