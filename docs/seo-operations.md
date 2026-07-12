# SEO Operations — SA Learn

Repository implementation is only one part of SEO readiness. These tasks require access to production infrastructure or webmaster accounts and must not be marked complete from code evidence alone.

## Production origin

- Canonical origin: `https://salearn.online`
- Sitemap: `https://salearn.online/sitemap.xml`
- Robots: `https://salearn.online/robots.txt`

## Google Search Console

1. Add a Domain property for `salearn.online`.
2. Verify through DNS using the account controlled by the project owner.
3. Submit the production sitemap.
4. Inspect the homepage and representative course, institution, career and guide URLs.
5. Review Page indexing, Core Web Vitals, HTTPS and Enhancements reports weekly until launch stabilises.
6. Record the account owner and backup owner outside the repository. Never commit verification secrets.

## Bing Webmaster Tools

1. Import the verified Search Console property or verify through DNS.
2. Submit the same sitemap.
3. Review crawl, index and structured-data diagnostics.
4. Assign an operational owner and backup owner.

## Release verification

For every production release that changes public routes:

- Confirm HTTP→HTTPS redirect behavior.
- Confirm canonical tags use the production origin.
- Confirm private routes emit noindex and do not enter the sitemap.
- Confirm sitemap returns HTTP 200 with XML content type.
- Confirm robots returns HTTP 200 and references the sitemap.
- Validate representative schemas with Google Rich Results Test and Schema.org Validator.
- Check for mixed content and broken external assets.
- Record mobile Core Web Vitals for the homepage and one representative detail page per content type.

## Review cadence

- Daily during the 1 August launch window: coverage, manual actions and critical errors.
- Weekly after launch: indexing changes, CWV, structured-data errors and top landing pages.
- Monthly: content decay, broken links, orphan pages, source verification and opportunity/deadline expiry.

## Escalation

Immediately investigate:

- sudden indexed-page loss;
- canonical URLs pointing away from `salearn.online`;
- private URLs appearing in search;
- sitemap or robots failures;
- structured data describing content not visible on the page;
- sharp increases in 404, 5xx or soft-404 reports.
