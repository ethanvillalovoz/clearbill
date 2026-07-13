# Demo Strategy

ClearBill has a deterministic, credential-free demo built into the default Next.js configuration. It uses public fixture questions, answers, and source references, and the interface labels the corpus as demo data.

The verified walkthrough in `docs/media/clearbill-demo.mp4` is captured from the running product at a 1280 x 720 viewport. It shows a synthetic claim, service-line selection, the review state, the educational answer, and the source panel without implying that Astra DB or a hosted model is running. `docs/media/clearbill-poster.webp` preserves the final reviewed state for surfaces that do not play video.

A hosted live demo should only be published after rate limits, cost controls, source refreshes, logging, abuse controls, and data-handling expectations are documented. Do not record or process real bills, account numbers, diagnoses, member identifiers, or protected health information.
