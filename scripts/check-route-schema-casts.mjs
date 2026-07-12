import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(path));
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(path);
  }
  return files;
}

const routeFiles = (await filesUnder("src/routes")).sort();
const failures = [];
for (const path of routeFiles) {
  const source = await readFile(path, "utf8");
  if (source.includes("as unknown as Json")) {
    failures.push(`${path} bypasses the generated JSON contract`);
  }
  if (source.includes("supabase as unknown") &&
      !(path === "src/routes/admin.data.tsx" && source.includes("as unknown as CatalogueClient"))) {
    failures.push(`${path} contains an undocumented Supabase client cast`);
  }
}

const admin = await readFile("src/routes/admin.data.tsx", "utf8");
if (!admin.includes("type CatalogueClient") || !admin.includes("from: (table: CatalogueTable)")) {
  failures.push("approved dynamic catalogue cast lacks a bounded table contract");
}

if (failures.length > 0) {
  throw new Error(`Route schema-cast contract failed: ${failures.join("; ")}`);
}

console.log("Route schema-cast contract verified.");
