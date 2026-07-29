# Project audit

Audit date: 2026-07-29

## 1. Project purpose

Ndalama AI is a KSU FinTech Spring 2026 hackathon demonstration of financial-inclusion tooling for Zambia. Repository evidence supports an interactive synthetic dashboard, not the production-grade multi-service platform described in parts of the original README and `UPGRADE1.md`.

## 2. Existing architecture

- Next.js App Router frontend and route handlers in `apps/web`
- Prisma 7 schema and one PostgreSQL migration
- In-memory synthetic data generators used by pages and APIs
- Optional Anthropic client in the advisor route with a rule-based fallback
- NextAuth credentials route backed by Prisma, but no login page or dashboard guard
- FastAPI service intended for document OCR

## 3. Functionality found working

- Landing page and 12 dashboard screens
- Credit score, transaction, fraud, advisor, lending, Chilimba, heatmap, and document showcase views
- Synthetic API datasets
- Explainable rate and credit calculations
- Production compilation after manually generating Prisma

## 4. Broken functionality found

- A clean `npm ci` did not generate Prisma, so the initial production build failed.
- The Python OCR route returned only `status: stub`.
- The document upload controls had no event handler.
- `POST` APIs accepted unbounded or incorrectly typed values.
- Credentials auth accepted a committed universal OTP.
- The web child README was the untouched Next.js template.
- The documented setup, test, and production claims did not match the repository.

## 5. Missing functionality

- No persistent transaction, loan, circle, or document mutation flow
- No production authentication/authorization
- No SMS OTP delivery, seed script, or login page
- No production fraud model, event bus, Redis integration, deployment config, or real mobile-money adapters
- No browser end-to-end suite

These are outside the strongest coherent hackathon-demo scope supported by the implementation and are not silently represented as complete.

## 6. Build and runtime problems

- Prisma client generation was a manual undocumented prerequisite.
- Next.js 14 and React 18 were behind current supported majors and had critical audit findings.
- Next.js 16 surfaced invalid CSS import ordering and stricter React hook/compiler issues.
- The ML pins included an unused NumPy version incompatible with the available Python 3.14 environment.
- Tesseract is not installed on the recovery host.

## 7. Dependency problems

The original install reported 31 npm advisories, including a critical `next-auth` issue. Unused CLI/runtime packages expanded the attack surface. Dependencies were upgraded/pruned and Python requirements were pinned to tested Python 3.14-compatible releases.

The latest available Next.js 16.2.12 still bundles vulnerable `postcss`/`sharp` versions according to the 2026-07-29 npm advisory database. There is no patched Next.js release available, so unsafe forced transitive overrides were not introduced.

## 8. Security concerns

- Removed universal hard-coded OTP and disabled demo credentials by default.
- Added limits and enums for chat, queries, loan previews, circle previews, and image uploads.
- Restricted OCR CORS methods/headers and removed credentialed cross-origin requests.
- OCR validates MIME type, byte count, decoded image, pixel count, and document type.
- Uploads are processed in memory and not persisted.
- The public dashboard remains synthetic and unauthenticated; it must not host real user data.

No committed `.env` or secret-bearing file was found. A local ignored `apps/web/.env` was preserved and its values were never printed.

## 9. Testing gaps

Before recovery there were no tests. Vitest now covers web validation schemas, and pytest covers OCR health, supported types, invalid images, successful extraction, document types, and missing Tesseract behavior. Browser end-to-end coverage remains a documented future enhancement.

## 10. Documentation gaps

The root README overstated implementation and the child README contained generator boilerplate. Neither provided a verified canonical command. Both are now operational and scope-accurate.

## 11. Deployment gaps

There is no container, Vercel, or infrastructure configuration. Production deployment remains inappropriate until authentication, authorization, storage, service isolation, regulatory review, and upstream dependency advisories are resolved.

## 12. Accessibility and usability gaps

The dashboard uses semantic controls in most flows, but no automated accessibility or keyboard-navigation suite exists. The repaired upload control exposes disabled/loading/error states and an alert role. A full WCAG audit remains unperformed.

## 13. Completion definition

The project is complete as an interactive hackathon demo when:

- clean installs generate required clients;
- lint, type checking, tests, and production build pass;
- the principal dashboard flow is operational;
- document upload reaches a validated real OCR boundary;
- optional/external behavior fails safely;
- synthetic/non-persistent behavior is labeled honestly;
- repository setup, security boundaries, and limitations are documented;
- CI reproduces local checks.

## 14. Prioritized implementation plan

1. Recover and modernize the reproducible web toolchain.
2. Validate API inputs and remove insecure demo defaults.
3. Implement bounded OCR processing and connect the upload UI.
4. Add focused web/ML tests and canonical verification.
5. Correct documentation and add CI.
6. Verify, inspect secrets/diff, commit, and push.

## 15. Known blockers and assumptions

- Real OCR requires the external Tesseract binary; the service reports this precisely with HTTP 503.
- Anthropic behavior cannot be validated without a user-owned API key; the local fallback is verified by build and input tests.
- PostgreSQL demo auth is excluded from the principal flow because no seed/login/guard implementation exists.
- Latest-Next transitive advisories are blocked on upstream patched releases.
