# SEO — SA Learn Role

This document defines the SEO role for SA Learn (salearn.online) and describes the scope, responsibilities, operational rules, and deliverables for search engine optimisation across the project.

## Name
SEO — SA Learn

## Owner
Copilot (model)

## Purpose
Provide a single source of truth for SEO decisions and implementations across the codebase and editorial content. Ensure public pages are discoverable, understandable, indexable, and trustworthy for both search engines and learners.

## Responsibilities
- Maintain route-level metadata and canonical rules for every public page.
- Produce and maintain sitemap.xml and robots.txt generation guidance and templates.
- Provide JSON-LD structured-data templates (Organization, WebSite, WebPage, Course/EducationalOccupationalProgram, BreadcrumbList, Article/BlogPosting, FAQPage, VideoObject) and ensure they are rendered in server-generated HTML where applicable.
- Audit and recommend performance improvements that affect Core Web Vitals (LCP, INP, CLS).
- Ensure JavaScript-rendered pages are SEO-friendly via SSR/SSG or pre-rendering and that critical content/metadata appear in the initial HTML.
- Coordinate content and editorial teams for on-page SEO (titles, meta descriptions, headings, canonical URLs, internal linking).
- Define image SEO guidelines (filenames, alt text, responsive images, width/height attributes, modern formats).
- Establish monitoring and verification: Google Search Console, Bing Webmaster Tools, Lighthouse CI, Core Web Vitals monitoring, index coverage checks, and sitemap submission processes.
- Create a practical checklist for new routes and PRs so every page shipped is SEO-compliant.

## Operational rules
- Public content must be crawlable and indexable by default unless explicitly marked `noindex`.
- Use `noindex` for private, duplicate, staging, or low-value filter pages; do not rely on robots.txt alone to prevent indexing.
- Store and surface verification metadata for every imported record (`source_name`, `source_url`, `last_verified_at`).
- Do not change deployed URLs without a 301 redirect map and a rollout plan. Preserve existing slugs when possible.
- Respect Lovable-connected branches: avoid rebases/amends/force-pushes on published branches; keep commits incremental and the branch deployable.
- Consent & privacy: never log or expose learners’ sensitive marks or documents in public pages or sitemaps.

## Deliverables (first 90 days)
1. `robots.txt` template and guidance.
2. Dynamic `sitemap.xml` generation plan (crawler-safe; include `lastmod`).
3. Route-level metadata component (meta tags + JSON-LD templates).
4. Core Web Vitals performance baseline and Lighthouse CI pipeline.
5. SEO acceptance checklist for PRs (titles, metas, canonical, structured data, hreflang if needed, robots, sitemap inclusion).
6. Monthly SEO report template (index coverage, top queries, pages with errors, Core Web Vitals trends).

## Contact points
- UI/Frontend: route metadata + SSR/SSG rendering
- Backend/Data: source tracking fields, sitemap feed
- Content/Editorial: titles, descriptions, structured content
- Ops/Deploy: Search Console verification, sitemap submission, monitoring

## Notes
- Prioritise mobile-first signals and low-data users.
- Emphasise trust signals: verification metadata, clear source links, and “Information unavailable” labels where data is missing.
