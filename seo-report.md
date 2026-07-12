# SEO Report — SA Learn

**Domain:** https://salearn.online  
**Repository:** salearn-dev/website  
**Review date:** 2026-07-12  
**Active repository owner:** ChatGPT, secondary SEO role under repository-wide review

## Current position

The repository-controlled technical SEO foundation is implemented. Earlier Copilot reports described canonical, robots, sitemap and structured-data gaps that no longer match the current tree.

The remaining uncertainty is primarily live evidence, content verification and externally owned webmaster operations.

## Implemented

- Absolute canonical origin through `src/lib/seo.ts`
- Central public/private/system route policy
- Route-aware titles, descriptions, Open Graph and Twitter metadata
- Absolute production sitemap
- Conditional, non-fabricated sitemap `lastmod`
- Production robots file with private/system exclusions
- Safe shared JSON-LD serialization
- Course, Occupation, EducationalOrganization, Article, HowTo and BreadcrumbList schemas
- Global Organization and WebSite schemas
- Clean detail-page slugs
- Trust and source disclosures on sensitive catalogue content
- Intrinsic dimensions for learner-facing raster images
- Redirect policy
- PR SEO/data-trust checklist
- Executable SEO source checks
- GitHub quality workflow for install, TypeScript, SEO policy and build
- Search Console/Bing operational handover
- Source-backed authority plan

## Indexable public routes

- `/`
- `/ask`
- `/careers` and `/careers/:slug`
- `/courses` and `/courses/:slug`
- `/funding`
- `/guides` and `/guides/:slug`
- `/institutions` and `/institutions/:slug`
- `/match`
- `/opportunities`
- `/skills`
- `/whatsapp`

## Private or system routes

The central policy classifies account, administration, institution portal, production-readiness and unlock surfaces as private/noindex. API, internal, preview and test prefixes are blocked-system routes. None belongs in the sitemap.

## Data-trust position

Structured data and search copy must describe only visible content. Admissions, accreditation, salary, demand, deadline and eligibility information remains qualified wherever the repository does not contain verified source evidence.

Missing verification timestamps intentionally produce no sitemap `lastmod`.

## Live validation still required

The following cannot be closed from GitHub source alone:

- rendered metadata and schema output;
- production status codes and content types;
- sitemap and robots availability;
- HTTP→HTTPS and mixed-content behavior;
- Google schema validation;
- internal-link/orphan crawl;
- Core Web Vitals and Lighthouse;
- accessibility runtime testing;
- external-link integrity;
- Search Console and Bing ownership, submission and monitoring;
- successful completion of the newly added GitHub quality workflow.

Operational instructions are in `docs/seo-operations.md`.

## Launch monitoring

During the run-up to 1 August, review daily:

- indexed-page changes;
- manual actions and security issues;
- sitemap processing;
- crawl and 5xx errors;
- structured-data errors;
- mobile Core Web Vitals;
- unexpected private URL discovery;
- expired opportunities and application dates.

## Definition of done

Repository SEO is complete when the quality workflow passes and no route-policy regression remains.

Production SEO is complete only when the live checks above pass, webmaster properties are owned and monitored, and high-impact education content has current source evidence.
