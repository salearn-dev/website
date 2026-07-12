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

const routeFiles = {
  "/": "../src/routes/index.tsx",
  "/ask": "../src/routes/ask.tsx",
  "/careers": "../src/routes/careers.tsx",
  "/courses": "../src/routes/courses.tsx",
  "/funding": "../src/routes/funding.tsx",
  "/guides": "../src/routes/guides.tsx",
  "/institutions": "../src/routes/institutions.tsx",
  "/match": "../src/routes/match.tsx",
  "/opportunities": "../src/routes/opportunities.tsx",
  "/skills": "../src/routes/skills.tsx",
  "/whatsapp": "../src/routes/whatsapp.tsx",
};

const detailRouteFiles = [
  "../src/routes/careers.$slug.tsx",
  "../src/routes/courses.$slug.tsx",
  "../src/routes/guides.$slug.tsx",
  "../src/routes/institutions.$slug.tsx",
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


const navigation = await Promise.all([
  readFile(new URL("../src/components/site-header.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/components/site-footer.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/routes/index.tsx", import.meta.url), "utf8"),
]).then((sources) => sources.join("\n"));

for (const detailLink of ['to="/courses/$slug"', 'to="/careers/$slug"']) {
  if (!navigation.includes(detailLink)) {
    failures.push(`Homepage lacks crawlable detail link: ${detailLink}`);
  }
}

for (const [route, relativePath] of Object.entries(routeFiles)) {
  const source = await readFile(new URL(relativePath, import.meta.url), "utf8");
  if (!source.includes("buildSeoHead")) {
    failures.push(`Public route does not use shared metadata: ${route}`);
  }
  if (route !== "/" && !navigation.includes(`"${route}"`)) {
    failures.push(`Public route lacks a primary crawlable internal link: ${route}`);
  }
}

for (const [route, expectedUnavailableText] of [
  ["/funding", "Official link unavailable"],
  ["/opportunities", "Application link unavailable"],
]) {
  const source = await readFile(new URL(routeFiles[route], import.meta.url), "utf8");
  if (!source.includes("hasExternalTrustSource") || !source.includes(expectedUnavailableText)) {
    failures.push(`Trust-aware external action is missing: ${route}`);
  }
}

for (const relativePath of detailRouteFiles) {
  const source = await readFile(new URL(relativePath, import.meta.url), "utf8");
  if (!source.includes("StructuredData") || !source.includes("buildBreadcrumbJsonLd")) {
    failures.push(`Detail route lacks structured data or breadcrumbs: ${relativePath}`);
  }
}

if (failures.length) {
  console.error("SEO check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("SEO source checks passed.");
