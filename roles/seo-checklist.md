# SEO Checklist — SA Learn

Legend
- ✅ = done
- ❌ = not done / needs work

This checklist tracks implementation progress for the Premium SEO Standard and the remediation items for salearn.online. Copilot (the repository model) will update this file after each incremental commit.

1) robots.txt includes Sitemap and blocks system routes
✅ public/robots.txt updated to include Sitemap and Disallow rules for system/private routes.

2) sitemap.xml emits absolute production URLs
✅ src/routes/sitemap[.]xml.ts updated to set BASE_URL = "https://salearn.online" so <loc> entries are absolute.

3) sitemap lastmod entries (accurate lastmod when content changes)
❌ Not implemented — prototype data uses placeholder LAST_VERIFIED. Will include <lastmod> when reliable timestamps are available from source records.

4) Canonical URLs on every indexable page (absolute, correct)
❌ Not implemented — plan to add src/lib/seo/canonical.ts and inject canonical links into route head() for indexable routes.

5) Per-route index/noindex classification
❌ Not implemented — plan to add src/lib/seo/routeStatus.ts and enforce in head() and sitemap generation.

6) Unique, route-specific titles and meta descriptions for priority pages
❌ Partial — some routes have metadata (root, courses); detail pages and many routes need a sweep and improved unique descriptions.

7) Structured data (JSON-LD) for Course, Organization, WebPage, BreadcrumbList, FAQPage
❌ Partial — courses.$slug.tsx renders Course JSON-LD; plan to standardise via src/lib/seo/jsonld.ts and add for careers/guides/institutions.

8) Trust metadata visible on pages (source, source URL, last_verified date)
✅ TrustMetadata component present and shown in listings and course detail pages (prototype). Next: include last_verified in JSON-LD where available.

9) No important public page blocked by robots.txt or client-only navigation
✅ robots.txt allows public content and main nav uses real links. Next: scan SPA nav for any client-only links and ensure server-rendered links exist.

10) Server-rendered metadata and content for JavaScript SEO
✅ Project uses server-side head() functions and TanStack React Start; metadata renders server-side for routes tested.

11) Clean, descriptive, stable URL structure
✅ Routes use clean slugs (e.g., /courses/:slug). Ensure no staging/localhost URLs included.

12) Image SEO (filenames, alt, srcset, width/height, LCP handling)
❌ Partial — OG image present; hero and other images need an audit and updates to add srcset, sizes, alt text and width/height. Avoid lazy-loading LCP images.

13) Headings and semantic HTML (one H1 per page)
✅ Observed in key routes (index, courses, course detail). Recommend an automated headings scan across all routes.

14) Accessibility basics (labels, keyboard nav, focus states)
✅ Components show accessible patterns; run automated accessibility audit (axe/Lighthouse) for full coverage.

15) Core Web Vitals & performance baseline + CI checks
❌ Not yet — Lighthouse baseline not run. Plan to add Lighthouse CI workflow to catch regressions.

16) Open Graph / social preview metadata (route-specific)
❌ Partial — root has OG tags; detail pages need route-specific OG tags and preview images.

17) Redirects & migrations (redirect map / no redirect chains)
❌ No redirect map found. If migrating, create docs/redirects.md and implement 301s.

18) 404/500 pages return correct status codes and useful content
✅ 404 and error components exist and server normalises SSR errors to 500 with renderErrorPage. Validate HTTP status codes on staging.

19) HTTPS & security (TLS, no mixed content)
❌ Deployment concern — ensure production uses HTTPS and HTTP→HTTPS redirects. Check external links use https.

20) AI / Answer engine readability (clear headings, plain-language summaries, schema)
❌ Partial — content structure is good; JSON-LD standardisation and FAQ schema additions are needed for better AI/readability.

21) Internal linking & anchor text (no orphan pages)
❌ Partial — main routes are linked; generate an orphan-report and link important pages from index/category pages.

22) Page-level SEO definition of done enforced for top routes
❌ Not yet — add .github/seo-checklist.md and require in PR reviews. This file will be kept in /roles and referenced from PR guidance.

23) Search Console and Bing Webmaster Tools connected
❌ Not yet — documented in seo-report.md; ownership and sitemap submission pending.

24) Backlink & authority readiness (content assets)
❌ Not yet — plan to produce cornerstone guides, data pages and outreach plan.

Notes & blockers
- lastmod in sitemap depends on real verification timestamps — currently placeholder "Not yet verified" in src/lib/data.ts.
- Some structured data fields must only be added once the underlying data is verified (data-before-AI rule).

Next immediate commits (high priority)
- Add src/lib/seo/canonical.ts and inject canonical link rel into route head() outputs for indexable routes. (I will commit this next.)
- Standardise JSON-LD via src/lib/seo/jsonld.ts and update detail pages to use helpers.
- Add lastmod extraction in src/routes/sitemap[.]xml.ts where trust.lastVerifiedAt exists (and is valid). 

Ownership and process
- Copilot (models/copilot.md) will append an activity log entry with each commit and update the ✅/❌ statuses here.
- All commits will be incremental and non-destructive; no history rewriting. Sensitive learner data will not be exposed.

