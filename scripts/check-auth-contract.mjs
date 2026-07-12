import { readFile } from "node:fs/promises";

const [account, policy, environment] = await Promise.all([
  readFile("src/routes/account.tsx", "utf8"),
  readFile("src/lib/auth-policy.ts", "utf8"),
  readFile(".env.example", "utf8"),
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

if (failures.length > 0) {
  throw new Error(`Auth contract failed: ${failures.join("; ")}`);
}

console.log("Auth contract verified.");
