# ChatGPT Persistent Production-Readiness Queue

Owner: ChatGPT review model  
Repository: `salearn-dev/website`  
Rule: Continue through this queue without waiting for another “go.” Do not mark evidence-dependent work complete without execution proof. Update `models/GPT.md` after material changes.

## Queue A — Source contracts and security

- [ ] Re-scan every route for undocumented Supabase casts and schema drift.
- [x] Reconcile generated types with committed migrations used by runtime code. ✅
- [x] Audit role-gated writes for correct moderation and verification states. ✅
- [x] Audit learner-owned tables and storage paths for ownership, cleanup and consent. ✅
- [x] Audit public/server errors for leaked provider, database or secret detail. ✅
- [x] Audit and correct public API idempotency and collision behavior. ✅
- [ ] Prove the deployed distributed rate-limit handoff.
- [x] Audit auth redirects, provider failures, session state and sign-out behavior. ✅
- [x] Audit sensitive upload MIME, size, path and rollback boundaries. ✅
- [x] Keep schema, moderation, sensitive-data and server-only contract scanners enforced. ✅

## Queue B — Deterministic tests

- [ ] Extract remaining route-local business rules into environment-independent modules.
- [x] Test homepage, Ask, Match, course, career, institution, funding, opportunity and guide edge cases. ✅
- [x] Test empty, invalid, stale, missing-source and fallback states. ✅
- [x] Test report generation, long content, sanitization and deterministic ordering. ✅
- [x] Test institution and partner submission validation. ✅
- [x] Test catalogue mapping and trust-status normalization. ✅
- [x] Test multilingual fallback and persistence boundaries. ✅
- [x] Test source rendering and internal relationship integrity. ✅

## Queue C — RLS and integration proof

- [ ] T31 anonymous catalogue access.
- [ ] T32 anonymous private-table denial.
- [ ] T33 learner ownership isolation.
- [ ] T34 cross-learner denial.
- [ ] T35 institution submission/moderation permissions.
- [ ] T36 administrator permissions.
- [ ] T37 unauthorized role-escalation denial.
- [ ] T38 learner-document storage isolation and cleanup.
- [ ] T39 testimonial submission, privacy, approval and cleanup.
- [ ] T40 stale-record RPC permissions.
- [x] Keep runtime-authenticated test identities renewable. ✅
- [ ] Require the credentialed RLS job before marking any item above ✅.

## Queue D — Accessibility and SEO

- [x] Re-scan forms for labels, constraints, autocomplete and live-region semantics. ✅
- [x] Re-scan menus, dialogs, disclosure widgets and focus return. ✅
- [ ] Re-scan loading, error, empty and reduced-motion behavior.
- [x] Validate detail routes, breadcrumbs, canonicals and structured data. ✅
- [x] Validate crawlable internal links and prevent orphan routes. ✅
- [x] Prevent unsupported verified/trusted/sourced wording and actions with enforced source contracts. ✅
- [ ] Prepare axe route coverage once browser dependencies can be locked safely.
- [ ] Preserve explicit manual keyboard, screen-reader, contrast, zoom and reflow evidence boundaries.

## Queue E — CI and runtime smoke

- [x] Keep unit, coverage and credentialed integration lanes separate. ✅
- [x] Keep lint, typecheck, build, audit and bundle budgets blocking. ✅
- [x] Expand built-preview smoke across safe public and system routes. ✅
- [ ] Add failure artifacts and actionable diagnostics without leaking secrets.
- [x] Verify workflow syntax and contract mappings after every workflow edit. ✅
- [ ] Check commit status periodically; absence of Actions evidence is not completion.
- [ ] Prepare Playwright journeys once dependencies and browser installation are approved.
- [ ] Require branch protection for verification and RLS jobs.

## Queue F — Remaining 60-list position

- [ ] T12, T15, T21 and T26: promote only after clean unit/coverage proof.
- [ ] T23–T25 and T27–T30: execute browser/authenticated journeys.
- [ ] T31–T40: execute credentialed RLS suite.
- [ ] T45: prove distributed production rate limiting.
- [ ] T49: prove lint on a clean checkout.
- [ ] T51 and T53: prove CI unit/integration and RLS/API lanes.
- [ ] T52: add and prove browser smoke in CI.
- [ ] T57: add and prove axe coverage.
- [ ] Mark each proven item ✅ in the shared Google Doc.
- [ ] Recalculate official and source-prepared percentages after every evidence run.

## Checkout condition

Checkout only when all repository-scoped items above are either:

1. implemented and proven;
2. explicitly assigned to an external owner with a documented blocking dependency; or
3. determined inapplicable with repository evidence.

At checkout, read and follow Kuzi’s current orders, update `models/GPT.md`, and leave an exact handoff.
