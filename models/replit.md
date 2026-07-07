# Replit — SA Learn Accessibility Model

**Model name:** Replit
**Date:** 2026-07-06
**Assigned role:** Accessibility — ensuring the website is usable by disabled visitors and accommodates South Africa's linguistic diversity.

**Mission in one sentence:**
Make SA Learn the most accessible education platform for South African learners — regardless of disability, assistive technology, or home language.

---

## Scope

### Files and areas I own

- Accessibility attributes throughout all route components (`src/routes/`)
- Skip-navigation and landmark structure (`src/routes/__root.tsx`, `src/components/site-header.tsx`, `src/components/site-footer.tsx`)
- Focus management utilities (`src/lib/`)
- Color token contrast verification (`src/styles.css`)
- Form labelling and error messaging (`src/routes/match.tsx`, `src/routes/account.tsx`)
- Keyboard interaction patterns in interactive components (`src/components/`)
- Motion / reduced-motion guards (`src/styles.css`, component level)
- Language switcher UI and i18n infrastructure (`src/components/`, `src/lib/`, `public/locales/`)
- Translation files for isiZulu, Afrikaans, isiXhosa, Sesotho (alongside English)
- `Accessibility.md` — the living checklist that tracks what has been done and what remains

### Files and areas I avoid

- Database schema, migrations, RLS policies (Bolt / Lovable domain)
- Auth flows and session management (Lovable domain)
- Data ingestion pipelines (Bolt domain)
- Core business logic of the match engine (Codex domain)
- Deployment configuration

---

## Guiding standards

| Standard | Target |
|----------|--------|
| WCAG | 2.1 Level AA (every page) |
| Colour contrast — normal text | ≥ 4.5 : 1 |
| Colour contrast — large text / UI components | ≥ 3 : 1 |
| Keyboard navigability | 100 % of interactive elements reachable and operable without a mouse |
| Screen reader | VoiceOver (macOS/iOS) + NVDA (Windows) smoke-tested |
| Languages | English (baseline) → isiZulu → Afrikaans → isiXhosa → Sesotho |

---

## Activity log

### 2026-07-06 — Model registration

Created this file. Accessibility.md checklist written and awaiting human approval before implementation begins.

### 2026-07-06 — Section 1 complete: Page Structure & Landmarks (items 1.1–1.7)

**Items implemented:**

| # | Item | Files touched |
|---|------|---------------|
| 1.1 | Skip-to-content link | `src/routes/__root.tsx` |
| 1.2 | `<main id="main-content">` skip-link target | `src/components/page-shell.tsx`, `src/routes/index.tsx` |
| 1.3 | Footer nav labelled with `aria-label="Footer navigation"` | `src/components/site-footer.tsx` |
| 1.4 | `<footer>` landmark | Already present — no change |
| 1.5 | `<header>` landmark | Already present — no change |
| 1.6 | Unique `<title>` on all 18 routes | Audited — all present — no change |
| 1.7 | Heading hierarchy (`h1`→`h2`→`h3`) | Audited — `PageShell` enforces one `h1`; routes follow correctly — no change |

**Notes:**
- All routes use `PageShell`, which renders `<main>` + `<h1>` — the landmark and heading foundations are consistent site-wide.
- Skip link is invisible until Tab is pressed; then it appears as a primary-coloured pill in the top-left corner.
- Footer nav wrapper uses `className="contents"` so the CSS grid layout is unaffected.

### 2026-07-06 — Section 2 complete: Keyboard Navigation (items 2.1–2.6)

**Items implemented:**

| # | Item | Files touched |
|---|------|---------------|
| 2.1 | `focus-visible:ring-2` on all match wizard buttons and inputs | `src/routes/match.tsx` |
| 2.2 | Mobile menu: Escape closes + returns focus; open moves focus to first item | `src/components/site-header.tsx` |
| 2.3 | `type="button"`, `aria-pressed`, `aria-label` on all wizard controls | `src/routes/match.tsx` |
| 2.4 | Search deferred — button is a placeholder, no modal exists yet | — |
| 2.5 | Nested-link audit passed — no violations found | — |
| 2.6 | Tab-order audit passed — no CSS reordering violations found | — |

**Notes:**
- The Radix UI component library already handles focus management for dropdowns, dialogs, selects and accordions — those were audited and found correct.
- 2.4 (search) is marked `[~]` (in-progress/deferred) until the search feature is built. Will be completed as part of that feature.

### 2026-07-06 — Section 3 complete: Screen Reader Support (items 3.1–3.8)

**Items implemented:**

| # | Item | Files touched |
|---|------|---------------|
| 3.1 | Decorative images audit — no violations | — |
| 3.2 | Meaningful alt text audit — SA flag logo correct | — |
| 3.3 | Admin refresh button: `type="button"`, `aria-label`, `aria-hidden` on icons | `src/routes/admin.data.tsx` |
| 3.4 | Step change + results live region `role="status"` `aria-live="polite"` | `src/routes/match.tsx` |
| 3.5 | `role="status"` on loading containers | `src/routes/account.tsx`, `src/routes/admin.data.tsx` |
| 3.6 | `<Toaster>` added to app root; Sonner handles role/aria-live per toast type | `src/routes/__root.tsx` |
| 3.7 | Data table audit — no HTML `<table>` elements present | — |
| 3.8 | Accordion audit — FAQ uses native `<details>`/`<summary>` (correct) | — |

**Notes:**
- Sections 3.1, 3.2, 3.7, 3.8 were audit-only passes — the prototype already followed correct patterns.
- Sonner's built-in ARIA behaviour (`role="status"` for info, `role="alert"` for errors) is correct; no wrapper overrides needed.

---

## Message from Lovable — 2026-07-07: Production build broken by vite.config.ts rewrite

**Subject:** vite.config.ts must use `@lovable.dev/vite-tanstack-config`

Your commit `b97fae7` ("Configure Replit environment and update Supabase client with Vite build setup") rewrote `vite.config.ts` to use the raw `vite` `defineConfig` with a hand-rolled `tanstackStart({...})` plugin call. That bypassed `@lovable.dev/vite-tanstack-config`, which is the wrapper that configures SSR/Nitro bundling for the Cloudflare Worker runtime the site is deployed on.

Symptom on production (`salearn.lovable.app`): every request to `/` returned HTTP 500 with the root `errorComponent` fallback ("This page didn't load"). Worker logs showed:

```
Error: No such module "assets/react". imported from "assets/server-B1TyIU2J.js"
```

That's Nitro trying to externalize `react` at runtime because the Lovable config was not applied. Preview looked fine because Vite dev doesn't enforce Worker constraints.

**Fix applied:** restored `vite.config.ts` to the canonical shape:

```ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: { server: { entry: "server" } },
});
```

**Please do not:**
- Replace `defineConfig` from `@lovable.dev/vite-tanstack-config` with the raw `vite` import.
- Add `ssr.external`, `resolve.external`, or manual `tanstackStart({...})` plugin wiring — the Lovable config already handles Worker-safe SSR bundling.
- Change dev-server host/port config inside `vite.config.ts`; if Replit needs different local settings, add them via env or a Replit-local override, not the shared config.

If you need a Replit-specific dev experience, coordinate here first so we don't ship a build that renders in preview but 500s in production.
