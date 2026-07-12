import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await sourceFiles(path));
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(path);
  }
  return files;
}

const forbidden = [
  {
    pattern: /set(?:Error|Message|Notice)\\([^;\\n]*\\.message/g,
    reason: "raw exception assigned to public UI state",
  },
  {
    pattern: /set[A-Za-z]*Message\(error instanceof Error \? error\.message/g,
    reason: "raw exception assigned to learner-facing message",
  },
  {
    pattern: /jsonResponse\([^\n]*error\.message/g,
    reason: "raw exception returned in JSON",
  },
  {
    pattern: /error:\s*error\.message/g,
    reason: "raw exception exposed as an error field",
  },
];

const failures = [];
for (const file of await sourceFiles("src/routes")) {
  const source = await readFile(file, "utf8");
  for (const rule of forbidden) {
    if (rule.pattern.test(source)) failures.push(`${file}: ${rule.reason}`);
    rule.pattern.lastIndex = 0;
  }
}

if (failures.length > 0) {
  console.error("Public error-boundary check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Public error boundaries verified.");
