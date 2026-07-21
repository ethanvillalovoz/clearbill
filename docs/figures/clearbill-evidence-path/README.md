# ClearBill RAG-architecture figure

This directory contains the public offline/online architecture overview and its traceable code inputs.

| File | Purpose |
| --- | --- |
| `contract.md` | Communication job, architecture scope, and safety boundary |
| `provenance.json` | Input and output checksums plus source revision |
| `editable/clearbill-evidence-path.pptx` | Editable composition |
| `exports/clearbill-evidence-path.svg` | README-ready vector export |
| `exports/clearbill-evidence-path.png` | Raster review export |
| `exports/clearbill-evidence-path.pdf` | Print/preflight artifact |
| `media/demo-answer.png` | Archival local demo capture; not an input to the architecture figure |
| `preflight/` | PowerPoint, final-size, grayscale, and PDF checks |

The evidence-plane schematic shows offline corpus construction and online question answering meeting at the same Astra vector collection, then exposes the single retrieval gate that separates refusal from context-only generation. It documents maintained code paths and does not claim billing correctness, retrieval quality, or coverage determination.
