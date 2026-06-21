# ClearBill.AI App

This directory contains the Next.js App Router application for ClearBill.AI.

For the full project overview, setup guide, architecture notes, and contribution workflow, see the repository-level [README](../README.md).

## Local Commands

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Environment

Copy `.env.example` to `.env` and fill in the Astra DB and Hugging Face values before running the app or seed script.

Run `npm run browsers:install` before the first `npm run seed` call so Puppeteer has a local browser binary for scraping.
