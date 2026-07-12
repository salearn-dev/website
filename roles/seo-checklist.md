# SEO Checklist — SA Learn

Legend

- ✅ = implemented in the repository
- 🟡 = partially implemented or requires runtime/content verification
- ❌ = not implemented
- 🔒 = external operational task

This checklist tracks the current SEO state of `salearn.online`. ChatGPT owns the active repository SEO pass from 2026-07-12. A repository check does not substitute for live Search Console, browser, deployment or production-response evidence.

## Technical foundations

1. ✅ **robots.txt includes the production sitemap and blocks system/private routes.**
   - `public/robots.txt` allows public content and blocks `/api/`, `/admin/`, `/account/`, `/internal/`, `/preview/` and `/test/`.

2. ✅ **sitemap.xml emits absolute production URLs.**
   - `src/routes/sitemap[.]xml.ts` uses `https://salearn.online`.

3. 🟡 **Sitemap lastmod entries are emitted when reliable timestamps exist.**
   - Course and institution records use `getLastModified()`.
   - Career, guide and top-level route modification dates are not yet available.
   - Do not invent dates for unverified records.

4. ✅ **Shared absolute canonical URLs exist for indexable routes.**
   - `src/lib/seo.ts` provides `buildSeoHead()` and `getCanonicalUrl()`.
   - Public route coverage has been implemented across the main route set.
   - Runtime HTML verification remains part of the live audit.

5. 🟡 **Per-route index/noindex classification exists in practice but is not centralised.**
   - Public routes use indexable metadata.
   - Known private/internal surfaces use noindex-aware metadata.
   - A single route inventory should become the source of truth for sitemap, robots and metadata policy.

6. 🟡 **Unique titles and meta descriptions cover priority routes.**
   - Main lists and detail templates have route-aware metadata.
   - A generated duplicate/missing metadata audit across all rendered URLs remains outstanding.

7. 🟡 **Structured data is present but not standardised.**
   - Course, Occupation, EducationalOrganization, Article and HowTo JSON-LD exist.
   - Organization/WebSite, BreadcrumbList and FAQPage coverage remains incomplete.
   - Existing schemas require live validation and verified-data review.

8. 🟡 **Trust metadata is visible on sensitive catalogue pages.**
   - Source, source URL, verification status and last-verified state are represented.
   - Coverage and accuracy must be audited across every indexable record.
   - Trust dates should only enter structured data when reliable.

9. ✅ **Public navigation uses crawlable links and robots does not block the main public route set.**

10. ✅ **Metadata and route content use TanStack Start server-rendering patterns.**
    - Live rendered-source verification is still required.

11. ✅ **Public URLs use clean, descriptive slugs.**
    - No migration redirect map is currently needed unless legacy URLs are introduced.

## Content, media and discovery

12. 🟡 **Image SEO is partially implemented.**
    - Institution images have descriptive alt text and resilient fallbacks.
    - Responsive `srcset`/`sizes`, explicit intrinsic dimensions, format/weight audit and LCP verification remain.
    - All 76 image source/licence records require a final attribution audit.

13. ✅ **Semantic headings and one-H1 route patterns are documented across key routes.**
    - Automated rendered-page verification remains desirable.

14. 🟡 **Accessibility foundations support SEO, but the audit is incomplete.**
    - Landmarks, skip navigation and several keyboard/screen-reader improvements exist.
    - Contrast, forms, motion, zoom, touch targets, axe and screen-reader proof remain.

15. ❌ **Core Web Vitals baseline and CI regression checks are not repository-proven.**
    - Establish mobile and desktop baselines for representative routes.
    - Add Lighthouse CI only after thresholds reflect real production behavior.

16. 🟡 **Open Graph and Twitter metadata are generated through the shared helper.**
    - Route-specific social images and live preview validation remain incomplete.

17. ✅ **No redirect map is currently required for a new canonical domain.**
    - Create one before changing established public slugs or migrating legacy URLs.

18. 🟡 **404 and error components exist.**
    - Validate production HTTP status codes, metadata and cache behavior.

19. 🔒 **HTTPS and mixed-content verification are operational checks.**
    - Production is reported live at `https://salearn.online`.
    - Verify HTTP-to-HTTPS redirects, TLS, canonical origin consistency and external asset protocols outside the repository.

20. 🟡 **Answer-engine readability is partially implemented.**
    - Plain-language summaries, headings and several schema types exist.
    - Improve entity consistency, breadcrumbs and source-backed answer sections without overstating unverified data.

21. 🟡 **Internal linking exists across main routes, but no orphan report has been generated.**
    - Audit every sitemap URL for at least one crawlable internal link.
    - Strengthen contextual links between institutions, courses, careers, funding, skills and guides.

22. ❌ **Page-level SEO definition of done is not enforced in pull requests.**
    - Add a concise PR checklist and automated metadata/sitemap checks.

23. 🔒 **Google Search Console and Bing Webmaster Tools require owner action.**
    - Verify domain ownership.
    - Submit `https://salearn.online/sitemap.xml`.
    - Record access owner and review cadence without committing credentials.

24. ❌ **Backlink and authority programme is not established.**
    - Prioritise source-worthy public assets, verified guides and institution/data partnerships before outreach.

## Current priority order

1. Generate a route inventory and centralise index/noindex/sitemap policy.
2. Audit rendered metadata for missing, duplicate or incorrect titles, descriptions and canonicals.
3. Standardise safe JSON-LD helpers and add breadcrumbs plus Organization/WebSite schema.
4. Complete image SEO and licensing/attribution audit.
5. Run internal-link and orphan analysis.
6. Establish production Core Web Vitals and accessibility baselines.
7. Add proportional CI checks and a PR definition of done.
8. Complete Search Console and Bing operational handover.
9. Build a source-worthy content and authority plan.

## Guardrails

- Do not add fabricated `lastmod`, ratings, reviews, salary evidence, admission rules, deadlines or accreditation claims.
- Do not expose learner-sensitive or private-route data in metadata, structured data or sitemaps.
- Do not treat repository implementation as live production proof.
- Keep changes incremental, non-destructive and buildable.
- Record active SEO work in `models/GPT.md`.

## Ownership

- Active SEO repository owner: ChatGPT — `models/GPT.md`
- Previous SEO handover: Copilot — `models/copilot.md`
