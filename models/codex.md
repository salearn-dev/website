# Codex Model Log

**Model name:** Codex
**Date:** 2026-07-05 18:04:52 +02:00
**Assigned role for this task:** Learner-facing `/guides` production-readiness improvements.
**Files or areas expected to touch:** `src/lib/data.ts`, `src/routes/guides.tsx`, `src/routes/guides.$slug.tsx`, `src/routes/sitemap[.]xml.ts`, `src/routes/prod-readiness.tsx`, `models/codex.md`.
**Files or areas to avoid:** Auth, RLS, ingestion, cron, backend verification, POPIA enforcement, deployment secrets, and unrelated route work.
**Task summary:** Complete the approved `/guides` glossary and structured how-to JSON-LD items as a separate pass.
**Known risks:** Guide content is plain-language prototype content and still needs official editorial/source review before production claims.
**Completion report location:** This file.

All Codex updates for SA Learn should be recorded here so other assigned AI models and developers can see what changed, when it changed, and where to continue.

## Current Focus

Guide readability and SEO readiness. Current task: complete only the approved `/guides` glossary and structured how-to items.

## Guide Glossary and Structured How-To Pages

**Date/Time:** 2026-07-05 18:04:52 +02:00

**Files Modified:**

- `src/lib/data.ts`
- `src/routes/guides.tsx`
- `src/routes/guides.$slug.tsx`
- `src/routes/sitemap[.]xml.ts`
- `src/routes/prod-readiness.tsx`
- `models/codex.md`

**Short Plain English Description:**
Added a plain-language glossary for APS, NQF, SAQA, DHET, NSFAS, TVET, accreditation, learnership, diploma, degree, and higher certificate. Expanded guide records with plain-language explanations, key points, related terms, and step-by-step how-to content. Added `/guides/:slug` detail pages that emit Article JSON-LD and HowTo JSON-LD when steps exist, linked guide URLs in the sitemap, and marked only the two approved `/guides` readiness items as complete.

## Career Detail Pages, Salary Bands, Outlooks, and Links

**Date/Time:** 2026-07-05 17:31:44 +02:00

**Files Modified:**

- `src/lib/data.ts`
- `src/routes/careers.tsx`
- `src/routes/careers.$slug.tsx`
- `src/routes/sitemap[.]xml.ts`
- `src/routes/prod-readiness.tsx`
- `models/codex.md`

**Short Plain English Description:**
Expanded career records with salary bands, demand outlooks, typical work, timeline steps, entry roles, related courses, and related skills. Added `/careers/:slug` static-dynamic detail pages using one fixed template per career slug, linked the career cards to those pages, added career detail URLs to the sitemap, and marked only the four approved `/careers` readiness items as complete. Guide work is intentionally untouched until confirmed.

## Career Detail Route Outlet Fix

**Date/Time:** 2026-07-05 17:46:12 +02:00

**Files Modified:**

- `src/routes/careers.tsx`
- `models/codex.md`

**Short Plain English Description:**
Fixed the local UI issue where `/careers/software-developer` and `/careers/business-analyst` changed the URL but still showed the `/careers` list. TanStack generated the slug route as a child of `/careers`, so the parent route now yields to an outlet when the pathname is a career detail URL.

## Local Prod-Readiness Gate Fallback

**Date/Time:** 2026-07-05 16:53:58 +02:00

**Files Modified:**

- `src/lib/gate.server.ts`
- `src/lib/gate.functions.ts`
- `models/codex.md`

**Short Plain English Description:**
Lovable's restricted `/prod-readiness` gate was crashing on localhost because `SESSION_SECRET` was missing, and its HTTPS-only cookie could not persist over `http://localhost`. Added development-only fallback gate values and kept production strict: production still requires real `SESSION_SECRET` and `SITE_PASSWORD`, while local development can unlock with the fallback key `local-dev` when no site password is configured.

## Local Flag Logo Fallback

**Date/Time:** 2026-07-05 16:18:11 +02:00

**Files Modified:**

- `src/components/sa-flag-logo.tsx`
- `src/components/site-header.tsx`
- `src/components/site-footer.tsx`
- `public/flag-south-africa.webp`
- `models/codex.md`

**Short Plain English Description:**
Added a shared SA flag logo component that tries the existing Lovable-hosted flag asset first and switches to a bundled `public/flag-south-africa.webp` fallback if the primary image fails. Header and footer now use the shared component so localhost can show the logo while production keeps using the original asset path.

## Course Detail Pages and Course JSON-LD

**Date/Time:** 2026-07-05 14:42:36 +02:00

**Files Modified:**

- `src/routes/courses.$slug.tsx`
- `src/routes/courses.tsx`
- `src/routes/sitemap[.]xml.ts`
- `src/routes/prod-readiness.tsx`
- `models/codex.md`

**Short Plain English Description:**
Added static-dynamic course detail pages at `/courses/:slug` using one fixed template that changes based on the selected course name and existing course fields. Linked course cards to their detail pages, added Course JSON-LD, included course detail URLs in the sitemap, wired the course filters to existing prototype fields, and updated production readiness to show course detail pages and Course structured data as complete at prototype level.

## Trust Metadata, Match Explanations, and Readiness Tracking

**Date/Time:** 2026-07-05 13:28:15 +02:00

**Files Modified:**

- `src/components/trust-metadata.tsx`
- `src/lib/data.ts`
- `src/routes/courses.tsx`
- `src/routes/funding.tsx`
- `src/routes/institutions.tsx`
- `src/routes/match.tsx`
- `src/routes/opportunities.tsx`
- `src/routes/prod-readiness.tsx`
- `src/routeTree.gen.ts`

**Short Plain English Description:**
Added visible trust metadata to education records, including source, source URL, verification status, and last-verified state. Improved the match results so learners see why a result appears, what requirements are met, what is missing or unverified, and what next step to take. Updated the production-readiness page with priority, owner, status, and the next incomplete item for each route. The production build passes after these changes.
