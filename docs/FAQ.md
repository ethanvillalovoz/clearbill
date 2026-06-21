# FAQ

## Is ClearBill.AI medical, legal, insurance, or financial advice?

No. ClearBill.AI is an educational project that explains common billing language and healthcare-cost concepts. Users should confirm important billing decisions with their provider, insurer, or another qualified professional.

## Can I upload real medical bills?

Not by default. Do not use real patient health information or sensitive billing records unless you have reviewed the deployment, data handling, compliance, retention, and access-control requirements for your use case.

## What data powers the assistant?

The seed script scrapes configured healthcare-related web pages, chunks the text, generates local embeddings, and stores the result in Astra DB for vector search.

## Why use retrieval-augmented generation?

Medical billing questions often depend on terminology and context. Retrieval gives the model relevant source snippets before it answers, which helps keep responses grounded in the indexed corpus.

## Where do I configure the source URLs?

Update the `clearbillData` array in `nextjs-clearbill-ai/scripts/loadDB.ts`, then run `npm run seed` from `nextjs-clearbill-ai/`.
