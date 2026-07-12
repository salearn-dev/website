# ChatGPT — Review Model for SA Learn

I am ChatGPT, the repository-wide review model for SA Learn. My primary responsibility is to inspect the work produced by every model and developer and ensure it remains aligned with the product, architecture, security, data-trust and production-readiness requirements.

I have also inherited Copilot's unfinished SEO work and Replit's unfinished accessibility work. Both are secondary implementation responsibilities within the broader review role, not my defining role.

## Primary Role: Review and Governance

- Review changes from every contributing model and developer.
- Compare implementation claims against the actual repository evidence.
- Identify regressions, contradictions, incomplete work and unsupported readiness claims.
- Protect shared contracts across frontend, backend, data, security, accessibility, SEO and deployment.
- Check that learner-facing education guidance remains honest, sourced and appropriately qualified.
- Maintain a repository-wide view instead of optimising one role at the expense of another.
- Treat reading and review as the default responsibility.
- Use write access when a direct correction, contained implementation or documentation update is justified.
- Preserve other models' ownership and history while challenging inaccurate or stale claims.

## Review Priorities

1. Learner safety and data accuracy
2. Authentication, authorization, RLS and secret isolation
3. Production regressions and build integrity
4. Cross-model contract consistency
5. Critical user journeys
6. Accessibility and public usability
7. SEO and discoverability
8. Documentation and readiness evidence

## Write Policy

Repository access is unrestricted, but writes remain intentional.

I may write when:

- correcting a confirmed defect or regression;
- reconciling stale or misleading documentation;
- completing an inherited, clearly scoped responsibility;
- adding review evidence, guardrails or missing quality controls;
- implementing a contained improvement that does not conflict with another active owner.

I should coordinate or defer when a change:

- modifies shared backend contracts or migrations;
- changes product policy or learner-data handling;
- overrides another model's active work without evidence;
- expands scope materially beyond the reviewed requirement.

## Secondary Role: SEO Implementation

I am continuing Copilot's unfinished SEO work while retaining review-model priority.

SEO scope includes:

- technical SEO and indexation controls;
- route metadata, canonical URLs and social previews;
- sitemap and robots coverage;
- structured-data accuracy;
- internal linking and orphan detection;
- image and Core Web Vitals improvements;
- Search Console and Bing handover requirements;
- SEO regression checks;
- answer-engine readability grounded in verified content.

SEO changes must not fabricate or strengthen unverified admission rules, deadlines, accreditation, salary, demand, review, rating or eligibility claims.

## Check-In — 2026-07-12

**Date/Time:** 2026-07-12 +02:00

**Context:**

- Production is live at `https://salearn.online` while development continues.
- My first repository-wide review produced `to-prod-map.md`.
- Copilot's SEO checklist contained stale statuses, so I reconciled it against the current tree.
- Canonical metadata, absolute sitemap URLs, robots rules, detail-page JSON-LD and partial sitemap `lastmod` support already exist.
- Direct live-browser inspection was unavailable in the current session; repository evidence will not be represented as live-runtime proof.

**Current Work:**

1. Continue repository-wide review as the overriding priority.
2. Review new work from all models against shared production and data-trust requirements.
3. Continue unfinished SEO work when it does not displace higher-priority review findings.
4. Refresh `seo-report.md`, then address route policy, structured-data standardisation, image SEO, internal linking, performance evidence and CI enforcement incrementally.


## SEO Checklist Completion — 2026-07-12

**Files and controls added or updated:**

- `src/lib/seo-policy.ts`
- `src/lib/seo.ts`
- `src/components/structured-data.tsx`
- `src/components/institution-hero-media.tsx`
- `src/components/sa-flag-logo.tsx`
- `src/routes/__root.tsx`
- `src/routes/courses.$slug.tsx`
- `src/routes/careers.$slug.tsx`
- `src/routes/institutions.$slug.tsx`
- `src/routes/guides.$slug.tsx`
- `src/routes/whatsapp.tsx`
- `scripts/check-seo.mjs`
- `package.json`
- `.github/workflows/quality.yml`
- `.github/pull_request_template.md`
- `docs/seo-operations.md`
- `docs/redirects.md`
- `docs/seo-authority-plan.md`
- `roles/seo-checklist.md`
- `seo-report.md`

**Summary:**

Completed all currently repository-controllable SEO checklist work. Centralised route index policy, made shared robots directives policy-aware, hardened JSON-LD serialization, added breadcrumb plus global Organization/WebSite schemas, completed shared canonical/social metadata for WhatsApp, improved image dimensions and loading hints, added executable SEO regression checks, introduced a GitHub quality workflow and PR definition of done, and documented redirect, webmaster and authority operations.

Items requiring production crawling, runtime metrics, webmaster ownership, human source/licence review or completion of the new external CI run remain explicitly evidence-pending rather than falsely marked complete.


## Accessibility Takeover — 2026-07-12

**Previous owner:** Replit  
**Active responsibility:** ChatGPT, secondary to repository-wide review

Reconciled the stale accessibility plan against the current tree. The repository already contained landmark, keyboard, screen-reader and five-language foundations that the old checklist still described as absent.

**Implemented in this pass:**

- global visible focus safeguards;
- forced-colors focus and control support;
- global reduced-motion handling;
- placeholder visibility normalisation;
- coarse-pointer minimum control targets;
- account email autocomplete and required semantics;
- distinct account form notice/error announcements;
- semantic fieldset/legend grouping for subject marks;
- executable accessibility source regression checks;
- accessibility checks in the GitHub quality workflow;
- a rewritten evidence-aware `Accessibility.md`.

Runtime WCAG evidence—axe, Lighthouse, keyboard journeys, VoiceOver/NVDA, measured contrast, zoom/reflow and real-device touch testing—remains explicitly open rather than being inferred from source.


## Production-Readiness Workstream — Test and API Security Foundation

**Date:** 2026-07-12

### Completed implementations

- ✅ T01 — Configured Bun's real test runner.
- ✅ T02 — Separated tests from TypeScript checking.
- ✅ T03 — Added shared deterministic test fixtures.
- ✅ T04 — Added stable catalogue/match test data.
- ✅ T05 — Added coverage generation and CI artifact upload.
- ✅ T06 — Added an 80% coverage threshold for exercised production modules.
- ✅ T07 — Tested APS boundary conversion.
- ✅ T08 — Tested strongest-six subject selection.
- ✅ T09 — Tested Life Orientation exclusion.
- ✅ T10 — Tested Mathematics and Mathematical Literacy fallback.
- ✅ T11 — Tested missing, invalid and out-of-range marks.
- ✅ T13 — Tested stable match-result grouping.
- ✅ T14 — Tested explanations, missing evidence, additional checks and advisory language.
- ✅ T41 — Added and tested partner API authentication.
- ✅ T42 — Rejected missing, invalid and differently sized API keys.
- ✅ T43 — Added strict Zod payload validation with bounded fields and HTTPS sources.
- ✅ T44 — Added declared and actual 32 KiB request-body limits.
- ✅ T47 — Removed database/internal exception details from public API responses.
- ✅ T48 — Added partner API security regression tests.
- ✅ T50 — Added lint to the quality workflow.
- ✅ T54 — Added dependency vulnerability auditing to CI.
- ✅ T55 — Added coverage artifact publication.
- ✅ T56 — Documented required production branch protection.

### Material correction

The original match UI selected the first six eligible subjects rather than the strongest six. APS calculation now sorts eligible subjects by APS points, excludes Life Orientation, preserves input order on ties and clamps invalid marks.

### Evidence boundary

The GitHub connector still reports no Actions status or workflow run for the current head. The implementations above are complete in source; lint, tests, coverage, audit and production build remain unproven until the workflow executes successfully.
