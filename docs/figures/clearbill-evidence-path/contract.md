# Figure contract: ClearBill RAG architecture

## Communication job

This figure should let a technical reviewer follow ClearBill from an offline public-guidance corpus build into the shared vector collection, then through the online retrieve, refuse-or-generate, and cited-response path.

## Figure form

A shared-state evidence-plane schematic. Offline corpus construction enters a dominant central Astra collection from above, while the online question path reaches the same collection from the left. Retrieval leaves the store through one evidence gate whose two orthogonal branches either refuse on empty text or proceed through a grounded prompt and hosted model.

## Visual encoding

The figure directly reuses ClearBill's product tokens on a paper background: blue marks corpus and question flow, teal marks embedding and grounded prompting, yellow marks shared evidence and its gate, and coral marks refusal. Topology and labels remain redundant with color.

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
