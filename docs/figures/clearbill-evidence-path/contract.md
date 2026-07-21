# Figure contract: ClearBill evidence path

## Communication job

This figure should allow a skeptical technical reviewer to understand how ClearBill keeps a synthetic statement, bounded question, retrieved public guidance, context-only generation, source inspection, and refusal behavior separate.

## Supported claim

The credential-free demo exposes a complete synthetic EOB and deterministic answer beside three public guidance references. In live mode, the server validates a bounded message history, embeds the latest user question, retrieves at most six Astra passages, refuses when no usable text is returned, and otherwise asks the configured model to answer only from the assembled context.

## Evidence used

- `docs/figures/clearbill-evidence-path/media/demo-answer.png` for the completed deterministic EOB review state.
- `nextjs-clearbill-ai/app/data/demo.ts` for the three demo sources and fixture answers.
- `nextjs-clearbill-ai/app/lib/chat.ts` for input bounds and the context-only prompt.
- `nextjs-clearbill-ai/app/api/chat/route.ts` for query embedding, six-passage retrieval, refusal, source deduplication, timeout, and response assembly.
- `nextjs-clearbill-ai/scripts/loadDB.ts` for curated-source ingestion and chunk embedding.

## Evidence boundary

- Every displayed patient, provider, date, identifier, and amount is synthetic.
- Demo answers are deterministic fixtures, not live retrieval or model output.
- The figure makes no medical, legal, insurance, financial, retrieval-quality, compliance, or outcome claim.
- Retrieval relevance does not guarantee a correct explanation, and ClearBill does not determine coverage or whether a balance is owed.

## Selection rule

The figure uses the complete default synthetic statement after asking the bundled “What is an Explanation of Benefits?” question. The three committed demo references and the live no-evidence branch are shown without selecting favorable retrieval output.

## Delivery formats

- Editable source: `editable/clearbill-evidence-path.pptx`
- README export: `exports/clearbill-evidence-path.svg`
- Review export: `exports/clearbill-evidence-path.png`
- Print/preflight export: `exports/clearbill-evidence-path.pdf`
