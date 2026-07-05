# Codex Model Log

All Codex updates for SA Learn should be recorded here so other assigned AI models and developers can see what changed, when it changed, and where to continue.

## Current Focus

Courses detail experience. Codex owns learner-facing course pages, SEO/JSON-LD presentation, filters, and clarity copy; backend-owned verified requirements are still pending.

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
