import { readFile } from "node:fs/promises";

const files = {
  root: await readFile(new URL("../src/routes/__root.tsx", import.meta.url), "utf8"),
  styles: await readFile(new URL("../src/styles.css", import.meta.url), "utf8"),
  i18n: await readFile(new URL("../src/lib/i18n.tsx", import.meta.url), "utf8"),
  account: await readFile(new URL("../src/routes/account.tsx", import.meta.url), "utf8"),
  match: await readFile(new URL("../src/routes/match.tsx", import.meta.url), "utf8"),
};

const failures = [];

if (!files.root.includes('href="#main-content"')) failures.push("Skip-to-content link is missing.");
if (!files.root.includes('name: "viewport", content: "width=device-width, initial-scale=1"')) {
  failures.push("Viewport must preserve browser zoom.");
}
if (!files.styles.includes("@media (prefers-reduced-motion: reduce)")) {
  failures.push("Reduced-motion override is missing.");
}
if (!files.styles.includes(":focus-visible")) failures.push("Global focus-visible safeguard is missing.");
if (!files.i18n.includes("document.documentElement.lang = language")) {
  failures.push("Selected language is not applied to the document.");
}
for (const language of ['code: "en"', 'code: "zu"', 'code: "af"', 'code: "xh"', 'code: "st"']) {
  if (!files.i18n.includes(language)) failures.push(`Language option missing: ${language}`);
}
if (!files.account.includes('autoComplete="email"') || !files.account.includes('aria-required="true"')) {
  failures.push("Account email field lacks autocomplete or required semantics.");
}
if (!files.match.includes("<fieldset") || !files.match.includes("<legend")) {
  failures.push("Subject mark rows lack fieldset/legend grouping.");
}

if (failures.length) {
  console.error("Accessibility source check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Accessibility source checks passed.");
