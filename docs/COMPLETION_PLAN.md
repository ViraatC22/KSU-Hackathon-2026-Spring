# Completion plan

Updated: 2026-07-29

| ID | Task | Reason | Files/modules | Dependencies | Acceptance criteria | Verification | Status | Commit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M0-1 | Reconcile Git and remote state | Preserve repository safety | Git metadata | origin access | Clean baseline matches `origin/main` | `git status`, `git fetch --prune origin` | COMPLETED | `7dd4c88` |
| M1-1 | Make web install reproducible | Clean build originally lacked Prisma client | `apps/web/package.json`, Prisma config | npm | `npm ci` generates Prisma without a live DB | `npm ci`, `npm run build` | COMPLETED | `7dd4c88` |
| M1-2 | Upgrade supported web stack | Remove critical/direct outdated dependencies | web package and React code | npm registry | Latest stable Next/React compile; no critical npm advisories | `npm run verify`, `npm audit` | COMPLETED | `7dd4c88` |
| M2-1 | Validate web request boundaries | Prevent malformed/unbounded demo inputs | API routes, `src/lib/validation.ts` | Zod | Invalid inputs return 400/413/415 as applicable | Vitest + type check | COMPLETED | `7dd4c88` |
| M2-2 | Remove universal demo credential | Eliminate hard-coded OTP | NextAuth route, env template | optional PostgreSQL | Credentials disabled by default; OTP only from environment | lint/type/build review | COMPLETED | `7dd4c88` |
| M3-1 | Implement OCR service | Replace explicit stub | `services/ml-engine` | Pillow, pytesseract, Tesseract | Valid images process; invalid/large/missing-engine/timeout cases fail safely | 7 pytest cases | COMPLETED | `4bd0087` |
| M3-2 | Connect document upload UI | Existing controls were inert | documents page/API | running ML service | Selected supported image reaches OCR; UI shows loading/result/error | lint/type/build + manual code-path review | COMPLETED | `4bd0087` |
| M5-1 | Add canonical quality gates | No tests or shared verification existed | Makefile, tests, CI | Node/Python environments | `make verify` runs web and ML checks; CI mirrors them | local focused checks | COMPLETED | `4b62174` |
| M6-1 | Synchronize documentation | Original docs overstated scope | README, audit, plan | completed implementation | Setup/commands/scope/limits match code | command verification + diff review | COMPLETED | `4b62174` |
| M7-1 | Production deployment | Missing auth, storage, infrastructure, regulatory approval | future architecture | product decisions/infrastructure | Real-data controls and deployment defined | Not applicable | DEFERRED_WITH_REASON | Hackathon demo scope |
| M8-1 | Final verification and handoff | Establish honest final state | full repository | all prior tasks | All local gates pass and report is current | `make verify`, secret/diff scan | COMPLETED | `4b62174` verified baseline |
