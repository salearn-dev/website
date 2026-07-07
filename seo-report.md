# SEO Report — SA Learn (concise handover)

Project: SA Learn (salearn-dev/website)
Domain: https://salearn.online (production domain — adjust if different)
SEO owner: Copilot (model)
Report date: 2026-07-06

Progress update (2026-07-07)
- Shared canonical and route-level SEO metadata are now generated through a common helper for public routes.
- Private and restricted surfaces use noindex-aware metadata.
- Sitemap generation now emits lastmod values when verified timestamps exist in trust metadata.
- Local verification: `npm run build` completed successfully.

---

Indexable routes (public, should be indexed)
- /
- /courses
- /courses/:slug
- /match
- /careers
- /careers/:slug
- /institutions
- /institutions/:slug
- /funding
- /skills
- /opportunities
- /guides
- /guides/:slug
- /sitemap.xml

Noindex / private routes (recommendation)
- /account (NOINDEX_PRIVATE)
- /admin, /api, /internal, /preview, /test (BLOCKED_SYSTEM / NOINDEX_PRIVATE as applicable)

Sitemap URL
- https://salearn.online/sitemap.xml (server-generated at src/routes/sitemap[.]xml.ts)
  - Note: current sitemap generator uses BASE_URL = "". Must set to production domain so <loc> values are absolute.

robots.txt URL
- https://salearn.online/robots.txt (public/robots.txt)
  - Note: current robots.txt is minimal and does not reference sitemap. Update recommended.

Redirect map
- None found in repository. No explicit redirect map detected. (If old URLs exist, provide a mapping before migration.)

Structured data currently used
- None consistently detected on detail pages. Root route provides OG and meta tags server-side.
- Recommendation: add JSON-LD for Organization/WebSite, Course/EducationalOrganization, WebPage, BreadcrumbList and FAQPage where applicable, rendered server-side.

Primary keywords (suggested starters)
- / : "SA Learn", "post-matric guidance South Africa"
- /courses : "courses South Africa", "NQF courses"
- /courses/:slug : "[course name] course", "[course name] [institution]"
- /match : "what do I qualify for South Africa", "APS checker"
- /careers : "career pathways South Africa"
- /institutions : "universities in South Africa", "TVET colleges"
- /funding : "NSFAS eligibility", "bursaries South Africa"
- /skills : "job-ready skills South Africa"
- /opportunities : "learnerships internships South Africa"
- /guides : "APS explained", "what is SAQA"

Top 10 issues to fix (priority ordered)
1. Sitemap loc values are not absolute — set BASE_URL to production (critical).
2. robots.txt lacks Sitemap reference and system Disallow rules (critical).
3. Missing canonical <link rel="canonical"> tags on indexable routes (critical).
4. No JSON-LD structured data on course/career/institution/guide detail pages (high).
5. Some titles/meta descriptions are generic — make them route-specific and unique (high).
6. Sitemap entries lack lastmod where available — add accurate lastmod when content updates are tracked (high).
7. Ensure trust metadata (source, last_verified_at) is visible and included in structured data on detail pages (high).
8. Image SEO: verify alt text, srcset, width/height, compression; avoid lazy-loading LCP hero images (medium).
9. Implement per-route index/noindex classification and enforcement (INDEX_PUBLIC/NOINDEX_PUBLIC/NOINDEX_PRIVATE) (medium).
10. Add Lighthouse CI and SEO PR checklist to CI to prevent regressions (medium).

Quick remediation summary (one-line fixes)
- Set BASE_URL = "https://salearn.online" in src/routes/sitemap[.]xml.ts (1–2 hrs).
- Update public/robots.txt to include Sitemap line and Disallow list (0.5–1 hr).
- Add canonical links to server head in __root.tsx or per-route head() output (2–4 hrs).
- Create a JSON-LD templates library and render JSON-LD in route heads for detail pages (4–8 hrs).
- Audit titles/meta across top 200 pages and update key pages (4–8 hrs).
- Add last_verified_at tracking into sitemap generation where source_records provide timestamps (2–4 hrs).
- Image audit and add responsive attributes + compression (3–6 hrs).
- Add an SEO PR checklist file (.github/seo-checklist.md) and Lighthouse CI workflow (3–6 hrs).

Known good things
- Server-rendered head metadata pattern via route head functions — supports server-side meta and JSON-LD injection.
- Sitemap generator exists and returns XML via a server route (good foundation).
- TrustMetadata component present in course listings (good UI trust pattern).

Suggested next steps (first week)
1. Implement critical fixes (BASE_URL in sitemap, robots.txt updates, add canonicals). Estimated 1–2 days.
2. Add JSON-LD templates and deploy to a staging environment; test with Rich Results and structured data testing. Estimated 2–3 days.
3. Run a focused Lighthouse CI baseline for the homepage, 5 course pages, 3 guide pages, and the match page. Estimated 1 day.
4. Add SEO PR checklist and Lighthouse CI workflow to catch regressions. Estimated 1 day.
5. Produce full /seo-report.md with per-route keyword and metadata table after the initial audit changes. Estimated 2–3 days.

Contact and handover
- SEO owner: Copilot (model) — contributions and suggested PRs will be incremental. I will follow Lovable rules (no force-pushes, keep branches deployable).

---

Notes
- All changes must avoid exposing learner-sensitive data in public pages or sitemaps.
- For any production domain other than https://salearn.online, replace BASE_URL and robots Sitemap line accordingly.
