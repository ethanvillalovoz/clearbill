# ClearBill.AI Demo Strategy

ClearBill.AI is best presented as a reproducible local demo plus screenshots or a short walkthrough video. It should not advertise a public live demo unless the Astra DB collection, Hugging Face access, data handling, and deployment security expectations are intentionally maintained.

## Current Public Demo

- README screenshot gallery:
  - `docs/Homepage.png`
  - `docs/example.png`
- Local reproduction through the README quick start.

## Why Not GitHub Pages

GitHub Pages only hosts static files. It cannot run:

- The Next.js API route.
- Astra DB vector search requests.
- Hugging Face chat completion calls.
- Local embedding generation.
- Server-side environment variables and secrets.

For that reason, a GitHub Pages link would only show static frontend assets unless the app backend and service configuration were hosted elsewhere.

## Recommended Public Demo Format

The strongest next demo artifact would be a short GIF or video that shows:

1. Opening the ClearBill.AI chat interface.
2. Asking a billing or insurance terminology question.
3. Retrieving context from the vector store.
4. Receiving a grounded Markdown-formatted explanation.
5. Asking one follow-up question.

Use synthetic or public sample billing language only. Do not show real medical bills, patient data, or protected health information.

## Local Reproduction Checklist

Before recording a walkthrough:

- Install dependencies with `npm ci` inside `nextjs-clearbill-ai/`.
- Configure `.env` with Astra DB and Hugging Face credentials.
- Run `npm run browsers:install` before the first seed run.
- Seed the vector database with `npm run seed`.
- Start the app with `npm run dev`.
- Verify responses use non-sensitive sample inputs.

## If A Hosted Demo Is Added Later

A real public live demo should only be linked after:

- Astra DB and Hugging Face credentials are stored as server-side secrets.
- The source corpus and ingestion path are documented.
- Sample prompts avoid protected health information.
- Rate limits, expected costs, and model latency are understood.
- The README clearly labels the hosted demo as maintained and educational.
