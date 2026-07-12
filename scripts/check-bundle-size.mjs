import { readdir, stat } from "node:fs/promises";
import { extname, join } from "node:path";

const roots = [".output/public", "dist"];
const perAssetBytes = 750 * 1024;
const totalBytesLimit = 5 * 1024 * 1024;
const assets = [];

async function walk(path) {
  let entries;
  try {
    entries = await readdir(path, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) await walk(child);
    else if ([".js", ".css"].includes(extname(entry.name))) {
      assets.push({ path: child, bytes: (await stat(child)).size });
    }
  }
}

for (const root of roots) await walk(root);

if (!assets.length) {
  console.error("Bundle budget check could not find production JS/CSS assets.");
  process.exit(1);
}

const failures = assets.filter((asset) => asset.bytes > perAssetBytes);
const totalBytes = assets.reduce((sum, asset) => sum + asset.bytes, 0);

if (failures.length || totalBytes > totalBytesLimit) {
  console.error("Bundle budget exceeded:");
  for (const asset of failures) {
    console.error(`- ${asset.path}: ${Math.ceil(asset.bytes / 1024)} KiB (limit 750 KiB)`);
  }
  if (totalBytes > totalBytesLimit) {
    console.error(`- Total JS/CSS: ${Math.ceil(totalBytes / 1024)} KiB (limit 5120 KiB)`);
  }
  process.exit(1);
}

console.log(`Bundle budget passed: ${assets.length} assets, ${Math.ceil(totalBytes / 1024)} KiB total.`);
