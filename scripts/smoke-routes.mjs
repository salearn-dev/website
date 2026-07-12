const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:4173";
const routes = [
  "/",
  "/courses",
  "/careers",
  "/institutions",
  "/funding",
  "/opportunities",
  "/guides",
  "/match",
];

const failures = [];
for (const route of routes) {
  try {
    const response = await fetch(new URL(route, baseUrl), {
      headers: { accept: "text/html" },
      redirect: "manual",
    });
    const body = await response.text();
    if (response.status !== 200) {
      failures.push(`${route}: HTTP ${response.status}`);
      continue;
    }
    if (!body.includes("<!DOCTYPE html") && !body.includes("<html")) {
      failures.push(`${route}: response is not rendered HTML`);
    }
    if (!body.includes("SA Learn")) {
      failures.push(`${route}: shared application shell is missing`);
    }
  } catch (error) {
    failures.push(`${route}: ${error instanceof Error ? error.name : "request failed"}`);
  }
}

if (failures.length > 0) {
  console.error("Built-preview smoke failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Built-preview smoke passed for ${routes.length} public routes.`);
