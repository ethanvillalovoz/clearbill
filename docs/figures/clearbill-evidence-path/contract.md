# Figure contract: ClearBill RAG architecture

## Communication job

This figure should let a technical reviewer follow ClearBill from an offline public-guidance corpus build into the shared vector collection, then through the online retrieve, refuse-or-generate, and cited-response path.

## Figure form

A two-lane system architecture. The offline lane extracts and chunks 18 maintained public URLs, encodes them with MiniLM, and writes source-bearing vectors. The online lane validates the latest question, uses the same embedding space, retrieves at most six usable passages, refuses on empty evidence, or sends a context-only prompt to the hosted model.

## Visual encoding

The figure uses a clinical systems palette: blue identifies corpus construction and the successful response, cyan identifies the shared embedding space, amber marks shared retrieval state, violet traces online inference, and coral marks refusal. Every role is also labeled.

## Supported claim

One maintained seed path extracts 18 public guidance pages, chunks normalized text at 512 characters with 100-character overlap, creates normalized 384-dimensional MiniLM vectors, and stores source metadata in Astra DB. The live route validates a bounded message history, embeds the latest user question with the same model, retrieves at most six passages, refuses when none contain usable text, and otherwise returns a context-only model answer with up to four deduplicated sources.

## Evidence used

- `nextjs-clearbill-ai/app/lib/chat.ts` for input bounds and the context-only prompt.
- `nextjs-clearbill-ai/app/api/chat/route.ts` for query embedding, six-passage retrieval, refusal, source deduplication, timeout, and response assembly.
- `nextjs-clearbill-ai/scripts/loadDB.ts` for the maintained URL list, browser extraction, chunking, MiniLM embedding, and Astra writes.
- `nextjs-clearbill-ai/app/types.ts` for the source-bearing response contract.

## Evidence boundary

- The diagram describes live-capable code but does not contain a live run, patient data, or model output.
- The figure makes no medical, legal, insurance, financial, retrieval-quality, compliance, or outcome claim.
- Retrieval relevance does not guarantee a correct explanation, and ClearBill does not determine coverage or whether a balance is owed.

## Scope rule

Only branches, bounds, and dependencies verified in maintained source are shown. No retrieval result, medical conclusion, benchmark, or hosted-model performance is implied.

## Delivery formats

- Editable source: `editable/clearbill-evidence-path.pptx`
- README export: `exports/clearbill-evidence-path.svg`
- Review export: `exports/clearbill-evidence-path.png`
- Print/preflight export: `exports/clearbill-evidence-path.pdf`
