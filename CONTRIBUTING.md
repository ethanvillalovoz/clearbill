
# Contributing to ClearBill.AI

> Thank you for your interest in contributing! Your help makes ClearBill.AI better for everyone.

## Before You Start

- Do not commit API keys, `.env` files, medical bills, patient records, or protected health information.
- Open an issue first for major product, architecture, dependency, or data-ingestion changes.
- Keep pull requests focused so they are easy to review.

## Local Setup

```sh
git clone https://github.com/ethanvillalovoz/clearbill.git
cd clearbill-ai/nextjs-clearbill-ai
npm ci
cp .env.example .env.local
```

The default demo does not need credentials. Set `NEXT_PUBLIC_CLEARBILL_MODE=live` and fill in `.env.local` only when testing live retrieval.

## Development Checks

Run these commands before opening a pull request:

```sh
npm run check
```

Use `npm run seed` only when you intentionally want to scrape configured source URLs and write embeddings into Astra DB.

## Issues

For bug reports, include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser, OS, and Node.js version
- Screenshots or logs when useful

For feature requests, include:

- The user problem
- The proposed behavior
- Any tradeoffs or alternatives you considered

## Pull Requests

- Create your branch from `main`.
- Use clear commit messages.
- Update documentation when setup, behavior, or environment variables change.
- Include screenshots for visible UI changes.
- Reference related issues with `closes #123` when applicable.
- Confirm that `npm run check` passes locally.

## Code Style

- Prefer simple, typed TypeScript over clever abstractions.
- Keep API route side effects inside request handlers or lazy helpers.
- Add comments only where the code is not self-explanatory.
- Keep generated files, secrets, and local build artifacts out of version control.

## Community Guidelines

Be respectful, constructive, and specific. This project touches healthcare billing concepts, so clarity and user safety matter.
