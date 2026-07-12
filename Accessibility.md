# SA Learn — Accessibility Checklist

**Target:** WCAG 2.1 AA  
**Active repository owner:** ChatGPT, secondary accessibility responsibility under repository-wide review  
**Previous owner:** Replit — history retained in `models/replit.md`  
**Updated:** 2026-07-12

Legend:

- ✅ implemented or verified in repository source
- 🟡 implemented foundation; runtime or human validation still required
- ⏸ deferred because the underlying feature does not exist
- 🔒 requires production/device/account access

Repository inspection is not WCAG certification. Runtime evidence remains explicitly separate.

## 1. Structure and landmarks

- ✅ Skip-to-content link targets `#main-content`.
- ✅ Shared page shell provides the main landmark.
- ✅ Header, footer and navigation landmarks use semantic elements and labels.
- ✅ Priority routes provide route-specific titles.
- ✅ Shared page patterns provide one primary H1 with subordinate headings.
- 🟡 Rendered landmark and heading order requires a production crawl.

## 2. Keyboard navigation

- ✅ Match controls are native buttons/inputs with visible focus treatment.
- ✅ Mobile menu supports Escape, focus entry and focus return.
- ✅ Match selection state uses `aria-pressed`.
- ✅ Global `:focus-visible` safeguard covers native and custom focusable controls.
- ✅ Windows forced-colors focus and control borders are supported.
- ⏸ Search modal keyboard behavior is deferred; no search modal exists.
- 🟡 Full keyboard-only production walkthrough remains required.

## 3. Screen-reader support

- ✅ Root error and not-found experiences provide useful text and actions.
- ✅ Match step/results changes use a polite live region.
- ✅ Account and administration loading states expose status semantics.
- ✅ Notifications use the shared accessible toaster.
- ✅ Institution and logo images provide meaningful alt text.
- ✅ Decorative Lucide icons audited in critical paths use `aria-hidden`.
- ✅ Match mark rows now use `fieldset` and `legend`, with unit descriptions.
- 🟡 VoiceOver and NVDA smoke testing remains required.

## 4. Colour, contrast and non-colour cues

- ✅ Semantic status messages include text and/or icons; meaning is not expressed solely through colour in reviewed critical paths.
- ✅ Placeholder opacity is normalised and uses the muted foreground token.
- ✅ Global focus outline uses the ring token and a three-pixel outline.
- ✅ Forced-colors support preserves visible focus and form boundaries.
- 🟡 Every foreground/background OKLCH pair still requires measured contrast evidence in both themes.
- 🟡 Colour-blind simulation remains required.
- 🟡 Token adjustments must follow measured failures rather than visual guessing.

## 5. Forms and inputs

- ✅ Account email has a visible label, stable identifier, email autocomplete, input mode and required semantics.
- ✅ Account notices and errors use distinct live/status identifiers.
- ✅ Match subject marks are grouped semantically.
- ✅ Ask SA Learn has a visible label associated with its input.
- ✅ Existing filter and custom select components use native or Radix semantics.
- 🟡 Testimonial and institution-portal forms require a full field-by-field error association review.
- 🟡 All forms require browser autofill and invalid-state testing.

## 6. Motion and sensory access

- ✅ A global `prefers-reduced-motion: reduce` override suppresses non-essential animation, transitions and smooth scrolling.
- ✅ No flashing or parallax content was found in repository source.
- 🟡 Reduced-motion behavior must be confirmed in a production browser.

## 7. Text and readability

- ✅ Browser zoom is preserved; viewport metadata does not disable scaling.
- ✅ Longer guidance sections commonly use constrained layouts and readable line height.
- ✅ Important learner text is represented as HTML rather than image-only content.
- 🟡 200% zoom and reflow testing remains required.
- 🟡 Meaningful `text-xs` usage requires a rendered readability review rather than a blanket source rewrite.

## 8. Language support

- ✅ In-app i18n infrastructure exists.
- ✅ English, isiZulu, Afrikaans, isiXhosa and Sesotho dictionaries exist.
- ✅ Shared navigation, route framing, landing content and footer strings use translation keys.
- ✅ An accessible language selector exists in the header.
- ✅ Language preference persists locally.
- ✅ The document `lang` attribute updates to the selected BCP 47 language code.
- 🟡 Full page copy is not yet translated; many route-detail and workflow strings remain English.
- 🟡 Translation quality requires fluent human review.
- 🟡 Locale-aware date and number formatting requires a dedicated data-formatting audit.

## 9. Mobile and touch

- ✅ Coarse-pointer form controls and buttons receive a 44-pixel minimum height.
- ✅ Checkbox and radio targets receive increased coarse-pointer sizing.
- ✅ Pinch-to-zoom is not disabled.
- ✅ Reviewed critical interactions are not hover-only.
- 🟡 All icon links and dense controls require device-level target measurement.
- 🟡 Portrait/landscape reflow requires real-device or browser testing.

## 10. Automated safeguards and runtime validation

- ✅ `bun run accessibility:check` verifies critical source-level accessibility invariants.
- ✅ The GitHub quality workflow runs the accessibility source check.
- ✅ Pull requests already carry a general verification and public-content gate.
- 🟡 GitHub Actions must complete successfully before the new gate is considered proven.
- 🔒 Axe scan across the public route inventory remains required.
- 🔒 Lighthouse accessibility ≥95 remains a target, not current evidence.
- 🔒 Keyboard-only critical-journey testing remains required.
- 🔒 VoiceOver and NVDA smoke tests remain required.
- 🔒 200% zoom, contrast measurement and colour-blind simulation remain required.

## Critical production journeys to validate

1. Open the homepage, skip to content, navigate header/footer and switch language.
2. Browse courses and open a course detail page.
3. Complete the match journey with keyboard only.
4. Use Ask SA Learn and follow a result.
5. Sign in through email and provider options.
6. Submit testimonial consent and review validation feedback.
7. Browse institution cards and open a sourced institution profile.
8. Trigger loading, empty, invalid and error states.

## Guardrails

- Do not claim WCAG conformance from source review alone.
- Do not remove browser zoom.
- Do not replace native controls with non-semantic clickable containers.
- Do not rely on colour alone.
- Do not use placeholder text as the sole label.
- Do not auto-publish machine translations without human language review.
- Do not modify deployment configuration for accessibility tooling.
- Record accessibility implementation in `models/GPT.md`.
