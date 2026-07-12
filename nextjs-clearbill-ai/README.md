# ClearBill.AI App

This directory contains the Next.js App Router application for ClearBill.AI.

For the full project overview, setup guide, architecture notes, and contribution workflow, see the repository-level [README](../README.md).

## Local Commands

```sh
npm ci
npm run dev
npm run check
```

## Environment

Copy `.env.example` to `.env.local`. Demo mode works without credentials. Live mode and the seed script require the Astra DB and Hugging Face values.

Run `npm run browsers:install` before the first `npm run seed` call so Puppeteer has a local browser binary for scraping.
