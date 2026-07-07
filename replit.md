# SA Learn

> Gain Skills. Get Qualifications. Get Hired.

A South African education platform that helps post-matric learners discover accredited courses, check APS qualification matches, find bursaries/NSFAS funding, and explore career paths.

## Stack

- **Framework**: TanStack Start (SSR) + React 19
- **Styling**: Tailwind v4 + shadcn/ui
- **Backend/Auth**: Supabase (optional — app runs without it, auth/data features disabled)
- **Routing**: TanStack Router (file-based, auto-generated `routeTree.gen.ts`)
- **State**: TanStack Query

## Running the app

```bash
npm run dev        # dev server on port 5000
npm run build      # production build
npm run lint       # ESLint
npm run format     # Prettier
```

The dev server starts on **http://0.0.0.0:5000** and is visible in the Replit preview pane.

## Supabase

Set these environment variables to enable auth and live data:

- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — your Supabase publishable (anon) key

Without them the app loads with a warning in the console; auth and database queries will not work.

## Project structure

```
src/
  routes/          # File-based TanStack Router pages
  components/      # Shared UI components
  integrations/    # Supabase client + generated types
  hooks/           # React hooks
  lib/             # Utilities
  assets/          # Static assets
supabase/
  migrations/      # SQL migration files
  config.toml      # Supabase local config
```

## User preferences

- Keep the existing file-based routing structure (TanStack Router)
- Do not restructure the project layout
