import { readFile } from "node:fs/promises";

const SITE_URL = "https://salearn.online";
const requiredPublicRoutes = [
  "/",
  "/ask",
  "/careers",
  "/courses",
  "/funding",
  "/guides",
  "/institutions",
  "/match",
  "/opportunities",
  "/skills",
  "/whatsapp",
];
const forbiddenSitemapPrefixes = [
  "/account",
  "/admin",
  "/api",
  "/institutions/portal",
  "/prod-readiness",
  "/unlock",
];

const [seo, policy, sitemap, robots] = await Promise.all([
  readFile(new URL("../src/lib/seo.ts", import.meta.url), "utf8"),
  readFile(new URL("../src/lib/seo-policy.ts", import.meta.url), "utf8"),
  readFile(new URL("../src/routes/sitemap[.]xml.ts", import.meta.url), "utf8"),
  readFile(new URL("../public/robots.txt", import.meta.url), "utf8"),
]);

const failures = [];

if (!seo.includes(`const SITE_URL = "${SITE_URL}"`)) {
  failures.push("src/lib/seo.ts does not use the production canonical origin.");
}

if (!sitemap.includes(`const BASE_URL = "${SITE_URL}"`)) {
  failures.push("sitemap generator does not use the production origin.");
}

if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) {
  failures.push("robots.txt does not reference the production sitemap.");
}

for (const route of requiredPublicRoutes) {
  if (!policy.includes(`"${route}"`)) {
    failures.push(`Public route missing from SEO policy: ${route}`);
  }
  if (!sitemap.includes(`path: "${route}"`)) {
    failures.push(`Public route missing from sitemap: ${route}`);
  }
}

for (const prefix of forbiddenSitemapPrefixes) {
  if (sitemap.includes(`path: "${prefix}"`) || sitemap.includes(`path: \`${prefix}`)) {
    failures.push(`Private/system route must not enter sitemap: ${prefix}`);
  }
}

if (!policy.includes('"noindex-private"') || !policy.includes('"blocked-system"')) {
  failures.push("SEO policy does not define private and blocked route classes.");
}

if (failures.length) {
  console.error("SEO check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("SEO source checks passed.");
