import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = new URL("../src/", import.meta.url);
const allowedExtensions = new Set([".ts", ".tsx"]);
const failures = [];

async function walk(url) {
  for (const entry of await readdir(url, { withFileTypes: true })) {
    const child = new URL(entry.name + (entry.isDirectory() ? "/" : ""), url);
    if (entry.isDirectory()) {
      await walk(child);
      continue;
    }
    if (!allowedExtensions.has(extname(entry.name))) continue;

    const path = child.pathname;
    const source = await readFile(child, "utf8");
    const importsServerClient = /(?:from\s+|import\s*\()\s*["'][^"']*client\.server["']/.test(source);
    if (!importsServerClient) continue;

    const isServerModule = /\.server\.[cm]?[jt]sx?$/.test(path);
    const isApprovedServerRoute = path.endsWith("/routes/api.public.opportunities.ts");
    if (!isServerModule && !isApprovedServerRoute) {
      failures.push(relative(root.pathname, path));
    }
  }
}

await walk(root);

if (failures.length) {
  console.error("Server-only boundary check failed:");
  for (const path of failures) console.error(`- ${path} imports the service-role client.`);
  process.exit(1);
}

console.log("Server-only import boundaries passed.");
