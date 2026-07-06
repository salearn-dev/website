# Lovable Model Log

This log records changes made by the Lovable agent (lead AI dev on SA Learn) so other agents and human developers can see what changed, when, and where to continue.

## Phase 1 - Auth, Roles & Profiles Foundation (Lovable Cloud enabled)

**Date/Time:** 2026-07-06

**Migrations Applied:**
- Enabled Lovable Cloud (Supabase project provisioned; `.env` credentials gitignored - do not commit).
- Created `app_role` enum: `learner`, `counsellor`, `institution`, `admin`.
- Created `user_roles` table with `(user_id, role)` unique key + RLS.
- Created `has_role(_user_id, _role)` security-definer function; self-guards so non-admins can only check their own roles.
- Created `profiles` table (public-safe: `display_name`, `avatar_url`, `province`, `bio`).
- Created `learner_details` table (private: `subjects` jsonb, `aps`, `maths_mark`, `english_mark`, `life_sciences_mark`, `nbt_completed`, `interests` text[], `preferred_study_mode`, `preferred_delivery_mode`, `budget_max_per_year`).
- Created `saved_items` polymorphic table with `saved_item_type` enum covering course/career/institution/opportunity/funding/guide/skill; unique on `(user_id, item_type, item_slug)`.
- `handle_new_user()` trigger on `auth.users` auto-creates a `profiles` row and grants the default `learner` role on signup.
- Shared `update_updated_at_column()` trigger on `profiles` and `learner_details`.

**Access rules (short):**
- Profiles: any signed-in user can read; only owner can insert/update.
- Learner details: owner-only for all operations.
- Saved items: owner-only for all operations.
- User roles: user sees own; admin sees/manages all.

**Codex handoff:**
- Field names in `learner_details` and `saved_items` intentionally mirror `models/frontend-data-contract.md` (`/match` inputs, `saved_items` polymorphism). Loader swaps can be mechanical.
- Verified catalogue tables (`institutions`, `courses`, `qualifications`, `opportunities`, `funding_windows`) are next - Phase 2.
- Frontend can begin scaffolding a sign-in surface behind Cloud auth; the `_authenticated/route.tsx` layout will be integration-managed once auth UI lands. Do NOT build saved-profile write UI beyond prototype until Phase 2 catalogue lands - otherwise saved slugs point at moving targets.

**Security linter note:**
- One remaining `WARN` on `has_role` (SECURITY DEFINER callable by `authenticated`) is the canonical Supabase RLS pattern. The function self-guards, so it's an accepted false positive.


## Secure /prod-readiness with a shared access key

**Date/Time:** 2026-07-05

**Files Modified:**
- `src/lib/gate.functions.ts` (new)
- `src/routes/unlock.tsx` (new)
- `src/routes/prod-readiness.tsx`
- `src/lib/data.ts` (unrelated type annotation fix so the build passes)
- Secrets: added `SITE_PASSWORD` (user-provided access key) and generated `SESSION_SECRET` (session cookie encryption)

**Short Plain English Description:**
The internal roadmap page at `/prod-readiness` was reachable by anyone and effectively documented which security controls were not yet in place. It is now gated by a shared access key. Visitors are redirected to `/unlock`, paste the key once, and the server sets a signed, HTTP-only, encrypted session cookie that keeps the device trusted for 30 days. Subsequent visits go straight to the page with no prompt.

The gate is enforced server-side inside a `createServerFn`, so unauthenticated visitors never receive the protected page data - a redirect is thrown before the loader returns. The password check uses a timing-safe comparison. The access key itself is stored as the `SITE_PASSWORD` server secret and never ships to the browser. The route is also marked `noindex, nofollow`.

To rotate the key: update the `SITE_PASSWORD` secret. To force everyone to re-enter: rotate `SESSION_SECRET`.
