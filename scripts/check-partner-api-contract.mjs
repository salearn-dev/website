import { readFile } from "node:fs/promises";

const [route, policy, tests] = await Promise.all([
  readFile("src/routes/api.public.opportunities.ts", "utf8"),
  readFile("src/lib/partner-opportunity.ts", "utf8"),
  readFile("tests/partner-opportunity.test.ts", "utf8"),
]);

const failures = [];
if (!route.includes("partnerOpportunitySlug(payload)")) {
  failures.push("partner submissions lack deterministic identity");
}
if (!route.includes(".maybeSingle()") || !route.includes("duplicate: true")) {
  failures.push("partner retries are not handled idempotently");
}
if (!route.includes('error.code === "23505"')) {
  failures.push("concurrent duplicate insert races are not handled");
}
if (!route.includes('status: 409')) {
  failures.push("identity conflicts do not return HTTP 409");
}
if (!policy.includes("stableHash(payload.source_url)")) {
  failures.push("submission identity does not separate source URLs");
}
if (!tests.includes('describe("partner opportunity identity"')) {
  failures.push("partner identity regression tests are missing");
}

if (failures.length > 0) {
  throw new Error(`Partner API contract failed: ${failures.join("; ")}`);
}

console.log("Partner API contract verified.");
