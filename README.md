# SA Learn Website

SA Learn is a South African education and career-navigation platform. It helps learners explore study routes, careers, funding, institutions, opportunities, guides and data-first guidance through Ask SA Learn.

This repository is a functional beta. The product is broad and technically substantial, but production trust depends on verified catalogue data, tested backend policies, hardened public APIs and explicit quality gates.

## Canonical Tooling

Use Bun for this project.

- Canonical lockfile: `bun.lock`
- Package manager: Bun
- Do not run `npm install`
- Do not commit `package-lock.json`

The project previously had both Bun and npm lockfiles. Bun is now the intended package manager because the local workflow, lockfile and prior setup were standardized around it.

## Setup

Install dependencies:

```bash
bun install
```

Start local development:

```bash
bun run dev -- --host 127.0.0.1 --port 8080
```

Build for production:

```bash
bun run build
```

Run local quality checks:

```bash
bun run typecheck
bun run lint
bun run test
bun run test:coverage
bun run check
```

`bun run check` enforces TypeScript, lint, unit tests with coverage, SEO and accessibility source policies, service-role import boundaries, catalogue content health, the production build and bundle budgets. `bun run test` uses Bun’s test runner. Direct RLS integration tests are included but skip unless dedicated test credentials are configured; browser tests and successful CI evidence are still required before unrestricted production reliance.

## Environment Variables

Copy `.env.example` to `.env` for local work.

Client/browser variables:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Server/SSR variables:

```text
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
```

Controlled seed/admin scripts may also require:

```text
SUPABASE_SERVICE_ROLE_KEY=
```

Never place service-role or secret Supabase keys in `VITE_` variables. Browser code must only receive publishable keys.

## Important Routes

- `/` - learner landing page and signed-in dashboard
- `/ask` - data-first Ask SA Learn guidance
- `/match` - APS, subject and qualification-path guidance
- `/courses` and `/courses/:slug` - course catalogue and details
- `/careers` and `/careers/:slug` - career explorer and details
- `/institutions` and `/institutions/:slug` - institution catalogue and profiles
- `/funding` - NSFAS and bursary guidance
- `/opportunities` - applications, learnerships and opportunity listings
- `/guides` and `/guides/:slug` - glossary and how-to content
- `/admin/data` - catalogue moderation surface
- `/prod-readiness` - internal readiness and evidence dashboard

## Data Trust Policy

Static records in `src/lib/data.ts` are prototype records unless their trust metadata says otherwise. Do not present illustrative records as official admissions, funding, salary, accreditation or deadline truth.

Before a record can be treated as production-trusted, capture:

- official source URL
- publisher or institution
- source year or intake cycle
- fields verified
- verifier identity or process owner
- verification timestamp
- review or expiry date
- evidence status

Matching outcomes must be described as guidance until real institution and faculty rules, NBT/additional-test requirements and year-specific prospectus data are sourced.

## Backend And Supabase

Supabase migrations live in `supabase/migrations`.

Seed the public institution baseline after adding `SUPABASE_SERVICE_ROLE_KEY` to a local, uncommitted environment file:

```bash
bun run seed:institutions
```

The seed script upserts the 26 public universities and 50 public TVET colleges as approved but provisional records. They are visible to learners but still labelled as needing confirmation until field-level verification is complete.

Backend-sensitive changes require extra care when they touch:

- auth providers
- RLS policies
- role functions
- learner profiles and marks
- saved items
- reminders
- storage buckets
- public APIs
- catalogue moderation
- partner ingestion

RLS and public API behavior must be tested with direct API calls, not only through UI gates.

## Production Readiness

`/prod-readiness` separates implementation progress from production proof.

A checked item means it is implemented in the current codebase. It does not automatically mean the item is:

- unit-tested
- integration-tested
- RLS-tested
- browser-tested
- staging-verified
- production-verified
- data-verified

Use the evidence labels on `/prod-readiness` to decide what still needs proof.

## Collaboration Rules

- Update `models/codex.md` for Codex changes.
- Use descriptive commits.
- Keep generated noise out of commits, especially transient `routeTree.gen.ts` changes.
- Coordinate shared backend contracts with Lovable or Kuzi.
- Do not weaken trust labels or verification language to make the product appear more complete than it is.
