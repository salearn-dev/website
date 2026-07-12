# SEO Checklist — SA Learn

Legend

- ✅ = completed in the repository
- 🟡 = implemented but requires live or content evidence
- 🔒 = external operational responsibility

ChatGPT owns the active SEO implementation as a secondary responsibility under its primary repository-wide review role. Repository evidence must not be represented as production-runtime proof.

## Repository-controlled work

1. ✅ robots.txt references the production sitemap and blocks system/private routes.
2. ✅ sitemap.xml emits absolute `https://salearn.online` URLs.
3. ✅ valid course and institution verification timestamps produce sitemap `lastmod`; missing dates are not fabricated.
4. ✅ shared absolute canonical URLs cover the indexable route set.
5. ✅ route policy is centralised in `src/lib/seo-policy.ts` and drives default robots directives.
6. ✅ priority list and detail routes use unique route-aware titles and descriptions.
7. ✅ JSON-LD uses the shared, escaped `StructuredData` component.
8. ✅ Course, Occupation, EducationalOrganization, Article, HowTo, Organization, WebSite and BreadcrumbList schemas are represented where supported by visible data.
9. ✅ sensitive catalogue pages expose trust/source warnings; unverified claims remain qualified.
10. ✅ public route content and metadata follow TanStack Start server-rendering patterns.
11. ✅ public URLs use clean stable slugs; redirect policy is documented in `docs/redirects.md`.
12. ✅ institution and logo images now include alt text and intrinsic dimensions; institution media includes responsive `sizes` and detail-page priority.
13. ✅ public route structures use semantic heading and landmark patterns documented by the accessibility pass.
14. ✅ shared Open Graph and Twitter metadata includes an absolute default social image; the homepage may override it.
15. ✅ `/whatsapp` now uses shared canonical, social and robots metadata.
16. ✅ SEO source regression checks run through `bun run seo:check`.
17. ✅ the repository quality workflow runs clean install, TypeScript, SEO checks and production build.
18. ✅ the pull-request template includes a public SEO and data-trust definition of done.
19. ✅ webmaster, release and monitoring procedures are documented in `docs/seo-operations.md`.
20. ✅ ethical authority and backlink work is specified in `docs/seo-authority-plan.md`.

## Evidence still required

21. 🟡 Rendered production HTML must be checked for canonical, robots, social and JSON-LD output.
22. 🟡 Production sitemap, robots, 404 and 500 status/content-type behavior must be verified live.
23. 🟡 Structured data requires Google Rich Results and Schema.org validation against production pages.
24. 🟡 A complete rendered metadata duplicate/missing audit requires crawlable production access.
25. 🟡 Internal-link and orphan status requires a production crawl; repository navigation is present but is not crawl proof.
26. 🟡 Institution image licences and attribution records require human/source review across all 76 records.
27. 🟡 Core Web Vitals and Lighthouse baselines require live mobile and desktop measurement.
28. 🟡 Accessibility SEO proof still requires axe, keyboard, zoom, contrast and screen-reader testing.
29. 🟡 External links, mixed content and HTTP→HTTPS behavior require a live crawl.
30. 🟡 GitHub Actions must complete successfully on the current head before the quality gate is called proven.

## External operations

31. 🔒 Verify the `salearn.online` Domain property in Google Search Console.
32. 🔒 Submit `https://salearn.online/sitemap.xml` and inspect representative URLs.
33. 🔒 Connect Bing Webmaster Tools and submit the sitemap.
34. 🔒 Assign primary and backup webmaster-account owners outside the repository.
35. 🔒 Monitor indexing, Core Web Vitals, HTTPS and structured-data reports through launch.
36. 🔒 Execute institution/content partnership outreach from the authority plan.

## Guardrails

- Do not fabricate `lastmod`, ratings, reviews, salaries, demand, deadlines, accreditation or eligibility rules.
- Do not place learner-specific or private-route data in metadata, schemas or sitemaps.
- Do not mark live validation complete from repository inspection.
- Preserve stable URLs and use single-hop permanent redirects for future migrations.
- Record SEO implementation in `models/GPT.md`.
