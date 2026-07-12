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


### Additional completed controls

- ✅ T17 — Added tests proving career-to-course and career-to-skill relationships resolve.
- ✅ T46 — Added a CI boundary scanner preventing unapproved service-role client imports.
- ✅ T58 — Expanded SEO checks to enforce shared metadata, structured data, breadcrumbs and primary internal links.
- ✅ T59 — Added catalogue source, verification-date, slug, institution-image and attribution health checks.
- ✅ T60 — Added per-asset and total production bundle budgets after build.

### RLS proof harness prepared

Added direct Supabase REST integration tests for anonymous catalogue access, anonymous private-table isolation, learner ownership, cross-learner denial, role-escalation denial and administrator moderation access. These tests use dedicated test credentials from `.env.test.example` and skip explicitly when credentials are unavailable. They are not marked complete until executed against the configured Supabase test environment.


### Route and content contract coverage

- ✅ T16 — Course filters and course detail schema are covered by deterministic tests.
- ✅ T18 — Institution media covers primary and fallback rendering paths.
- ✅ T19 — Funding matching and NSFAS advisory outcomes are covered.
- ✅ T20 — Opportunity filtering, expiry and reminder dates are covered.
- ✅ T22 — Supported-language validation and preference persistence are covered.
- T21 implementation prepared — guide lookup, related glossary resolution and Article/HowTo schema construction now share a deterministic contract with regression tests. It remains unchecked in the shared completion document until the repository quality workflow proves the clean-checkout test run.

**Files added or updated:** `src/lib/catalogue-filters.ts`, `src/lib/funding-guidance.ts`, `src/lib/guide-detail.ts`, `src/lib/seo-schema.ts`, `src/lib/i18n.tsx`, route consumers, and their corresponding tests.

**Evidence boundary:** The GitHub connector reports no workflow run for commit `75d3be0de6428e3191a0a02655b46c0d24b6ba89`. T21 is implemented but not represented as fully complete until CI evidence exists.


### Homepage fallback coverage

T15 implementation prepared: extracted the homepage deadline-feed selection policy into `src/lib/home-deadlines.ts`, covered empty/null live-query results, fallback preservation, live-row selection and missing-field normalisation, and wired the landing route to the tested policy. It remains unchecked until the clean-checkout workflow proves the suite.


### Qualification path and report coverage

- T12 implementation prepared — moved existing-qualification matching from the route into `src/lib/qualification-match.ts`; added regression coverage for Diploma/Degree paths, NQF clamping, blank-input defaults, stable fallback careers and non-verified advisory wording.
- T26 implementation prepared — moved match PDF generation into `src/lib/match-report.ts`; added tests for PDF structure, control-character escaping, long-line wrapping and byte-accurate xref offsets. The byte-offset correction prevents malformed reports when learner content contains multibyte characters.

Both tasks remain unchecked in the shared completion document until the quality workflow produces clean-checkout evidence.


### Explicit RLS CI lane

- Separated unit coverage from credential-dependent RLS integration proof.
- Added `test:unit` and fail-closed `test:integration:rls` commands.
- Added an `rls-integration` Actions job, gated by `RLS_TESTS_REQUIRED=true`, with dedicated test-project secrets.
- Updated the RLS harness to throw when required credentials are absent instead of reporting skipped cases as proof.
- Updated `docs/testing.md` with the enablement and branch-protection contract.

T51 and T53 remain unchecked until repository administrators configure the variable/secrets, require the job and a clean workflow run passes.


### CI contract and learner-trust corrections

- Added `scripts/check-rls-ci-contract.mjs` and enforced it locally and in Actions so the RLS lane cannot silently lose its fail-closed command or required secret mappings.
- Corrected the unit-test command to use Bun's documented exact-path discovery instead of an unsupported ignore flag.
- Corrected homepage headings that described unverified catalogue records as “Verified pathways” and “Verified information.”
- Expanded content-health enforcement to funding and opportunity slugs, sources, HTTPS links, verification states and verification dates.

The production Actions runner remains externally unavailable through the connector; no evidence-pending checklist item was promoted to ✅.


### Testimonial accessibility and moderation policy

- Added native required, length, autocomplete and descriptive-help semantics to the learner testimonial form.
- Replaced raw testimonial backend errors with a stable public failure message.
- Added accessibility-source enforcement for the testimonial semantics.
- Extracted `prepareTestimonialSubmission` and tested consent denial, whitespace normalization, public-field bounds and the mandatory `approved: false` moderation default.
- Aligned README and the combined local gate with the explicit unit/RLS lanes.

T39 remains unchecked because repository tests now prove the submission policy, but live learner RLS insertion and administrator moderation still require the credentialed integration lane.


### Expanded credentialed authorization proof

The isolated RLS suite now additionally covers:

- institution-role catalogue/moderation visibility (T35 preparation);
- learner testimonial insertion with `approved: false`, administrator approval and cleanup (T39 preparation);
- learner denial and administrator success for `mark_stale_catalogue_records` (T40 preparation).

Added the dedicated institution test token to the environment template, Actions secret mapping and CI-contract regression check. T35, T39 and T40 remain unchecked until the configured test project executes these cases successfully.


### Material testimonial schema correction

Repository review found the homepage using the legacy `testimonials` table with fields that do not exist in its committed Supabase type contract, while migration `20260708121200_learner_testimonials.sql` defines the intended consent-aware `learner_testimonials` table.

Corrected the homepage, submission policy, unit tests and RLS integration suite to use `learner_testimonials`, `user_id`, `display_name` and `moderation_state`. Reconciled the committed Supabase types, removed the unsafe custom client cast, validated stored language values, and added a local/CI schema-contract check preventing regression to the legacy table.

This was a production-affecting cross-model contract defect. T39 remains evidence-pending until the credentialed RLS job passes against the deployed test schema.


### Homepage state completion preparation

Added and tested explicit `loading`, `live` and `fallback` states for the homepage deadline feed. The status now begins with “Checking live catalogue…”, resolves to the live or curated label after the query, and announces the state change through a polite status region. T15 remains unchecked pending the clean workflow run.


### Learner document security correction

Funding uploads contained an undocumented `document_consents` client cast, accepted files without an application-level byte/MIME boundary, exposed raw backend errors and could leave an orphaned sensitive object when consent recording failed.

Corrected the flow to:

- validate PDF/PNG/JPEG/WebP files with a 5 MB maximum;
- sanitise filenames and preserve owner-scoped object paths;
- write consent through the typed `consent_records` table with document metadata in JSON context;
- remove the uploaded object if consent persistence fails;
- return a stable public error instead of storage/database details;
- test upload validation and deterministic paths;
- exercise user-A/user-B storage isolation with cleanup in the credentialed RLS suite;
- enforce the contract locally and in CI.

T38 is implemented in source and its direct proof is prepared, but remains unchecked until the credentialed RLS job passes.


### Repository-wide public error boundary

Extended error scrubbing beyond the partner API:

- funding document, reminder and saved-profile errors now use stable public messages;
- account OTP, OAuth and sign-out flows no longer render provider/Supabase exception text;
- added a recursive route scanner for raw exception messages in public UI state and JSON responses;
- enforced the scanner locally and in CI.

Also removed the homepage live-catalogue `unknown` client cast and now use the generated Supabase contract directly.


### Renewable RLS test identities

Replaced the CI dependency on expiring stored JWTs with runtime authentication for dedicated test accounts. The harness now supports recommended email/password secrets for two learners, an administrator and an institution-role user, derives learner IDs from authenticated sessions, and retains token/id overrides only for local debugging. Updated the environment template, workflow mappings, CI-contract checks and testing documentation.
