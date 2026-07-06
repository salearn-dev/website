# SA Learn — Accessibility Plan

> **Status:** Awaiting approval. No implementation has started.
> Once approved, items will be checked off one by one as they are completed.
> This document is owned by the Replit Accessibility model (`models/replit.md`).

---

## How to read this document

Each section is a theme. Each item is a discrete unit of work — small enough to implement, test, and check off independently. Items are ordered by impact: the highest-value changes for the widest range of users come first within each section.

**Legend**
- `[ ]` — not started
- `[~]` — in progress
- `[x]` — complete

---

## 1. Page Structure & Landmarks

These form the skeleton that every assistive technology relies on. They must land before anything else.

- [x] **1.1 Skip-to-content link** — Added visually hidden `<a href="#main-content">Skip to main content</a>` as first focusable element in `__root.tsx`; becomes visible and styled on focus. (`src/routes/__root.tsx`)
- [x] **1.2 `<main>` landmark with `id="main-content"`** — `PageShell` (used by all routes) already renders `<main>`; added `id="main-content"` to it as the skip-link target. Added matching id to `index.tsx`'s own `<main>`. (`src/components/page-shell.tsx`, `src/routes/index.tsx`)
- [x] **1.3 `<nav>` landmarks labelled** — Desktop nav has `aria-label="Primary navigation"`, mobile has `aria-label="Mobile navigation"`. Wrapped the three footer link columns in `<nav aria-label="Footer navigation">` — all three nav landmarks now have unique labels. (`src/components/site-footer.tsx`)
- [x] **1.4 `<footer>` landmark** — `SiteFooter` already uses a semantic `<footer>` element. No change needed.
- [x] **1.5 `<header>` landmark** — `SiteHeader` already uses a semantic `<header>` element. No change needed.
- [x] **1.6 Page `<title>` per route** — Audited all 18 routes. Every route sets a unique `<title>` in the format "Page - SA Learn" via its `head()` function. No changes needed.
- [x] **1.7 Heading hierarchy** — Audited all routes. `PageShell` enforces exactly one `<h1>` per page. Routes use `<h2>` for sections, `<h3>` for subsections, `<h4>` where needed — no levels skipped. `index.tsx` follows the same pattern with its own `<h1>`. No changes needed.

---

## 2. Keyboard Navigation

- [ ] **2.1 Focus-visible styles on all interactive elements** — Confirm `focus-visible:ring-2` is present on every `<button>`, `<a>`, `<input>`, `<select>`, and custom control. Replace any `outline: none` that removes the ring without a replacement.
- [ ] **2.2 Mobile menu keyboard trap** — When the mobile hamburger menu is open, focus must be trapped inside it. Pressing `Escape` must close it and return focus to the trigger button. Implement with a focus-trap utility or Radix `Dialog`.
- [ ] **2.3 Match wizard step navigation** — The 4-step APS calculator (`/match`) must be fully operable by keyboard: `Tab` through fields, `Enter`/`Space` on buttons, `Arrow` keys on radio groups, no mouse-only interactions.
- [ ] **2.4 Search modal keyboard flow** — Opening the search, typing, navigating results with arrow keys, selecting a result with `Enter`, and closing with `Escape` must all work without a mouse.
- [ ] **2.5 Card / list items not wrapping links in links** — Audit course cards, career cards, funding cards for nested interactive elements that create keyboard traps or confusing tab order.
- [ ] **2.6 Logical tab order** — Visually reordered content (CSS `order`, `flex-direction: row-reverse`) must not create a tab order that jumps around the screen.

---

## 3. Screen Reader Support

- [ ] **3.1 Decorative images marked `alt=""`** — Any illustration or icon used purely for decoration must have an empty alt attribute so screen readers skip it.
- [ ] **3.2 Meaningful images have descriptive alt text** — The South African flag logo, institution logos, career images, and any infographics must carry alt text that conveys their meaning in context.
- [ ] **3.3 Icon buttons have accessible names** — Every button that contains only an icon (search, theme toggle, close) must have either a visible label, `aria-label`, or `<span class="sr-only">` text.
- [ ] **3.4 Live region for match results** — When the APS calculator produces results, wrap the output region in `aria-live="polite"` so screen reader users hear the update without having to navigate to it.
- [ ] **3.5 Loading states announced** — Any spinner or skeleton loader should have `aria-busy="true"` on the container and `role="status"` on a live region that announces completion.
- [ ] **3.6 Toasts / notifications accessible** — `sonner` toasts must be rendered in an `aria-live="assertive"` region for error alerts and `aria-live="polite"` for informational ones.
- [ ] **3.7 Data tables have `<caption>` and header scope** — Any data presented in `<table>` must have a `<caption>` and `<th scope="col|row">` so screen readers can associate cells with headers.
- [ ] **3.8 Accordion / collapsible panels** — Audit `<Accordion>` usage (guides, FAQ) for correct `aria-expanded`, `aria-controls`, and `id` wiring.

---

## 4. Colour & Contrast

- [ ] **4.1 Audit OKLCH token contrast ratios** — Programmatically verify every foreground/background token pair in `src/styles.css` meets 4.5 : 1 (normal text) or 3 : 1 (large text / UI components) in both light and dark modes.
- [ ] **4.2 Fix any failing token pairs** — Adjust chroma or lightness of any failing tokens without breaking the visual design.
- [ ] **4.3 Status colours (success, warning, danger) not colour-only** — Any information conveyed purely by the green/amber/red status colours must also carry a text label or icon so it is accessible to colour-blind users.
- [ ] **4.4 Focus ring contrast** — Verify the focus ring colour achieves 3 : 1 against its surrounding background in both themes.
- [ ] **4.5 Placeholder text contrast** — Input placeholder text must meet 4.5 : 1 against the input background.

---

## 5. Forms & Inputs

- [ ] **5.1 All inputs have visible `<label>` elements** — Every `<input>`, `<select>`, and `<textarea>` in `/match`, `/account`, and the search form must be associated with a `<label>` via `htmlFor` / `id` or `aria-labelledby`.
- [ ] **5.2 Required fields marked accessibly** — Required fields must communicate their status to AT via `aria-required="true"` (in addition to any visual asterisk).
- [ ] **5.3 Inline validation errors linked to their field** — Error messages must use `aria-describedby` pointing to the input so screen readers announce the error when the field is focused.
- [ ] **5.4 Subject mark inputs in `/match`** — The APS subject/mark pairs must be navigable as a group (use `<fieldset>` + `<legend>` per subject row).
- [ ] **5.5 Autocomplete attributes** — Add `autocomplete` attributes to name, email, and other personal fields in `/account` so browsers and AT can help users fill forms.

---

## 6. Motion & Sensory

- [ ] **6.1 Respect `prefers-reduced-motion`** — Wrap all CSS transitions and animations in `@media (prefers-reduced-motion: no-preference)` so they are disabled for users who have requested reduced motion in their OS settings.
- [ ] **6.2 No content that flashes more than 3 times per second** — Audit any animated elements (loading spinners, skeleton shimmer) to confirm they do not trigger photosensitive seizures.
- [ ] **6.3 Parallax and scroll-based animations paused for reduced-motion** — Any scroll-triggered entrance animations on the landing page must be suppressed when the user prefers reduced motion.

---

## 7. Text & Readability

- [ ] **7.1 Body text at least 1rem (16 px equivalent)** — Verify no paragraph or UI label is set below `1rem`. Adjust any `text-xs` that carries meaningful content (not just supplementary metadata).
- [ ] **7.2 Line length capped at ~75 characters** — Prose sections (guides, career descriptions) should use `max-w-prose` or equivalent so lines do not span the full viewport width.
- [ ] **7.3 Text can be resized to 200 % without horizontal scroll** — Test at 200 % browser zoom that all pages are still usable and no text is clipped or overlapping.
- [ ] **7.4 No text in images** — Confirm no important text is baked into images (e.g., promotional banners). If any exist, provide equivalent accessible text.

---

## 8. Language Support (South African Multilingualism)

This section is unique to SA Learn. South Africa has 12 official languages; many learners are more confident in their home language than in English.

- [ ] **8.1 i18n infrastructure** — Integrate `react-i18next` (or equivalent) and configure it for the project. Set up `public/locales/en/` as the baseline namespace.
- [ ] **8.2 Extract all UI strings into translation keys** — Replace every hardcoded English string in shared components (`site-header.tsx`, `site-footer.tsx`, navigation labels, CTA buttons) with `t('key')` calls. This is the largest single piece of work; do it page-by-page.
- [ ] **8.3 isiZulu translation (`zu`)** — Create `public/locales/zu/` and translate all UI strings. isiZulu is the most widely spoken home language in South Africa.
- [ ] **8.4 Afrikaans translation (`af`)** — Create `public/locales/af/` and translate all UI strings. Afrikaans is the third most spoken and the second most used in formal education.
- [ ] **8.5 isiXhosa translation (`xh`)** — Create `public/locales/xh/` and translate all UI strings.
- [ ] **8.6 Sesotho translation (`st`)** — Create `public/locales/st/` and translate all UI strings.
- [ ] **8.7 Language switcher UI** — Add a language picker to the site header (accessible: keyboard operable, screen-reader labelled, current language indicated). Persist the user's choice in `localStorage`.
- [ ] **8.8 `lang` attribute updated dynamically** — When the user switches language, update `<html lang="...">` to the correct BCP 47 code (e.g., `zu`, `af`, `xh`, `st`) so screen readers use the correct pronunciation rules.
- [ ] **8.9 Right-to-left readiness** — No South African official language uses RTL script, but the CSS layout should avoid `left`/`right` in favour of logical properties (`inline-start`/`inline-end`) for future-proofing.
- [ ] **8.10 Locale-aware date and number formatting** — Dates (deadline watch, opportunity closing dates) and numbers (APS scores, bursary amounts) should use `Intl.DateTimeFormat` and `Intl.NumberFormat` respecting the active locale.

---

## 9. Mobile & Touch Accessibility

- [ ] **9.1 Touch targets at least 44 × 44 px** — All buttons, links, and interactive elements must meet the WCAG 2.5.5 minimum touch target size. Audit small icon buttons in the header and card actions.
- [ ] **9.2 No hover-only interactions** — Any tooltip, dropdown, or detail that only appears on hover must also be triggerable by focus (`focus-within`) or tap.
- [ ] **9.3 Pinch-to-zoom not disabled** — Verify the viewport meta tag does not include `user-scalable=no` or `maximum-scale=1`.

---

## 10. Testing & Validation

- [ ] **10.1 Axe automated scan — zero violations on all 18 routes** — Run `axe-core` (via `@axe-core/react` in dev) and resolve every violation before marking this section complete.
- [ ] **10.2 Lighthouse accessibility score ≥ 95 on all routes** — Use Lighthouse CI or the DevTools panel to verify. Address any issues flagged.
- [ ] **10.3 Keyboard-only walkthrough of critical user journeys** — Complete the following journeys without touching a mouse: (a) browse courses and open a detail page, (b) complete the APS match wizard end-to-end, (c) switch language to isiZulu and back.
- [ ] **10.4 Screen reader smoke test** — Use VoiceOver (macOS) or NVDA (Windows) to confirm headings, landmarks, and live regions are announced correctly on the home page and `/match`.
- [ ] **10.5 Colour-blindness simulation** — Use a browser extension (e.g., Colorblindly) to verify status colours and data visualisations are distinguishable under protanopia, deuteranopia, and tritanopia.

---

## Implementation order (recommended)

Sections 1–3 first (structure, keyboard, screen reader) — these are load-bearing for everything else. Then sections 4–6 (sensory). Then 7–9 (readability, language, mobile). Section 10 runs continuously as a gate.

The language section (8) is the most effort-intensive and can be parallelised once the i18n infrastructure (8.1–8.2) is in place — translations for each language are independent of one another.

---

*Last updated: 2026-07-06 by Replit Accessibility model.*
