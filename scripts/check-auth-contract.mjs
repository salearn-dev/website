import { readFile } from "node:fs/promises";

const [account, policy, environment, skills, opportunities, institutionPortal, adminData, funding, homepage, match] = await Promise.all([
  readFile("src/routes/account.tsx", "utf8"),
  readFile("src/lib/auth-policy.ts", "utf8"),
  readFile(".env.example", "utf8"),
  readFile("src/routes/skills.tsx", "utf8"),
  readFile("src/routes/opportunities.tsx", "utf8"),
  readFile("src/routes/institutions.portal.tsx", "utf8"),
  readFile("src/routes/admin.data.tsx", "utf8"),
  readFile("src/routes/funding.tsx", "utf8"),
  readFile("src/routes/index.tsx", "utf8"),
  readFile("src/routes/match.tsx", "utf8"),
]);

const failures = [];
if (!account.includes("accountRedirectUrl(window.location.origin)")) {
  failures.push("account callbacks do not use the same-origin policy");
}
if (!account.includes("AUTH_PROVIDERS.map")) {
  failures.push("account provider UI bypasses the provider allowlist");
}
if (!policy.includes('enableApple ? ["google", "apple"] : ["google"]')) {
  failures.push("Apple provider is not explicitly feature gated");
}
if (!environment.includes("VITE_ENABLE_APPLE_AUTH=false")) {
  failures.push("Apple feature flag is missing from the environment template");
}
if (/set(?:Error|Notice)\([^;\n]*\.message/.test(account)) {
  failures.push("account exposes a raw auth/provider error");
}

for (const [label, source] of [
  ["skills", skills],
  ["opportunities", opportunities],
  ["institution portal", institutionPortal],
  ["admin data", adminData],
  ["funding", funding],
  ["homepage", homepage],
  ["match", match],
]) {
  if (!source.includes("error: sessionError") || !source.includes("if (sessionError) throw sessionError")) {
    failures.push(`${label} route ignores returned session errors`);
  }
}
if (!institutionPortal.includes("if (roleError) throw roleError")) {
  failures.push("institution portal ignores returned role lookup errors");
}
if (!adminData.includes("if (roleError) throw roleError")) {
  failures.push("admin route ignores returned role lookup errors");
}
if (!opportunities.includes("if (reminderError) throw reminderError")) {
  failures.push("opportunities route ignores returned reminder query errors");
}

if (failures.length > 0) {
  throw new Error(`Auth contract failed: ${failures.join("; ")}`);
}

console.log("Auth contract verified.");
