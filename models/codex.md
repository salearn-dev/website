# Codex Model Log

**Model name:** Codex
**Date:** 2026-07-06 16:00:26 +02:00
**Assigned role for this task:** Learner-facing `/courses`, `/funding`, and presentational accessibility production-readiness improvements.
**Files or areas expected to touch:** `src/lib/data.ts`, `src/routes/courses.tsx`, `src/routes/funding.tsx`, `src/routes/opportunities.tsx`, `src/components/site-header.tsx`, `src/components/site-footer.tsx`, `src/routes/prod-readiness.tsx`, `models/codex.md`.
**Files or areas to avoid:** Auth, saved profiles, backend PDF services, ingestion, cron, reminders, partner APIs, RLS, POPIA enforcement, deployment secrets, and unrelated route work.
**Task summary:** Complete the approved WCAG presentational pass, `/courses` city/delivery filtering, and `/funding` deadline reminder draft batch.
**Known risks:** Accessibility changes are a presentational pass, not a full external WCAG certification. Course city/delivery fields and funding reminders are prototype guidance and need verified data/backend scheduling before production claims.
**Completion report location:** This file.

All Codex updates for SA Learn should be recorded here so other assigned AI models and developers can see what changed, when it changed, and where to continue.

## Current Focus

Working through approved 65% readiness batches. Current implementation adds the clarified final batch: presentational WCAG improvements, honest course city/delivery filters, and public funding reminder drafts, then updates `/prod-readiness` only for approved completed items.

## Accessibility Pass, Course Filters, and Funding Reminder Drafts

**Date/Time:** 2026-07-06 16:00:26 +02:00

**Files Modified:**

- `src/lib/data.ts`
- `src/routes/courses.tsx`
- `src/routes/funding.tsx`
- `src/routes/opportunities.tsx`
- `src/components/site-header.tsx`
- `src/components/site-footer.tsx`
- `src/routes/prod-readiness.tsx`
- `models/codex.md`

**Short Plain English Description:**
Added explicit prototype `city` and `deliveryMode` fields to courses, then upgraded `/courses` filters so learners can honestly filter by NQF level, cost, city, and delivery mode. Added a public `/funding` reminder helper that opens prefilled email and WhatsApp reminder drafts without saving learner data or scheduling backend jobs. Completed a presentational accessibility pass across navigation, filters, result summaries, buttons, links, and readiness progress labels. `/prod-readiness` now marks the course filter, funding deadline reminder, and WCAG presentational audit items complete at prototype level.

## Skills Tracks and Career Mapping

**Date/Time:** 2026-07-06 15:41:38 +02:00

**Files Modified:**

- `src/lib/data.ts`
- `src/routes/skills.tsx`
- `src/routes/careers.$slug.tsx`
- `src/routes/prod-readiness.tsx`
- `models/codex.md`

**Short Plain English Description:**
Added public curated learning tracks to `/skills`, including step-by-step learning guidance, practice tasks, time/difficulty labels, related career links, and related course links derived from existing SA Learn prototype data. Career detail pages now link their skill chips back to the skills overview. `/prod-readiness` now marks "Curated learning tracks" and "Skill-to-career mapping" as complete at public prototype level.

## Public Bursary Matcher

**Date/Time:** 2026-07-06 15:21:38 +02:00

**Files Modified:**

- `src/routes/funding.tsx`
- `src/routes/prod-readiness.tsx`
- `models/codex.md`

**Short Plain English Description:**
Added a public client-side bursary and funding matcher to `/funding`. Learners can select broad study area, funding need, and institution type, then see prototype funding cards ranked with plain-English reasons. The matcher does not save a profile or request sensitive documents, and it warns learners to confirm eligibility, deadlines, and documents with official sources. `/prod-readiness` now marks "Bursary matcher based on profile" as complete at public prototype level.

## Institution Profiles, Accreditation Notes, and Application Windows

**Date/Time:** 2026-07-06 14:43:05 +02:00

**Files Modified:**

- `src/lib/data.ts`
- `src/routes/institutions.tsx`
- `src/routes/institutions.$slug.tsx`
- `src/routes/sitemap[.]xml.ts`
- `src/routes/prod-readiness.tsx`
- `models/codex.md`

**Short Plain English Description:**
Added static-dynamic institution profile pages at `/institutions/:slug` using one fixed detail template. Each profile shows institution type, campuses, funding notes, accreditation/registration wording, official register/source links, application-window placeholders, trust metadata, JSON-LD, and clear "needs confirmation" warnings. Institution list cards now link into detail pages, sitemap includes institution detail URLs, and `/prod-readiness` marks institution profiles, accreditation/register linkage, and application windows as complete at prototype presentation level.

## Public NSFAS Eligibility Guide

**Date/Time:** 2026-07-06 14:43:05 +02:00

**Files Modified:**

- `src/routes/funding.tsx`
- `src/routes/prod-readiness.tsx`
- `models/codex.md`

**Short Plain English Description:**
Added a client-side NSFAS eligibility guide to `/funding` that asks broad public questions about citizenship, institution type, income band, and study route. It does not save personal information, request documents, or claim approval. It gives "likely worth checking" or "needs careful confirmation" guidance with an official NSFAS link, and `/prod-readiness` now marks the NSFAS eligibility wizard as complete at public prototype level.

## Daily Checkout Report

**Date/Time:** 2026-07-05 20:00:00 +02:00

**Files Modified:**

- `models/codex.md`

**Short Plain English Description:**
Logged Codex's end-of-day status for 2026/07/05. Today I completed and pushed contained frontend/readiness updates for local logo fallback, local `/prod-readiness` gate support, course detail pages with Course JSON-LD, career detail pages and route fix, guide glossary and structured how-tos, match NBT/additional-test awareness with a downloadable PDF report, opportunity filters, and the readiness tracker update to 50%. AppDeploy was explored and then intentionally dropped after the external connection path failed; future work should continue directly in this repo with GitHub as source of truth.

**Where I Left Off:**
No active Codex implementation is in progress. Next work should start from `main`, read `plan.md`, `SA_Learn.md`, `models/codex.md`, `models/lovable.md`, and `/prod-readiness`, then choose the next contained learner-facing item for approval before editing.

## Match Report, NBT Awareness, and Opportunity Filters

**Date/Time:** 2026-07-05 18:35:11 +02:00

**Files Modified:**

- `src/routes/match.tsx`
- `src/routes/opportunities.tsx`
- `src/lib/data.ts`
- `src/routes/prod-readiness.tsx`
- `models/codex.md`

**Short Plain English Description:**
Added NBT and additional-test awareness to prototype match results, including clear "needs confirmation" language where official rules are not verified. Added a client-side downloadable match report as a PDF file containing APS, interest, grouped recommendations, reasons, met/missing requirements, additional checks, next steps, and verification warnings. Added province, sector, and type filters to `/opportunities` using static prototype fields, and updated `/prod-readiness` to mark only the three approved items complete, moving readiness to 50%.

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
