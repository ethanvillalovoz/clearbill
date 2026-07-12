# Security Policy

## Supported Versions

Security fixes are considered for the default branch of this repository.

## Reporting a Vulnerability

Please do not open a public issue for vulnerabilities involving credentials, data exposure, prompt-injection risks, or protected health information.

Instead, contact the maintainer privately through the contact information on [ethanvillalovoz.com](https://ethanvillalovoz.com).

## Sensitive Data Guidelines

- Do not commit `.env` files or API tokens.
- Do not upload real medical bills, patient records, or protected health information.
- Redact secrets and personally identifying details from screenshots, logs, and bug reports.
- Review deployment, logging, and storage settings before adapting this project to real billing data.
- Keep Astra DB and Hugging Face credentials server-side; only `NEXT_PUBLIC_CLEARBILL_MODE` may be exposed to the browser.
- Preserve the context-only generation rule. Falling back to ungrounded model knowledge is a safety regression.
- Treat corpus ingestion as untrusted input and review source changes before reseeding a production collection.

This repository is not represented as HIPAA compliant and should not be deployed for real patient data without a separate legal, security, privacy, and infrastructure review.
