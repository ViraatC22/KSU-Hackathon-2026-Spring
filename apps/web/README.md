# Ndalama AI web application

The operational project guide lives in the [repository README](../../README.md). This directory contains the Next.js application, Prisma schema, API routes, and web validation tests.

From this directory:

```bash
npm ci
npm run dev
npm run verify
```

The post-install hook generates the Prisma client automatically. Copy the repository `.env.example` to `apps/web/.env` only when you need to configure optional integrations.
