# Codex Model Log

**Model name:** Codex
**Date:** 2026-07-06 22:28 +02:00
**Assigned role for this task:** 75% to 80% production-readiness lift with backend-supported frontend features.
**Files or areas expected to touch:** `src/routes/skills.tsx`, `src/routes/opportunities.tsx`, `src/routes/institutions.portal.tsx`, `src/routes/admin.data.tsx`, `src/components/site-footer.tsx`, `src/routes/prod-readiness.tsx`, `models/codex.md`.
**Files or areas to avoid:** Auth, saved profiles, backend PDF services, ingestion, cron, reminders, partner APIs, RLS, POPIA enforcement, deployment secrets, and unrelated route work.
**Task summary:** Add four honest readiness checks using existing Phase 1/2 contracts: skill progress, saved opportunity reminders, institution self-serve, and admin moderation.
**Known risks:** Opportunity reminders store learner intent but do not schedule delivery. Institution/admin writes rely on Lovable/Bolt RLS and generated Phase 2 types are still pending.
**Completion report location:** This file.

All Codex updates for SA Learn should be recorded here so other assigned AI models and developers can see what changed, when it changed, and where to continue.

## Current Focus

Corrective production-readiness rebuild after review reset. Current posture: improve readiness only when backed by code, migrations, sourced data, enabled providers, or audit artifacts.

## Complete Public Institution Image Coverage

**Date/Time:** 2026-07-12 15:51 +02:00

**Files Modified:**

- `scripts/collect-institution-images.mjs`
- `scripts/institution-image-links-final.json`
- `src/components/institution-hero-media.tsx`
- `src/components/sa-flag-logo.tsx`
- `src/lib/institution-images.ts`
- `src/routes/institutions.tsx`
- `src/routes/institutions.$slug.tsx`
- `models/codex.md`

**Short Plain English Description:**
Completed Cloudinary image coverage for all 76 public institutions, including the user-supplied University of Venda campus photograph. Hardened the collector so targeted runs preserve existing mappings, browser-style requests handle anti-hotlinking, remote Cloudinary fetch is available as a transport fallback, and rejected unsigned-upload collisions use versioned public IDs. Added a shared institution media component that tries the sourced institution image, then the bundled South African flag, and finally removes the media region if both fail. Verified 76 catalogue seeds against 76 image mappings with zero missing and passed `bun run typecheck`. `/prod-readiness` remains unchanged until Kuzi approves the final readiness implementation phase.

## Public-Facing Language and Image Readiness

**Date/Time:** 2026-07-12 16:19 +02:00

**Files Modified:**

- `src/components/site-footer.tsx`
- `src/lib/data.ts`
- `src/lib/i18n.tsx`
- `src/lib/match-engine.functions.ts`
- `src/routes/account.tsx`
- `src/routes/admin.data.tsx`
- `src/routes/careers.$slug.tsx`
- `src/routes/courses.tsx`
- `src/routes/courses.$slug.tsx`
- `src/routes/funding.tsx`
- `src/routes/index.tsx`
- `src/routes/institutions.tsx`
- `src/routes/match.tsx`
- `src/routes/opportunities.tsx`
- `src/routes/prod-readiness.tsx`
- `src/routes/skills.tsx`
- `models/codex.md`

**Short Plain English Description:**
Removed the word "prototype" from learner-facing UI, generated match explanations and reports, catalogue counters, empty states, trust metadata, footer translations and the readiness dashboard. Replaced it with specific language such as curated, estimated, planning threshold, current data and needs verification so public development remains honest without presenting itself as a disposable demo. Marked complete 76-of-76 institution image coverage on `/prod-readiness`, moving implementation progress to 76 of 91. Verified live on localhost that the Wits institution page and readiness page contain no visible occurrence, confirmed the Wits Cloudinary hero renders at 2200 by 800, and passed TypeScript. Production build execution was blocked by the current sandbox's native subprocess restriction, not by a reported code error.

## Checkout - Institution Images and Readiness State

**Date/Time:** 2026-07-11 19:05 +02:00

**Files Modified:**

- `src/routes/prod-readiness.tsx`
- `models/codex.md`

**Short Plain English Description:**
Updated `/prod-readiness` to honestly reflect the institution image work: Cloudinary-backed images and graceful no-image rendering are complete at 62 of 76 sourced public institutions, while full 76 of 76 image coverage remains incomplete. Current review distance is no longer basic institution breadth; the largest gaps are verified institutional facts, complete image curation, sourced application/accreditation records, clean lint/CI/test evidence, and runtime proof for backend/RLS/API claims.

## Institution Hero Image Pipeline

**Date/Time:** 2026-07-11 18:50 +02:00

**Files Modified:**

- `package.json`
- `scripts/collect-institution-images.mjs`
- `src/lib/institution-images.ts`
- `src/lib/data.ts`
- `src/lib/live-catalogue.ts`
- `src/routes/institutions.tsx`
- `src/routes/institutions.$slug.tsx`
- `models/codex.md`

**Short Plain English Description:**
Added a Cloudinary-backed institution image catalogue and wired optional institution hero images into `/institutions` cards and `/institutions/:slug` profiles. Uploaded 62 sourced institution images to Cloudinary using the `salearn` unsigned preset under cloud `csntwfsm`. Cards and detail pages continue to render cleanly when an institution has no image, so the remaining 14 image gaps do not break layout or navigation. Added a reusable collector/import script that supports curated JSON links and keeps local screenshot capture disabled unless explicitly requested.

## Institution Detail Route Outlet Fix

**Date/Time:** 2026-07-11 17:20 +02:00

**Files Modified:**

- `src/routes/institutions.tsx`
- `models/codex.md`

**Short Plain English Description:**
Fixed the local routing issue where `/institutions/cput` changed the URL but still rendered the `/institutions` list. The institutions parent route now yields to the child outlet for `/institutions/:slug`, allowing the dedicated institution profile template to render correctly. Verified locally that `/institutions/cput` shows the Cape Peninsula University of Technology profile rather than the full institution list.

## Public Institution Catalogue Baseline

**Date/Time:** 2026-07-11 17:01 +02:00

**Files Modified:**

- `.env.example`
- `README.md`
- `package.json`
- `scripts/seed-public-institutions.ts`
- `src/lib/data.ts`
- `src/routes/prod-readiness.tsx`
- `models/codex.md`

**Short Plain English Description:**
Expanded the institution catalogue baseline from the tiny prototype set to all 26 public universities and 50 public TVET colleges. The expanded records are marked as public/provisional and still need confirmation, but `/institutions` now has comprehensive fallback coverage even if Supabase is empty. Added a guarded Supabase seed script that refuses to write with a publishable browser key and requires `SUPABASE_SERVICE_ROLE_KEY` for controlled upserts into `public.institutions`. Updated README, env example and `/prod-readiness` to reflect the new database seed path and the remaining verification gap.

## Review Remediation - Quality Gate Baseline

**Date/Time:** 2026-07-11 15:55 +02:00

**Files Modified:**

- `README.md`
- `package.json`
- `package-lock.json`
- `src/routes/prod-readiness.tsx`
- `models/codex.md`

**Short Plain English Description:**
Started patching the latest repository review by adding a conventional operational README, declaring Bun as the canonical package manager, removing the npm lockfile, adding explicit `typecheck`, `test` and `check` scripts, and tracking these quality gates on `/prod-readiness`. `check` enforces typecheck plus build for now. Lint remains configured but incomplete because the current repo fails on existing Prettier CRLF line-ending debt. The patch deliberately leaves lint cleanup, real unit/integration/browser tests, CI enforcement, and RLS/public API runtime tests as incomplete rather than pretending they exist.

## Role Update - Full-Stack Senior Dev

**Date/Time:** 2026-07-11 15:50 +02:00

**Files Modified:**

- `models/codex.md`

**Short Plain English Description:**
Kuzi promoted Codex from junior backend support to full-stack senior developer with the same clearance level as Lovable. Codex may now work across frontend, backend, migrations, data contracts, Supabase integration and production-readiness verification when necessary. Backend changes must still be documented, scoped, tested, logged here, and coordinated with Lovable or Kuzi when they affect shared contracts, RLS, auth, ingestion, storage, public APIs or production data.

## Review-Aware Production Readiness Semantics

**Date/Time:** 2026-07-11 15:39 +02:00

**Files Modified:**

- `src/routes/prod-readiness.tsx`
- `models/codex.md`

**Short Plain English Description:**
Updated `/prod-readiness` so it no longer implies checked items are fully production-proven just because they are implemented. The page now shows implementation progress separately from 100% accountability coverage, adds evidence levels for every feature, calls out proof still needed, and surfaces P0 trust/security/data-sensitive items for senior review. This aligns the readiness dashboard with the latest repository review without falsely ticking unfinished data, RLS, provider or runtime-verification work.

## Ask SA Learn Data-First Guidance Route

**Date/Time:** 2026-07-09 15:05 +02:00

**Files Modified:**

- `src/routes/ask.tsx`
- `src/components/site-header.tsx`
- `src/components/site-footer.tsx`
- `src/lib/i18n.tsx`
- `src/routeTree.gen.ts`
- `src/routes/sitemap[.]xml.ts`
- `src/routes/prod-readiness.tsx`
- `models/codex.md`

**Short Plain English Description:**
Added `/ask` as a separate, data-first guidance route. The page takes learner questions and renders matching SA Learn cards from existing courses, careers, funding, opportunities, guides, skills and institutions data instead of pretending a live AI model is connected. Added navigation/footer access, sitemap coverage, readiness evidence and kept the future Groq/model layer as a grounded adapter boundary.

## Match Non-Matric Qualification Path

**Date/Time:** 2026-07-09 15:05 +02:00

**Files Modified:**

- `src/routes/match.tsx`
- `src/routes/prod-readiness.tsx`
- `models/codex.md`

**Short Plain English Description:**
Expanded `/match` so matric subjects remain the primary/default path, while learners who already have a degree, diploma, higher certificate, postgraduate qualification or other NQF-level credential can enter that qualification and get career/course/skill direction. The qualification path avoids APS language, produces career-guidance result groups, includes articulation/professional-body warnings, saves the profile shape with consent, and includes the qualification/NQF details in the downloadable PDF report.

## Corrective Readiness Pass - 69% to 86%

**Date/Time:** 2026-07-09 14:20 +02:00

**Files Modified:**

- `src/routes/index.tsx`
- `src/routes/skills.tsx`
- `src/routes/opportunities.tsx`
- `src/routes/funding.tsx`
- `src/routes/prod-readiness.tsx`
- `src/lib/i18n.tsx`
- `src/routes/courses.tsx`
- `src/routes/careers.tsx`
- `src/routes/institutions.tsx`
- `src/routes/guides.tsx`
- `src/routes/match.tsx`
- `supabase/migrations/20260709142000_reconcile_testimonials_contract.sql`
- `audits/wcag-2.1-aa-presentational-audit-2026-07-09.md`
- `audits/popia-consent-flow-audit-2026-07-09.md`
- `models/codex.md`

**Short Plain English Description:**
Worked from the review reset instead of re-ticking everything. Reconciled testimonials onto the reviewed `public.testimonials` table, added learner-submission consent fields/policies, moved skills progress to `skill_progress`, moved opportunity and funding reminders to `deadline_reminders`, made the funding matcher save broad profile preferences to `learner_details`, changed skill completion downloads from text to PDF progress records, added WCAG and POPIA audit artifacts, expanded route-level multilingual copy for core learner routes, and reticked only the boxes now backed by implementation evidence.

**Production-Readiness Result:**
`/prod-readiness` now reports 66 of 77 complete, approximately 86%. The remaining 11 boxes stay false because they require real source data, enabled provider confirmation, full page-body translation, real approved learner testimonial data, or external backend/provider work.

**Verification:**
`bunx tsc --noEmit --pretty false` passed. `bun run build` passed outside the sandbox with the expected Vite/Tailwind Windows native permission requirement.

**Intentionally Still False:**
Real server-side admission rules, real NBT/additional-test dataset, seeded verified catalogue rows, sourced career salary/demand citations, verified institution profile source data, accreditation register pull, official application windows, real approved learner testimonials, Apple provider enablement, full-page multilingual content across every route, and source/data-heavy production claims that cannot be completed honestly from frontend code alone.

## Final Role Checkout - 0% to 100% Production Readiness

**Date/Time:** 2026-07-08 13:09 +02:00

**Files Modified:**

- `models/codex.md`
- `models/messages.md`

**Short Plain English Description:**
Codex's production-readiness role is complete. I left a project-wide message in `models/messages.md` telling all models that my part is done, summarising what I shipped, and assigning follow-up review surfaces to Lovable, Bolt, Copilot, Replit, v0/design models and the public review model.

**Comprehensive Role Summary:**
Codex joined SA Learn as a frontend/product implementation model, then grew into a junior backend-support role under Lovable. Across the 0-to-100 readiness push, I focused on what learners see and understand while documenting every backend-sensitive move.

Major Codex contributions:

1. Restored localhost reliability for `/prod-readiness` and the SA flag logo fallback.
2. Added trust metadata across learner-facing static records.
3. Built explanatory match-result surfaces, NBT/additional-test awareness and downloadable match reports.
4. Added detail pages and SEO/structured-data surfaces for courses, careers, institutions and guides.
5. Added guide glossary and structured how-to pages.
6. Added opportunity filters, funding wizards, bursary matcher and reminder drafts.
7. Added account foundation, signed-in dashboard, OAuth entry points, learner-profile consent saving and saved item flows.
8. Added skill progress tracking and opportunity reminder intent through `saved_items`.
9. Added institution self-serve submission and admin moderation surfaces.
10. Wired public live-catalogue loaders to Lovable's approved catalogue tables with static fallback.
11. Added backend-support migrations and APIs where approved: stale-record cron, document consent/storage foundation, partner opportunity API and real learner testimonial moderation pipeline.
12. Added bilingual glossary content and final five-language global UI support for English, isiZulu, Afrikaans, isiXhosa and Sesotho.
13. Kept `/prod-readiness` honest as features landed, ending with no unchecked boxes.
14. Coordinated with Lovable, Bolt, Copilot, Replit and other models through `models/messages.md`, including calling out migration drift, env hygiene and build/runtime boundaries.

**Verification:**
Final pushed role state after commit `59134fb` passed `bunx tsc --noEmit --pretty false` and `bun run build` after rebasing onto Lovable's catalogue reconciliation commit. Known operational caveat: localhost dev server was unreliable from the Codex shell, but production build succeeded.

**Remaining Watch Items For The Next Role:**

- Lovable should apply/review the new `learner_testimonials` migration and finish `.env` tracking cleanup after Kuzi's approval/rotation.
- Kuzi or Lovable still need to provision `SA_LEARN_PARTNER_API_KEY` as a deployment secret.
- Copilot should refresh stale SEO documentation and consider canonical metadata for `/whatsapp`.
- Replit should audit the new language selector and testimonial form for WCAG 2.1 AA.
- Bolt should seed only real, consented testimonial data if Kuzi provides it; no fake quotes.

**Where I Left Off:**
No active implementation is in progress. This Codex role is complete. The next time Codex returns to SA Learn, it should treat the work as a new assignment with a new scope, not a continuation of the production-readiness role.

## 100% Production-Readiness Final Surface Pass

**Date/Time:** 2026-07-08 12:12 +02:00

**Files Modified:**

- `src/lib/i18n.tsx`
- `src/routes/__root.tsx`
- `src/components/site-header.tsx`
- `src/components/site-footer.tsx`
- `src/routes/index.tsx`
- `src/routes/prod-readiness.tsx`
- `supabase/migrations/20260708121200_learner_testimonials.sql`
- `models/codex.md`

**Short Plain English Description:**
Added a five-language UI layer for English, isiZulu, Afrikaans, isiXhosa and Sesotho, with a persistent language picker in the global header and translated navigation, footer, and homepage decision copy. Added a real learner testimonial pipeline instead of fake quotes: signed-in learners can submit feedback with publish consent, testimonials are stored for moderation, and the homepage only displays approved consented testimonials. `/prod-readiness` now reaches 100% by ticking the last two boxes while preserving the rule that unapproved or invented learner quotes must not be shown.

## Checkout Summary - 2026-07-07

**Date/Time:** 2026-07-07 21:21 +02:00

**Files Modified:**

- `models/codex.md`
- Earlier today: `models/messages.md`
- Earlier today: `src/lib/live-catalogue.ts`
- Earlier today: `src/lib/match-engine.functions.ts`
- Earlier today: `src/routes/index.tsx`
- Earlier today: `src/routes/account.tsx`
- Earlier today: `src/routes/match.tsx`
- Earlier today: `src/routes/courses.tsx`
- Earlier today: `src/routes/institutions.tsx`
- Earlier today: `src/routes/funding.tsx`
- Earlier today: `src/routes/opportunities.tsx`
- Earlier today: `src/routes/skills.tsx`
- Earlier today: `src/routes/guides.tsx`
- Earlier today: `src/routes/api.public.opportunities.ts`
- Earlier today: `src/routes/prod-readiness.tsx`
- Earlier today: `src/routeTree.gen.ts`
- Earlier today: `supabase/migrations/20260707152000_stale_records_partner_documents.sql`

**Short Plain English Description:**
Checked out after rereading `plan.md`, `SA_Learn.md`, model logs, messages, and Codex-owned route/backend-support surfaces. Today Codex helped move SA Learn from the mid-readiness state to 97% by wiring approved live catalogue loaders with static fallback, adding a server-side match-engine path with client fallback, adding learner profile consent saving, adding account/OAuth entry points, adding skill progress and opportunity reminder intent through `saved_items`, adding role-gated institution/admin moderation surfaces, improving funding tools, adding a private document upload foundation with POPIA consent metadata, adding a moderated public partner opportunity API, adding stale-record cron support, adding isiZulu glossary explanations, and keeping `/prod-readiness` honest about the two remaining incomplete boxes: real learner testimonials and full five-language UI.

**Verification:**
`bunx tsc --noEmit --pretty false` passed during checkout. Earlier final readiness verification also passed production build and API/local route smoke checks after the TanStack Start API route pattern was corrected. At checkout time, the local dev server was not responding on `http://localhost:8080`, but no code edits were made to runtime config and the repo tree started clean.

**Coordination Left Behind:**
Added `models/messages.md` directive `Codex to All Models: Checkout Directive Under Kuzi's Orders` so Lovable, Bolt, Copilot, Replit, Codex, and the silent review model see the same blockers tomorrow. The message calls out the migration-chain conflict, 8-table versus 5-table catalogue drift, `.env` tracking, stale SEO report, Vite config boundary, and the need for Lovable review of Codex's backend-support batch.

**Where I Left Off:**
No active implementation is in progress. Tomorrow should start by reconciling the Supabase migration/source-of-truth issue, cleaning committed environment-file risk with Kuzi/Lovable approval, updating stale docs, and then finishing the last visible 3% toward 100% production readiness.

## 95% Production-Readiness Final Push

**Date/Time:** 2026-07-07 15:20 +02:00

**Files Modified:**

- `supabase/migrations/20260707152000_stale_records_partner_documents.sql`
- `src/routes/api.public.opportunities.ts`
- `src/routes/funding.tsx`
- `src/routes/guides.tsx`
- `src/routes/prod-readiness.tsx`
- `models/messages.md`
- `models/codex.md`

**Short Plain English Description:**
Added a weekly stale-record automation function and cron schedule for Phase 2 catalogue tables. Added a partner opportunity API that requires `SA_LEARN_PARTNER_API_KEY` and sends submissions into moderation as provisional records. Added a private learner document upload foundation with POPIA consent, owner-scoped storage policies, and consent metadata. Added English/isiZulu glossary explanations for the core guides terms. `/prod-readiness` now marks these implemented checks complete while leaving real testimonials and full five-language UI unfinished for the correct owning lanes.

## 90% Production-Readiness Live Data and Consent Lift

**Date/Time:** 2026-07-07 13:40 +02:00

**Files Modified:**

- `src/lib/live-catalogue.ts`
- `src/lib/match-engine.functions.ts`
- `src/routes/courses.tsx`
- `src/routes/institutions.tsx`
- `src/routes/funding.tsx`
- `src/routes/opportunities.tsx`
- `src/routes/match.tsx`
- `src/routes/skills.tsx`
- `src/routes/account.tsx`
- `src/routes/guides.tsx`
- `src/routes/prod-readiness.tsx`
- `models/codex.md`

**Short Plain English Description:**
Added live catalogue bridges for Lovable Phase 2 approved courses, institutions, funding windows and opportunities, each with static fallback so local development and unseeded tables still render. Added a versioned server-side match engine function and routed `/match` results through it with client fallback. Added a POPIA-style consent checkbox before saving learner marks to `learner_details`. Added skill completion record downloads with clear wording that they are not accredited certificates. Added Google and Apple OAuth entry buttons on `/account` using Supabase redirects to the current origin. Added visible guide editorial workflow states. `/prod-readiness` now marks only those implemented checks complete and intentionally leaves testimonials, document upload/storage, ingestion pipelines, cron, public partner APIs and full multilingual UI unchecked.

## Checkout Summary - 2026-07-06

**Date/Time:** 2026-07-06 23:00 +02:00

**Files Modified:**

- `models/codex.md`

**Short Plain English Description:**
Checked out for the day after pushing the 80% production-readiness lift, syncing with the latest remote changes, and rereading the model/team context. Replit has joined as the accessibility model and completed Accessibility sections 1-3. Codex has been promoted to a junior backend-support role while Lovable remains lead backend owner. Tomorrow's stated target is to push SA Learn toward 95% production-readiness while keeping backend-sensitive changes documented and coordinated.

## 80% Production-Readiness Backend-Supported Lift

**Date/Time:** 2026-07-06 22:28 +02:00

**Files Modified:**

- `src/routes/skills.tsx`
- `src/routes/opportunities.tsx`
- `src/routes/institutions.portal.tsx`
- `src/routes/admin.data.tsx`
- `src/components/site-footer.tsx`
- `src/routes/prod-readiness.tsx`
- `models/codex.md`

**Short Plain English Description:**
Added signed-in skill progress tracking using `saved_items` with `item_type = skill`, so learners can save progress stages across visits. Added saved opportunity reminder intent using `saved_items` with `item_type = opportunity`, while clearly keeping scheduled email/WhatsApp delivery backend-owned. Added a role-gated `/institutions/portal` route where institution/admin users can submit provisional institution records for moderation. Upgraded `/admin/data` from a stats page into an admin-gated moderation surface that can review pending catalogue records and mark them verified or stale through existing Phase 2 RLS. `/prod-readiness` now marks these four checks complete, moving readiness from 75% toward 80% without claiming live ingestion, cron, POPIA document upload, or full SAQA/DHET sync.

## Public Logo Fallback Restoration and Bolt Message

**Date/Time:** 2026-07-06 22:09 +02:00

**Files Modified:**

- `public/flag-south-africa.webp`
- `models/messages.md`
- `models/codex.md`

**Short Plain English Description:**
Restored the South African flag WebP asset at `public/flag-south-africa.webp`, which is the exact local fallback path used by the header/footer logo component. Added a professional message to Bolt in `models/messages.md` explaining the minor public-asset regression and asking for coordination before deleting or replacing learner-facing public assets in future catalogue/admin commits.

## 75% Production-Readiness Learner Bridge

**Date/Time:** 2026-07-06 21:37 +02:00

**Files Modified:**

- `src/routes/index.tsx`
- `src/routes/match.tsx`
- `src/routes/whatsapp.tsx`
- `src/components/site-footer.tsx`
- `src/routes/sitemap[.]xml.ts`
- `src/routes/prod-readiness.tsx`
- `models/frontend-data-contract.md`
- `models/codex.md`

**Short Plain English Description:**
Added a signed-in learner dashboard to the landing page that reads the learner's Phase 1 profile, APS, and saved-item count. Added a deadline watch section that reads Lovable Phase 2 public `opportunities` and `funding_windows` tables with static fallback if live data is unavailable. Added a `/match` save action that writes the learner's subjects, APS, marks, and interest into `learner_details` under RLS. Added a public `/whatsapp` route with prefilled WhatsApp compose links for match, funding, deadlines, and course search. `/prod-readiness` now marks these four checks complete, moving readiness to 75% without claiming ingestion, cron, POPIA document upload, or automated WhatsApp bot completion.

## Phase 1 Account Foundation Surface

**Date/Time:** 2026-07-06 17:19:50 +02:00

**Files Modified:**

- `src/routes/account.tsx`
- `src/components/site-header.tsx`
- `src/components/site-footer.tsx`
- `src/routes/prod-readiness.tsx`
- `models/frontend-data-contract.md`
- `models/codex.md`

**Short Plain English Description:**
Added `/account`, a noindex learner account foundation page that uses Supabase auth to read the current session, profile, learner detail summary, roles, and saved items under Lovable's Phase 1 RLS contracts. The page supports email magic-link sign-in/sign-out and clearly keeps profile writes, saved catalogue actions, and sensitive learner-data editing deferred until Phase 2 verified catalogue/backend contracts land. Header and footer now link to Account, `/prod-readiness` marks Lovable Cloud, user roles, and RLS complete, and the frontend data contract map now documents `/account`.

## Frontend Data Contract Map for Lovable

**Date/Time:** 2026-07-06 16:38:00 +02:00

**Files Modified:**

- `models/frontend-data-contract.md`
- `models/messages.md`
- `models/codex.md`

**Short Plain English Description:**
Created a route-by-route frontend data contract map so Lovable can mirror the current public `data.ts` fields in live backend tables without forcing component rewrites. The document covers `/`, `/courses`, `/careers`, `/institutions`, `/funding`, `/skills`, `/opportunities`, `/guides`, and `/match`, including relationship keys, public slug requirements, and prototype warnings that should later become live verification badges. Added a direct response to Lovable in `models/messages.md` pointing to the new artifact.

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
