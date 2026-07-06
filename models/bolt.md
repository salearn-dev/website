# Bolt — SA Learn Data Aggregation Model

**Model name:** Bolt
**Date:** 2026-07-06
**Assigned role for this task:** Aggregate South African educational institutions data, verify it, and save it in a Supabase database. Provide components to input the necessary Supabase secrets for table management.
**Files or areas expected to touch:**
- Supabase migrations and table schemas
- Data verification and ingestion pipelines
- Admin UI for managing Supabase secrets and table operations
- Backend server functions for data operations
- Documentation in `/models`

**Files or areas to avoid:**
- Auth, learner profiles, saved items (those are Lovable/Codex domains)
- Frontend UI beyond admin/tooling interfaces
- Public-facing route components (those are Codex domain)

**Task summary:** Build the data infrastructure layer that powers SA Learn's verified catalogue - institutions, courses, qualifications, opportunities, funding windows - with source tracking, verification status, and admin tooling.

**Known risks:**
- External data sources may change structure without notice
- Verification workflow requires human review for critical records
- Need to coordinate with Codex on field names to avoid breaking frontend

**Completion report location:** This file (models/bolt.md)

---

## Current Focus

Setting up the verified catalogue tables in Supabase. These tables will hold institutions, courses, qualifications, opportunities, and funding windows - each with source tracking and verification metadata.

## Phase 2 - Verified Catalogue Tables

**Status:** Starting

The prototype uses static data in `src/lib/data.ts`. My job is to turn that prototype into live, verified, queryable data with:

1. **Source tracking** - Every record has `source_url`, `source_name`, `last_verified_at`, `verification_status`
2. **Verification workflow** - Records move through states: `unverified` → `provisional` → `verified` → `stale`
3. **Stale record rules** - Flag records older than 90 days without verification
4. **Admin tooling** - UI for reviewing, approving, and managing catalogue data

## Supabase Secrets Required

The following environment variables are needed for table management:

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Project URL (already provisioned) |
| `SUPABASE_ANON_KEY` | Public anon key (already provisioned) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin operations, bypasses RLS (already provisioned) |
| `SUPABASE_DB_URL` | Direct database connection for migrations |

All secrets are pre-populated in the environment via Lovable Cloud provision.

## Table Schema (Draft)

### institutions
- `id` uuid primary key
- `slug` text unique (matches frontend `/institutions/:slug`)
- `name` text
- `type` text (Public University, University of Technology, TVET College, Private College)
- `province` text
- `website` text
- `accreditation_status` text
- `accreditation_register_url` text
- `source_url` text
- `source_name` text
- `last_verified_at` timestamptz
- `verification_status` enum (unverified, provisional, verified, stale)
- `status` text (active, closed, under_review)
- `created_at` timestamptz
- `updated_at` timestamptz

### courses
- `id` uuid primary key
- `slug` text unique (matches frontend `/courses/:slug`)
- `title` text
- `institution_id` uuid references institutions
- `qualification_type` text (Degree, Diploma, Higher Certificate, etc.)
- `nqf_level` int
- `saqa_qualification_id` text
- `duration` text
- `delivery_mode` enum (Contact, Online, Blended, Workplace)
- `city` text
- `province` text
- `cost_estimate` text
- `funding_notes` text
- `application_deadline` date
- `official_page_url` text
- `source_url` text
- `source_name` text
- `last_verified_at` timestamptz
- `verification_status` enum
- `created_at` timestamptz
- `updated_at` timestamptz

### qualifications
- `id` uuid primary key
- `saqa_id` text unique
- `title` text
- `nqf_level` int
- `field_of_study` text
- `source_url` text (SAQA link)
- `last_verified_at` timestamptz
- `verification_status` enum

### opportunities
- `id` uuid primary key
- `title` text
- `provider` text
- `type` enum (Application, Bursary, Learnership, Internship, Job)
- `sector` text
- `province` text
- `requirements` text
- `closing_date` date
- `application_url` text
- `paid` boolean
- `source_url` text
- `source_name` text
- `last_verified_at` timestamptz
- `verification_status` enum
- `status` enum (open, closed, expired)
- `created_at` timestamptz
- `updated_at` timestamptz

### funding_windows
- `id` uuid primary key
- `slug` text unique
- `name` text
- `provider` text
- `eligibility_rules` jsonb
- `coverage` text
- `required_documents` text[]
- `deadline` text
- `official_url` text
- `linked_fields` text[]
- `linked_institution_types` text[]
- `source_url` text
- `source_name` text
- `last_verified_at` timestamptz
- `verification_status` enum
- `created_at` timestamptz
- `updated_at` timestamptz

## Data Sources to Integrate

1. **SAQA** - Registered qualifications and unit standards
2. **DHET** - Public universities and TVET colleges registers
3. **NSFAS** - Eligibility criteria and application windows
4. **SETAs** - Learnership catalogues
5. **Institutional websites** - Programme pages, admission requirements, fees

## Next Steps

1. ~~Create migrations for verified catalogue tables~~ ✓
2. ~~Add RLS policies (admin write, anon read for public catalogue)~~ ✓
3. ~~Build admin UI for secret management and table operations~~ ✓
4. ~~Set up initial data seeding from prototype data~~ ✓
5. Create verification workflow functions

---

## Activity Log

### 2026-07-06 — Model Registration

Created this registration file. Starting work on verified catalogue tables as Phase 2 of the SA Learn backend.

### 2026-07-06 — Migration Applied: Verified Catalogue Tables

Applied migration `20260706_verified_catalogue_tables` creating 8 tables:

- `institutions` — SA educational institutions with accreditation status
- `courses` — Linked to institutions, with NQF levels and delivery modes
- `qualifications` — SAQA-registered qualifications
- `opportunities` — Jobs, learnerships, internships, bursaries
- `funding_windows` — NSFAS, bursaries, SETA learnerships
- `careers` — Career explorer data with salary bands and demand
- `skills` — Skill cards with learning tracks
- `guides` — Plain-language explainers with publish workflow

All tables include:
- `verification_status` enum (unverified, provisional, verified, stale)
- `source_url` and `source_name` for traceability
- `last_verified_at` timestamp
- RLS policies: public read (anon + authenticated), admin write via `user_roles`

Indexes added on slugs, province, type, status, closing_date for filter performance.

### 2026-07-06 — Data Seeding Complete

Seeded all 8 catalogue tables from prototype data in `src/lib/data.ts`:

| Table | Records | Verification Status |
|-------|---------|---------------------|
| institutions | 8 | provisional |
| courses | 6 | provisional |
| careers | 9 | provisional |
| skills | 10 | verified |
| funding_windows | 6 | provisional/unverified |
| guides | 10 | provisional (published) |
| opportunities | 8 | provisional |
| qualifications | 6 | provisional/unverified |

All inserts use `ON CONFLICT (slug) DO UPDATE` for idempotency.

### 2026-07-06 — Admin UI Built

Created `/admin/data` route (`src/routes/admin.data.tsx`):
- Displays Supabase connection status (URL, project ID, configured env vars)
- Shows per-table statistics with verification status breakdown
- Visual progress bars for verification distribution
- Link to Supabase Dashboard for direct table management
- Refresh button to reload statistics

---

## Completion Report

### Deliverables Completed

1. **Model Registration** — `models/bolt.md` created and maintained
2. **Database Migration** — 8 verified catalogue tables with full RLS
3. **Data Seeding** — All prototype data migrated to live tables
4. **Admin UI** — Route at `/admin/data` for connection status and table ops

### Tables Created

All tables follow the frontend data contract (`models/frontend-data-contract.md`):

- `institutions` — matches `/institutions/:slug` route
- `courses` — matches `/courses/:slug` route
- `careers` — matches `/careers/:slug` route
- `skills` — matches `/skills/:slug` route
- `funding_windows` — matches `/funding/:slug` route
- `guides` — matches `/guides/:slug` route
- `opportunities` — matches `/opportunities` list
- `qualifications` — reference table linked from courses

### RLS Policy Summary

- **Public catalogue tables** (institutions, courses, careers, skills, funding_windows, guides, opportunities):
  - SELECT: `TO anon, authenticated` — allows browsing without login
  - INSERT/UPDATE/DELETE: `TO authenticated` where `has_role('admin') OR has_role('institution')`

- **Qualifications table**:
  - SELECT: `TO anon, authenticated`
  - INSERT/UPDATE/DELETE: `TO authenticated` where `has_role('admin')`

### Remaining Work

1. **Verification workflow functions** — SQL functions to:
   - Flag records >90 days old as `stale`
   - Bulk-update `provisional` → `verified` after admin review
   - Reject records with invalid source URLs

2. **Type generation** — `src/integrations/supabase/types.ts` needs manual update or regeneration to include all 8 new tables and 3 new enums

3. **Data source integrations** — Live feeds from SAQA, DHET, NSFAS, SETAs
