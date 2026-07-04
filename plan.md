# SA Learn - Production Vision

> Gain Skills. Get Qualifications. Get Hired.

SA Learn is a South African education platform that removes confusion from the
post-matric journey. The current build is a static prototype: real routes,
realistic data, calm design. This document outlines what a production-ready
SA Learn looks like and how to get there.

---

## 1. Product Pillars

1. **Discovery** - Every accredited course, TVET programme, learnership and
   short course in one searchable place.
2. **Qualification clarity** - Learners see exactly what they qualify for based
   on their real marks, and what alternatives exist when they don't.
3. **Employability** - Careers, skills and live opportunities are wired to the
   study pathways that lead to them.
4. **Trust** - Every data point carries a verified source and a last-verified
   date; nothing is guessed.

## 2. Feature Map (from current UI to production)

| Route | Prototype today | Production target |
|-------|-----------------|-------------------|
| `/` | Static landing, mission, FAQ | Personalised dashboard when signed in, live application deadlines, testimonials |
| `/match` | 4-step APS calculator on static rules | Live rules engine per institution/faculty, saved profiles, PDF report |
| `/courses` | Filter over static list | Full catalogue synced from SAQA / DHET, filtering by NQF, cost, city, delivery mode |
| `/careers` | Static career cards | O*NET-style career explorer with salary bands, demand signals, growth outlook |
| `/institutions` | Static list | Verified institution profiles, accreditation status, application windows |
| `/funding` | Static funding cards | NSFAS eligibility wizard, bursary matcher, deadline reminders |
| `/skills` | Static skill list | Curated learning tracks with progress tracking, certificates |
| `/opportunities` | Static list | Live application feed (universities, learnerships, jobs) via ingestion pipeline |
| `/guides` | Static explainers | Editorial CMS, plain-language glossary, structured how-tos |

## 3. Architecture

### Frontend
- TanStack Start (SSR + SSG) on Cloudflare Workers.
- Tailwind v4 design system with semantic tokens and dynamic dark mode
  (already in place - `ThemeProvider` + `.dark` overrides in `src/styles.css`).
- shadcn/ui primitives for accessible components.
- Route-level metadata for SEO on every page.

### Backend (Lovable Cloud)
- **Auth**: email + Google/Apple sign-in for learners, counsellors, institutions.
- **Database**:
  - `profiles` - learner profile, subjects, marks, interests
  - `institutions`, `courses`, `programme_requirements`, `funding_options`
  - `careers`, `career_course_links`, `skills`, `skill_resources`
  - `opportunities` (application windows, learnerships, jobs)
  - `saved_items`, `applications`, `reminders`
  - `user_roles` (learner, counsellor, institution, admin) via
    `has_role()` security definer function
- **Storage**: transcripts, ID uploads for NSFAS pre-check, institution logos.
- **Server functions** (`createServerFn`): match engine, funding eligibility,
  PDF report generation.
- **Public API routes** (`/api/public/*`) for institution partners to push
  application windows and for scheduled ingestion jobs.

### Data Sources (verified)
- SAQA National Learners' Records Database (qualifications)
- DHET public HEI and TVET registers
- NSFAS eligibility criteria and application windows
- SETAs (learnership catalogues)
- Institution APIs / RSS / structured scraping where APIs don't exist

Each record stores `source_url`, `source_name`, `last_verified_at`. The UI
already reserves space for "Last verified" badges.

## 4. Match Engine

Move the current client-side APS scorer into a versioned server function:

```
input:  { subjects: {name, mark}[], interests: string[], province?, budget? }
output: { qualify: Programme[], almost: Programme[], alternative: Pathway[] }
```

Rules are stored per programme (`min_aps`, required subjects with min marks,
NBT flags). The engine returns explanations so the UI can render "why" for
every result - critical for trust and appeals.

## 5. Content Operations

- Editorial workflow for guides with review + publish states.
- Institution self-serve portal to update programme data, gated by
  `institution` role and moderated by admins.
- Weekly cron pulls opportunity deadlines and flags stale records
  (>90 days without verification).

## 6. Trust, Safety, Accessibility

- WCAG 2.1 AA - keyboard nav, focus states, colour contrast in both themes.
- POPIA-compliant data handling; explicit consent for storing marks/ID.
- Rate-limited public endpoints, signed webhooks, RLS on every user table.
- Bilingual UI (English + isiZulu first, then Afrikaans, isiXhosa, Sesotho).

## 7. Growth & Distribution

- SEO-first pages for every course, career, institution and guide with
  structured data (JSON-LD `Course`, `EducationalOccupationalProgram`).
- WhatsApp entry point for learners without stable data - core flows over
  a chat interface.
- Partnerships with schools, NGOs and public libraries for offline outreach.

## 8. Success Metrics

- % of visitors who complete `/match` and see at least one "qualify" result
- Applications started via SA Learn per month
- Bursary/NSFAS eligibility checks completed
- Skill-track completions
- Verified-source coverage (target: 100% of courses with `last_verified_at`
  within 90 days)

## 9. Roadmap

**Phase 1 - Foundations (current prototype +)**
- Enable Lovable Cloud, model core tables, seed from SAQA/DHET exports.
- Move Match engine to server function; add saved profiles.
- Add editorial CMS for guides.

**Phase 2 - Live data**
- Institution portal + moderation.
- Opportunities ingestion pipeline + deadline reminders (email + WhatsApp).
- Funding matcher with document upload.

**Phase 3 - Employability loop**
- Skill tracks with progress + certificates.
- Employer partner directory and job feed.
- Counsellor accounts for schools and NGOs.

**Phase 4 - Scale**
- Multilingual UI.
- Native app wrapper for offline-capable core flows.
- Public API for third-party education tools.

---

The measure of success is not how much information SA Learn contains, but
how clearly it turns complex educational data into confident next steps.
