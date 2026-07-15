# ClearBill Design

## Thesis

ClearBill should feel like reviewing a real Explanation of Benefits with a careful advocate beside it, not like using a generic chatbot. The paper record is the primary artifact; explanation and evidence stay visibly secondary.

## Primary Flow

1. Select one claim line.
2. Compare provider charge, plan-allowed amount, and patient balance.
3. Ask a bounded question about that line.
4. Read the explanation beside the public sources that support it.

## Signature Interaction

The selected service stays synchronized between the EOB table and the review panel. Its three monetary values remain visible before a question is asked so the user never loses the claim context.

## Constraints

- Keep all patient, provider, and amount data explicitly synthetic.
- Never imply coverage determination, diagnosis, or payment advice.
- Preserve the document-first layout and compact professional density.
- Use motion only for direct feedback; no decorative dashboard animation.
- On narrow screens, preserve reading order: statement, review, evidence, safety boundary.
