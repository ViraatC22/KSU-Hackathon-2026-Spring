# Ndalama AI

Ndalama AI is a KSU FinTech Spring 2026 hackathon demo for exploring financial inclusion in Zambia. It combines a synthetic-data dashboard with explainable credit scoring, cross-platform transaction views, a financial-advisor demo, lending simulations, Chilimba savings-circle views, district inclusion maps, and a local document OCR boundary.

## Status

The repository is a complete, reproducible **interactive demo**, not a production banking platform. Its principal dashboard flow builds and runs locally, validation tests cover request boundaries, and the OCR service has tested upload limits and failure behavior. Financial records, applications, and savings-circle mutations remain non-persistent demo responses. Dashboard people, balances, transactions, scores, and documents are synthetic.

Do not use this project to make real credit, identity, lending, or fraud decisions.

## Capabilities

- Credit profiles with transparent factor contributions and bias-audit visualizations
- Synthetic MTN Money, Airtel Money, and Zoona ledger and network views
- Fraud and reconciliation demonstrations
- Rule-based financial-advisor fallback, with optional Anthropic tool-use responses
- Lending marketplace views and an interactive rate simulator
- Chilimba savings-circle health and contribution views
- Zambia district financial-inclusion heatmaps
- Real local image upload to a validated Tesseract OCR service

The larger event-driven product proposal is retained in `UPGRADE1.md` as future design material; it is not presented as implemented functionality.

## Architecture

```text
Browser
  └── Next.js 16 application (apps/web)
        ├── synthetic dashboard modules and API routes
        ├── Zod request validation
        ├── optional Anthropic advisor boundary
        ├── optional PostgreSQL/Prisma demo-auth boundary
        └── /api/documents proxy
              └── FastAPI OCR service (services/ml-engine)
                    └── local Tesseract process
```

The web dashboard runs without PostgreSQL or an Anthropic key. Prisma is generated during install, but a database connection is only needed for the optional demo credentials route. Without `ANTHROPIC_API_KEY`, the advisor uses deterministic local fallback responses.

## Prerequisites

- Node.js 20.19 or newer (Node 24 is used in CI)
- npm
- Python 3.11 or newer
- Tesseract on `PATH` for actual OCR (`brew install tesseract` on macOS or `apt install tesseract-ocr` on Debian/Ubuntu)
- PostgreSQL only if enabling the unfinished demo-auth boundary

## Setup

Install both applications:

```bash
make setup
```

Or install them independently:

```bash
cd apps/web
npm ci

cd ../../services/ml-engine
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-dev.txt
```

For optional integrations, copy the safe template:

```bash
cp .env.example apps/web/.env
```

Replace example values locally. Never commit `.env` files.

## Run locally

Start the OCR service:

```bash
cd services/ml-engine
.venv/bin/uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

In another terminal, start the web app:

```bash
cd apps/web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter the dashboard. The OCR health endpoint is [http://localhost:8000/health](http://localhost:8000/health).

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | No | Enables Anthropic advisor calls; local fallback is used otherwise |
| `ML_SERVICE_URL` | No | OCR service base URL; defaults to `http://localhost:8000` |
| `MAX_DOCUMENT_BYTES` | No | Upload ceiling shared by the web proxy and OCR service; defaults to 10 MiB |
| `CORS_ORIGINS` | No | Comma-separated OCR origins; defaults to `http://localhost:3000` |
| `DATABASE_URL` | Demo auth only | PostgreSQL connection for Prisma |
| `NEXTAUTH_SECRET` | Demo auth only | NextAuth signing secret |
| `NEXTAUTH_URL` | Demo auth only | NextAuth public URL |
| `ENABLE_DEMO_AUTH` | No | Must be `true` to allow credentials demo auth |
| `DEMO_OTP` | Demo auth only | Locally chosen demo code; no default is committed |

Credentials auth is disabled by default. It does not implement SMS delivery and does not protect the public synthetic dashboard.

## Verification

After `make setup`, run the canonical check:

```bash
make verify
```

This runs:

- ESLint
- TypeScript checking
- Vitest validation tests
- Next.js production build
- FastAPI/Pillow upload and OCR-boundary tests

Focused commands:

```bash
cd apps/web && npm run verify
cd services/ml-engine && .venv/bin/python -m pytest -q
```

GitHub Actions runs the same web and ML checks on pushes to `main` and pull requests.

## API behavior

- `GET /api/credit`, `/api/transactions`, `/api/lending`, `/api/chilimba`, `/api/heatmap`, and `/api/documents` return synthetic demo datasets.
- `POST /api/lending` and `POST /api/chilimba` validate and calculate preview responses but explicitly return `persisted: false`.
- `POST /api/chat` limits message/history sizes and falls back locally if Anthropic is unavailable.
- `POST /api/documents` accepts JPEG, PNG, TIFF, or WebP up to the configured limit, then proxies the image to `/ml/document-ocr`.
- The OCR service holds uploads in memory, validates content and dimensions, does not persist the image, and returns recognized text plus conservative pattern-matched fields.

## Database

The Prisma schema and initial migration document the proposed persistent model. If testing demo auth with a local PostgreSQL database:

```bash
cd apps/web
npx prisma migrate dev
```

No seed script or login page is currently included, so this boundary is intentionally not part of the verified principal demo flow.

## Deployment

No production deployment configuration is committed. A deployment would require:

1. Hosting the Next.js app and FastAPI service separately.
2. Installing Tesseract in the ML service image.
3. Setting `ML_SERVICE_URL` to the private service address.
4. Applying authentication, authorization, persistent storage, rate limits, retention rules, and Zambian regulatory review before accepting real financial or identity data.

## Security and privacy

- Local secrets and `.env` files are ignored.
- The former hard-coded OTP was removed; demo credentials require explicit environment configuration.
- Upload types, byte size, pixel count, document type, chat history, filters, and financial input ranges are validated.
- OCR uploads are processed in memory and are not written to disk by this implementation.
- The dashboard contains synthetic names and financial examples. Do not upload real identity documents to an untrusted deployment.

`npm audit` has no critical findings after the dependency recovery. The current latest Next.js release still inherits published high-severity advisories through its bundled `postcss` and `sharp` versions; no patched Next.js release is available in the registry at this recovery point. See `docs/FINAL_STATUS.md`.

## Repository structure

```text
apps/web/                 Next.js UI, APIs, tests, Prisma schema
services/ml-engine/       FastAPI OCR service and tests
docs/                     Audit, completion plan, and final report
.github/workflows/ci.yml  Reproducible CI checks
Makefile                  Setup and verification entry points
UPGRADE1.md               Unimplemented future architecture proposal
```

## Known limitations

- Most dashboard data is generated in memory and changes between processes.
- Demo POST responses do not persist.
- Authentication is an optional incomplete demo boundary, not access control.
- OCR field extraction uses a small conservative regex set and requires Tesseract.
- No browser end-to-end suite or production deployment is configured.
- The advisor fallback does not write transactions despite conversational wording.

## Repository

Remote: [ViraatC22/KSU-Hackathon-2026-Spring](https://github.com/ViraatC22/KSU-Hackathon-2026-Spring)

No license file is present; no open-source license is granted by this repository.
