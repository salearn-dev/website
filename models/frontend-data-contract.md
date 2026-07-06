# Frontend Data Contract Map

**Owner:** Codex
**Created:** 2026-07-06 16:38:00 +02:00
**Purpose:** Give Lovable the exact public frontend fields currently read from `src/lib/data.ts` so backend/live-data contracts can mirror the present static-dynamic UI with minimal component rewrites.

## General Contract Rules

- Keep public catalogue fields readable by anonymous visitors where policy allows.
- Preserve the current field names where practical so loader swaps stay mechanical.
- Keep `slug` stable for all public detail routes and relationship joins.
- Use `TrustMeta` or a compatible live equivalent anywhere the UI currently renders `TrustMetadata`.
- Treat all current `Needs confirmation`, `Prototype data`, and inline prototype warnings as candidates for live `verification_status`.

## `/`

Data source today:

- Static `CAREERS`, `COURSES`, `FUNDING`, and `OPPORTUNITIES`
- Optional Supabase reads from Phase 1/2 tables after the browser loads

Live fields read:

- `profiles.display_name`
- `learner_details.aps`
- `saved_items` count for the current user
- `opportunities.title`
- `opportunities.closing_date`
- `opportunities.provider`
- `opportunities.source_name`
- `opportunities.source_url`
- `opportunities.verification_status`
- `funding_windows.name`
- `funding_windows.deadline`
- `funding_windows.provider`
- `funding_windows.source_name`
- `funding_windows.source_url`
- `funding_windows.verification_status`

Fallback behavior:

- If Supabase environment variables, permissions, generated types, or table data are unavailable, the page keeps rendering static prototype deadline cards.

## `/account`

Data source today:

- Supabase auth session
- `profiles`
- `learner_details`
- `saved_items`
- `user_roles`

Fields read:

- `profiles.display_name`
- `profiles.province`
- `learner_details.aps`
- `learner_details.interests`
- `learner_details.preferred_study_mode`
- `learner_details.preferred_delivery_mode`
- `saved_items.item_type`
- `saved_items.item_id`
- `saved_items.title`
- `saved_items.note`
- `user_roles.role`

Frontend writes:

- Email magic-link sign-in and sign-out only. Profile editing remains pending.

## Shared Trust Metadata

Current frontend type:

- `trust.sourceName`
- `trust.sourceUrl`
- `trust.lastVerifiedAt`
- `trust.verificationStatus`

Live-data target requested from Lovable:

- `source_url`
- `last_verified_at`
- `verification_status`
- `stale_after_days`

Frontend can adapt snake_case to the existing `TrustMetadata` shape in loaders.

## `/courses`

Data source today:

- `COURSES`
- `COURSE_CATEGORIES`

List page fields read:

- `slug`
- `title`
- `institution`
- `qualification`
- `nqf`
- `duration`
- `cost`
- `funding`
- `careers`
- `province`
- `city`
- `deliveryMode`
- `category`
- `accreditation`
- `trust`

Course category fields read:

- `slug`
- `title`
- `desc`
- `count`

Detail page fields read:

- All list fields above
- `trust.sourceName`
- `trust.sourceUrl`
- `trust.lastVerifiedAt`
- `trust.verificationStatus`

Relationship keys:

- `course.slug` powers `/courses/:slug`
- `career.relatedCourseSlugs[]` links careers and skills back to courses
- `course.careers[]` is display text today, not a strict join

Verification badge targets:

- `accreditation`
- `trust.verificationStatus`
- `trust.lastVerifiedAt`
- `trust.sourceUrl`
- Any `cost` value of `Information unavailable`
- Any `funding` value using broad wording such as `NSFAS possible`

## `/careers`

Data source today:

- `CAREERS`
- `COURSES`
- `SKILLS`

List page fields read:

- `slug`
- `title`
- `short`
- `demand`
- `salary`
- `subjects`
- `routes`
- `fit`

Detail page fields read:

- `slug`
- `title`
- `short`
- `demand`
- `salary`
- `salaryBands.entry`
- `salaryBands.mid`
- `salaryBands.senior`
- `outlook`
- `fit`
- `subjects`
- `routes`
- `skills`
- `dailyWork`
- `entryRoles`
- `timeline`
- `relatedCourseSlugs`
- `relatedSkillSlugs`

Relationship keys:

- `career.slug` powers `/careers/:slug`
- `career.relatedCourseSlugs[]` joins to `COURSES.slug`
- `career.relatedSkillSlugs[]` joins to `SKILLS.slug`

Verification badge targets:

- `salary`
- `salaryBands`
- `demand`
- `outlook`
- `subjects`
- `routes`
- Any copy that says salary/demand is prototype-only

## `/institutions`

Data source today:

- `INSTITUTIONS`

List page fields read:

- `slug`
- `name`
- `type`
- `province`
- `courses`
- `funding`
- `website`
- `trust`

Detail page fields read:

- All list fields above
- `campuses`
- `accreditationStatus`
- `registerLinks[].label`
- `registerLinks[].url`
- `applicationWindows[].label`
- `applicationWindows[].period`
- `applicationWindows[].status`
- `trust`

Relationship keys:

- `institution.slug` powers `/institutions/:slug`
- Current course records use institution display text only; future live data should prefer institution IDs/slugs.

Verification badge targets:

- `accreditationStatus`
- `registerLinks`
- `applicationWindows[].status`
- `applicationWindows[].period`
- `funding`
- `trust.verificationStatus`
- Current warning: official source verification for application windows, accreditation, and funding notes

## `/funding`

Data source today:

- `FUNDING`

Fields read:

- `slug`
- `name`
- `short`
- `eligibility`
- `coverage`
- `best`
- `deadline`
- `trust`

Client-only prototype inputs:

- NSFAS guide: citizenship, institution type, household income, study route
- Bursary matcher: study area, funding need, institution type
- Deadline drafts: email/WhatsApp message generated from `name` and `deadline`

Relationship keys:

- `funding.slug` drives matcher rules and reminder draft cards

Verification badge targets:

- `eligibility`
- `coverage`
- `deadline`
- `trust.verificationStatus`

## `/match`

Data source today:

- Client-entered subjects, marks, and interest
- Supabase auth session for optional save

Frontend writes:

- `learner_details.user_id`
- `learner_details.aps`
- `learner_details.subjects`
- `learner_details.maths_mark`
- `learner_details.english_mark`
- `learner_details.life_sciences_mark`
- `learner_details.interests`
- `learner_details.updated_at`

Deferred:

- Saved individual match result cards need stable catalogue IDs from live course, career, funding, and opportunity tables.

## `/whatsapp`

Data source today:

- Static public compose templates in `src/routes/whatsapp.tsx`

Frontend behavior:

- Opens `https://wa.me/?text=...` with prefilled learner messages for match, funding, deadlines, and course search.

Deferred:

- Automated WhatsApp bot, webhook handling, consent tracking, and persisted reminders remain backend/platform work.
- Funding matcher reasons
- Reminder copy

Backend handoff note:

- Keep public draft links until Lovable ships consent, schedule, opt-out, and delivery status contracts.

## `/skills`

Data source today:

- `SKILLS`
- `CAREERS`
- `COURSES`

Fields read:

- `slug`
- `name`
- `diff`
- `time`
- `careers`
- `track[]`
- `practice`

Relationship keys:

- `skill.slug` joins from `career.relatedSkillSlugs[]`
- Related courses are derived from `career.relatedCourseSlugs[]`

Verification badge targets:

- `diff`
- `time`
- `track[]`
- `practice`
- Related career/course mappings

Backend handoff note:

- Progress tracking and certificates should wait for auth/profile contracts.

## `/opportunities`

Data source today:

- `OPPORTUNITIES`

Fields read:

- `id`
- `title`
- `category`
- `sector`
- `type`
- `province`
- `closes`
- `paid`
- `trust`

Relationship keys:

- `id` is the current card key
- Future live data should include stable `slug` or UUID if detail pages are added

Verification badge targets:

- `closes`
- `paid`
- `trust.verificationStatus`
- `trust.lastVerifiedAt`
- `trust.sourceUrl`
- Current stale-record backend rule from Lovable should map here first

## `/guides`

Data source today:

- `GUIDES`
- `GLOSSARY_TERMS`

Guide fields read:

- `slug`
- `title`
- `summary`
- `category`
- `plainLanguage`
- `keyPoints[]`
- `steps[]`
- `relatedTerms[]`

Glossary fields read:

- `term`
- `meaning`
- `guideSlug`

Relationship keys:

- `guide.slug` powers `/guides/:slug`
- `glossary.guideSlug` links glossary cards to guide detail pages
- `guide.relatedTerms[]` joins to `GLOSSARY_TERMS.term`

Verification badge targets:

- Editorial status, language availability, and source citation are not present yet
- Future CMS contract should add review/publish state, author/reviewer, and updated timestamp

## `/match`

Data source today:

- Local component state and hard-coded prototype match result objects inside `src/routes/match.tsx`

Learner input fields used today:

- `subjects[].name`
- `subjects[].mark`
- `interest`

Derived fields:

- `aps`
- `mathsMark`
- `englishMark`
- `lifeSciencesMark`

Result fields rendered:

- `title`
- `institution`
- `confidence`
- `reason`
- `requirementsMet[]`
- `requirementsMissing[]`
- `additionalChecks[]`
- `nextStep`

Relationship keys:

- None yet; results are hard-coded display objects
- Future rules engine should emit stable course/opportunity/career IDs or slugs where possible

Verification badge targets:

- `confidence`
- `requirementsMet[]`
- `requirementsMissing[]`
- `additionalChecks[]`
- NBT flags
- Additional-test rules
- PDF report warnings

Backend handoff note:

- Saved learner profiles, versioned rules, and server-side institution/faculty rules should wait for Lovable contracts.

## `/account`

Data source today:

- Supabase auth session
- `profiles`
- `learner_details`
- `user_roles`
- `saved_items`

Fields read:

- Auth user: `id`, `email`
- Profile: `display_name`, `avatar_url`, `province`, `bio`, `updated_at`
- Learner details: `subjects`, `aps`, `maths_mark`, `english_mark`, `life_sciences_mark`, `nbt_completed`, `interests`, `preferred_study_mode`, `preferred_delivery_mode`, `budget_max_per_year`
- User roles: `role`
- Saved items: `id`, `item_type`, `item_slug`, `notes`, `created_at`

Relationship keys:

- `profiles.id` joins to auth user ID
- `learner_details.user_id` joins to auth user ID
- `user_roles.user_id` joins to auth user ID
- `saved_items.user_id` joins to auth user ID
- `saved_items.item_type` + `saved_items.item_slug` will later join to verified live catalogue records

Verification badge targets:

- Save buttons remain disabled or prototype-only until Phase 2 verified catalogue records exist
- Learner detail write UI remains deferred until saved profile UX is approved

Backend handoff note:

- `/account` is intentionally `noindex`.
- The current page reads Phase 1 contracts but does not write learner detail records or saved catalogue items.

## `/`

Data source today:

- `CAREERS`
- `COURSES`

Fields read:

- Career preview: `slug`, `title`, `short`, `demand`, `salary`, `fit`
- Course preview: `slug`, `title`, `institution`, `qualification`, `duration`, `careers`

Verification badge targets:

- Landing preview cards should inherit trust/status once home cards are wired to live course/career data.

## Public Detail Route Stability

Routes that should keep their slug contract stable:

- `/courses/:slug`
- `/careers/:slug`
- `/institutions/:slug`
- `/guides/:slug`

If Lovable introduces numeric IDs or UUIDs, please keep public slugs available for URLs and use IDs internally.
