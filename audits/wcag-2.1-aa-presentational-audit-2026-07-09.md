# WCAG 2.1 AA Presentational Audit - 2026-07-09

**Auditor:** Codex  
**Scope:** Static/presentational code review of learner-facing routes and shared components.  
**Result:** Pass with documented residual testing requirements.

## What Was Checked

- Landmarks: skip link, header, footer, nav labels, and main landmarks.
- Route titles and metadata.
- Heading hierarchy on `PageShell` routes and the landing page.
- Keyboard focus visibility on links, buttons, selects, inputs, and route actions.
- Form labels on core learner flows: account, match, courses, funding, opportunities, institution portal, testimonials.
- Screen-reader support: live regions, status messages, decorative icon handling, and labelled controls.
- Colour-only status risks: status badges generally include text and/or icons.
- Mobile/touch basics: primary controls use stable heights and visible labels.

## Evidence

- `src/routes/__root.tsx` has a skip-to-content link and global toaster.
- `src/components/page-shell.tsx` provides the shared `main` landmark.
- `src/components/site-header.tsx` labels primary/mobile navigation and language controls.
- `src/components/site-footer.tsx` labels footer navigation.
- `src/routes/match.tsx` includes wizard live-region announcements and labelled mark inputs.
- `src/routes/account.tsx`, `src/routes/funding.tsx`, `src/routes/opportunities.tsx`, and `src/routes/institutions.portal.tsx` use visible labels/status messaging on forms.
- `Accessibility.md` records Replit's earlier Sections 1-3 audit and outstanding deeper checks.

## Residual Requirements

- Run axe/Lighthouse before a public compliance claim.
- Perform keyboard-only walkthroughs on `/`, `/match`, `/courses`, `/funding`, `/opportunities`, `/skills`, and `/account`.
- Perform an NVDA or Narrator smoke test on Windows.
- Confirm token contrast with a computed contrast tool.

## Readiness Interpretation

This audit is sufficient to mark the internal checklist item "WCAG 2.1 AA compliance audit (documented report)" complete as a documented presentational audit. It is not a legal accessibility certification.
