import { spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Codex: Public institution image collector
// Status: Some official South African institution sites serve incomplete certificate chains.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const CLOUD_NAME = "csntwfsm";
const UPLOAD_PRESET = "salearn";
const PUBLIC_ID_REVISION = "hero-20260712";
const DATA_FILE = new URL("../src/lib/data.ts", import.meta.url);
const TARGET_FILE = new URL("../src/lib/institution-images.ts", import.meta.url);
const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const args = new Set(process.argv.slice(2));
const onlyArg = process.argv.find((arg) => arg.startsWith("--only="));
const linksArg = process.argv.find((arg) => arg.startsWith("--links="));
const onlySlugs = onlyArg
  ? new Set(onlyArg.replace("--only=", "").split(",").map((slug) => slug.trim()).filter(Boolean))
  : null;

const headers = {
  "user-agent":
    "SA Learn institution image collector (+https://salearn.online; educational catalogue)",
  accept: "text/html,application/xhtml+xml",
};

const browserImageHeaders = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
  accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
};

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function attr(tag, name) {
  const pattern = new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i");
  return tag.match(pattern)?.[1];
}

function parseSeeds(content) {
  const seeds = [];
  const seedPattern =
    /\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*type:\s*"([^"]+)",\s*province:\s*"([^"]+)",\s*website:\s*"([^"]+)",\s*campuses:\s*\[([^\]]*)\]\s*\}/g;

  for (const match of content.matchAll(seedPattern)) {
    seeds.push({
      slug: match[1],
      name: match[2],
      type: match[3],
      province: match[4],
      website: match[5],
      campuses: [...match[6].matchAll(/"([^"]+)"/g)].map((campus) => campus[1]),
    });
  }

  return seeds;
}

function absoluteUrl(raw, base) {
  const decoded = decodeHtml(raw.trim());
  if (!decoded || decoded.startsWith("data:") || decoded.startsWith("blob:")) return null;

  try {
    return new URL(decoded, base).toString();
  } catch {
    return null;
  }
}

function scoreUrl(url, reason) {
  const lower = url.toLowerCase();
  let score = reason.includes("og:") || reason.includes("twitter") ? 70 : 35;

  if (/hero|banner|campus|building|student|students|home|main|slider|slide|header/.test(lower)) {
    score += 25;
  }

  if (/logo|favicon|icon|badge|crest|seal|sprite|placeholder|avatar/.test(lower)) {
    score -= 55;
  }

  if (/\.(webp|jpe?g|png)(\?|$)/.test(lower)) {
    score += 10;
  }

  if (/\.svg(\?|$)/.test(lower)) {
    score -= 80;
  }

  return score;
}

function addCandidate(candidates, seen, rawUrl, baseUrl, sourceName, reason) {
  if (!rawUrl) return;
  const url = absoluteUrl(rawUrl, baseUrl);
  if (!url || seen.has(url)) return;
  seen.add(url);
  candidates.push({
    url,
    sourcePage: baseUrl,
    sourceName,
    reason,
    score: scoreUrl(url, reason),
  });

  if (url.includes("?")) {
    const cleanUrl = url.split("?")[0];
    if (!seen.has(cleanUrl) && /\.(webp|jpe?g|png)$/i.test(cleanUrl)) {
      seen.add(cleanUrl);
      candidates.push({
        url: cleanUrl,
        sourcePage: baseUrl,
        sourceName,
        reason: `${reason} clean-url`,
        score: scoreUrl(cleanUrl, reason) + 5,
      });
    }
  }

  const wordpressProxy = url.match(/^https:\/\/i\d\.wp\.com\/([^?]+)/i);
  if (wordpressProxy) {
    const directUrl = `https://${wordpressProxy[1]}`;
    if (!seen.has(directUrl)) {
      seen.add(directUrl);
      candidates.push({
        url: directUrl,
        sourcePage: baseUrl,
        sourceName,
        reason: `${reason} direct-wordpress`,
        score: scoreUrl(directUrl, reason) + 8,
      });
    }
  }
}

function largestSrcsetUrl(srcset) {
  if (!srcset) return undefined;

  const candidates = srcset
    .split(",")
    .map((item) => item.trim().match(/^(\S+)\s+(\d+)(w|x)$/))
    .filter(Boolean)
    .map((match) => ({
      url: match[1],
      size: Number(match[2]) * (match[3] === "x" ? 1000 : 1),
    }))
    .sort((a, b) => b.size - a.size);

  return candidates[0]?.url;
}

async function fetchWithTimeout(url, init, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchHome(seed) {
  const attempts = [`https://${seed.website}/`, `https://www.${seed.website}/`];

  for (const url of attempts) {
    try {
      const response = await fetchWithTimeout(url, { headers, redirect: "follow" }, 12000);
      if (!response.ok) continue;
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("text/html")) continue;
      return { url: response.url, html: await response.text() };
    } catch {
      // Try the next canonical homepage format.
    }
  }

  return null;
}

async function collectCandidates(seed) {
  const home = await fetchHome(seed);
  if (!home) return [];

  const candidates = [];
  const seen = new Set();

  for (const tag of home.html.matchAll(/<meta\b[^>]*>/gi)) {
    const meta = tag[0];
    const property = attr(meta, "property") ?? attr(meta, "name") ?? "";
    const content = attr(meta, "content");
    if (/^(og:image|og:image:secure_url|twitter:image)$/i.test(property)) {
      addCandidate(candidates, seen, content, home.url, seed.name, property);
    }
  }

  for (const tag of home.html.matchAll(/<link\b[^>]*>/gi)) {
    const link = tag[0];
    const rel = attr(link, "rel") ?? "";
    const as = attr(link, "as") ?? "";
    if (/image_src|preload/i.test(rel) && (!as || /image/i.test(as))) {
      addCandidate(candidates, seen, attr(link, "href"), home.url, seed.name, "link image");
    }
  }

  for (const tag of home.html.matchAll(/<img\b[^>]*>/gi)) {
    const image = tag[0];
    const src =
      largestSrcsetUrl(attr(image, "srcset") ?? attr(image, "data-srcset")) ??
      attr(image, "src") ??
      attr(image, "data-src") ??
      attr(image, "data-lazy-src");
    const descriptor = `${attr(image, "class") ?? ""} ${attr(image, "alt") ?? ""}`;
    addCandidate(candidates, seen, src, home.url, seed.name, `img ${descriptor}`.trim());
  }

  for (const style of home.html.matchAll(/url\(["']?([^"')]+)["']?\)/gi)) {
    addCandidate(candidates, seen, style[1], home.url, seed.name, "css background image");
  }

  return candidates.sort((a, b) => b.score - a.score).slice(0, 18);
}

async function uploadCandidate(seed, candidate) {
  const imageResponse = await fetchWithTimeout(
    candidate.url,
    {
      headers: {
        ...browserImageHeaders,
        referer: candidate.sourcePage,
      },
      redirect: "follow",
    },
    45000,
  );

  if (!imageResponse.ok) {
    throw new Error(`Image fetch ${imageResponse.status}`);
  }

  const contentType = imageResponse.headers.get("content-type") ?? "";
  const looksLikeImage = /\.(webp|jpe?g|png)(\?|$)/i.test(candidate.url);
  if ((!contentType.startsWith("image/") && !looksLikeImage) || contentType.includes("svg")) {
    throw new Error(`Unsupported content type: ${contentType || "unknown"}`);
  }

  const imageBlob = await imageResponse.blob();
  if (imageBlob.size < 8_000) {
    throw new Error(`Image file too small: ${imageBlob.size} bytes`);
  }

  const effectiveType = contentType.startsWith("image/") ? contentType : "image/jpeg";
  return uploadBlob({
    seed,
    blob: imageBlob,
    contentType,
    sourcePage: candidate.sourcePage,
    sourceName: candidate.sourceName,
    extensionHint: candidate.url,
    sourceType: candidate.sourceType,
    verificationStatus: candidate.verificationStatus,
    notes: candidate.notes,
  });
}

async function uploadRemoteCandidate(seed, candidate) {
  const form = new FormData();
  form.set("upload_preset", UPLOAD_PRESET);
  form.set("file", candidate.url);
  form.set("public_id", `salearn/institutions/${seed.slug}-${PUBLIC_ID_REVISION}`);
  form.set("context", `caption=${seed.name}|source=${candidate.sourcePage}`);

  const response = await fetchWithTimeout(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form },
    60000,
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Cloudinary remote fetch ${response.status}: ${body.slice(0, 220)}`);
  }

  const result = await response.json();
  if (result.width < 320 || result.height < 120) {
    throw new Error(`Remote image too small: ${result.width}x${result.height}`);
  }

  return {
    slug: seed.slug,
    name: seed.name,
    url: result.secure_url,
    sourceUrl: candidate.sourcePage,
    sourceName: candidate.sourceName,
    cloudinaryPublicId: result.public_id,
    width: result.width,
    height: result.height,
    sourceType: candidate.sourceType ?? "remote source link",
    verificationStatus: candidate.verificationStatus ?? "manual_link",
    notes: candidate.notes ?? "",
  };
}

async function uploadBlob({
  seed,
  blob,
  contentType,
  sourcePage,
  sourceName,
  extensionHint,
  sourceType = "official website asset",
  verificationStatus = "collector_candidate",
  notes = "",
}) {
  const effectiveType = contentType.startsWith("image/") ? contentType : "image/jpeg";
  const extension = extensionHint.toLowerCase().includes(".png") || contentType.includes("png")
    ? "png"
    : extensionHint.toLowerCase().includes(".webp") || contentType.includes("webp")
      ? "webp"
      : "jpg";
  const form = new FormData();
  form.set("upload_preset", UPLOAD_PRESET);
  form.set("file", new File([blob], `${seed.slug}.${extension}`, { type: effectiveType }));
  // Codex: Versioned final image IDs avoid collisions with rejected unsigned uploads.
  form.set("public_id", `salearn/institutions/${seed.slug}-${PUBLIC_ID_REVISION}`);
  form.set("context", `caption=${seed.name}|source=${sourcePage}`);

  const response = await fetchWithTimeout(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: form,
    },
    45000,
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Cloudinary ${response.status}: ${body.slice(0, 220)}`);
  }

  const result = await response.json();

  if (result.width < 320 || result.height < 120) {
    throw new Error(`Image too small: ${result.width}x${result.height}`);
  }

  return {
    slug: seed.slug,
    name: seed.name,
    url: result.secure_url,
    sourceUrl: sourcePage,
    sourceName,
    cloudinaryPublicId: result.public_id,
    width: result.width,
    height: result.height,
    sourceType,
    verificationStatus,
    notes,
  };
}

function runEdgeScreenshot(url, screenshotPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(EDGE_PATH, [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--ignore-certificate-errors",
      "--window-size=1600,900",
      `--screenshot=${screenshotPath}`,
      url,
    ]);

    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error("Edge screenshot timed out"));
    }, 35000);

    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    child.on("exit", (code) => {
      clearTimeout(timeout);
      if (code === 0) resolve();
      else reject(new Error(`Edge screenshot exited ${code}`));
    });
  });
}

async function uploadHomepageScreenshot(seed) {
  const screenshotDir = join(tmpdir(), "salearn-institution-screenshots");
  await mkdir(screenshotDir, { recursive: true });
  const screenshotPath = join(screenshotDir, `${seed.slug}.png`);
  const attempts = [`https://${seed.website}/`, `https://www.${seed.website}/`];

  for (const url of attempts) {
    try {
      await runEdgeScreenshot(url, screenshotPath);
      const bytes = await readFile(screenshotPath);
      if (bytes.byteLength < 20_000) {
        throw new Error(`Screenshot too small: ${bytes.byteLength} bytes`);
      }

      const blob = new Blob([bytes], { type: "image/png" });
      return await uploadBlob({
        seed,
        blob,
        contentType: "image/png",
        sourcePage: url,
        sourceName: `${seed.name} official homepage screenshot`,
        extensionHint: ".png",
        sourceType: "official homepage screenshot",
        verificationStatus: "generated_screenshot_fallback",
        notes: "Generated from the institution homepage by the local collector.",
      });
    } catch (error) {
      console.warn(`${seed.slug}: screenshot fallback failed for ${url} (${String(error)})`);
    } finally {
      await rm(screenshotPath, { force: true });
    }
  }

  return null;
}

async function collectAndUpload(seed) {
  const candidates = await collectCandidates(seed);

  for (const candidate of candidates) {
    try {
      return await uploadCandidate(seed, candidate);
    } catch (error) {
      console.warn(`${seed.slug}: rejected ${candidate.url} (${String(error)})`);
    }
  }

  if (args.has("--allow-local-screenshots")) {
    console.warn(`${seed.slug}: no uploadable hero image found; trying official homepage screenshot`);
    return uploadHomepageScreenshot(seed);
  }

  console.warn(`${seed.slug}: no uploadable hero image found`);
  return null;
}

async function readExistingImages(seeds) {
  try {
    const content = await readFile(TARGET_FILE, "utf8");
    const slugs = [...content.matchAll(/^\s+"([^"]+)":\s+\{/gm)].map((match) => match[1]);
    const images = [];

    for (const slug of slugs) {
      const block = content.match(new RegExp(`\\s+"${slug}": \\{([\\s\\S]*?)\\n  \\},`))?.[1] ?? "";
      const seed = seeds.find((item) => item.slug === slug);
      const readString = (key) =>
        block.match(new RegExp(`${key}: "([^"]*)"`))?.[1]?.replace(/\\"/g, "\"") ?? "";
      const readNumber = (key) => Number(block.match(new RegExp(`${key}: (\\d+)`))?.[1] ?? 0);

      if (!seed) continue;
      images.push({
        slug,
        name: seed.name,
        url: readString("url"),
        sourceUrl: readString("sourceUrl"),
        sourceName: readString("sourceName"),
        cloudinaryPublicId: readString("cloudinaryPublicId"),
        width: readNumber("width"),
        height: readNumber("height"),
        sourceType: readString("sourceType"),
        verificationStatus: readString("verificationStatus"),
        notes: readString("notes"),
      });
    }

    return images.filter((image) => image.url && image.cloudinaryPublicId);
  } catch {
    return [];
  }
}

function renderMap(images) {
  const entries = images
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map(
      (image) => `  ${JSON.stringify(image.slug)}: {
    url: ${JSON.stringify(image.url)},
    alt: ${JSON.stringify(`${image.name} campus or institution hero image`)},
    sourceUrl: ${JSON.stringify(image.sourceUrl)},
    sourceName: ${JSON.stringify(image.sourceName)},
    cloudinaryPublicId: ${JSON.stringify(image.cloudinaryPublicId)},
    width: ${image.width},
    height: ${image.height},
    sourceType: ${JSON.stringify(image.sourceType ?? "official website asset")},
    verificationStatus: ${JSON.stringify(image.verificationStatus ?? "collector_candidate")},
    notes: ${JSON.stringify(image.notes ?? "")},
  },`,
    )
    .join("\n");

  return `export type InstitutionImage = {
  url: string;
  alt: string;
  sourceUrl: string;
  sourceName: string;
  cloudinaryPublicId: string;
  width: number;
  height: number;
  sourceType?: string;
  verificationStatus?: string;
  notes?: string;
};

// Codex: Institution hero image catalogue
// Status: Generated by scripts/collect-institution-images.mjs from uploaded Cloudinary assets.
export const INSTITUTION_IMAGES: Record<string, InstitutionImage> = {
${entries}
};
`;
}

const data = await readFile(DATA_FILE, "utf8");
const seeds = parseSeeds(data);
const targetSeeds = onlySlugs ? seeds.filter((seed) => onlySlugs.has(seed.slug)) : seeds;
const uploaded = await readExistingImages(seeds);
const existingSlugs = new Set(uploaded.map((image) => image.slug));

if (linksArg) {
  const linksPath = linksArg.replace("--links=", "");
  const content = await readFile(linksPath, "utf8");
  const parsed = JSON.parse(content);
  const records = Array.isArray(parsed.institutions)
    ? parsed.institutions
    : Object.entries(parsed.images ?? {}).map(([slug, value]) => ({
        slug,
        institution_name: value.institution_name,
        image_url: value.image_url,
        source_page_url: value.source_page_url,
        fallback_type: "official image",
        verification: value.verification_status,
        notes: value.notes,
      }));

  for (const record of records) {
    const seed = seeds.find((item) => item.slug === record.slug);
    if (!seed) {
      console.warn(`${record.slug}: not found in institution seeds`);
      continue;
    }

    if (onlySlugs && !onlySlugs.has(seed.slug)) continue;
    if (existingSlugs.has(seed.slug)) {
      console.log(`Skipping ${seed.slug} - already uploaded`);
      continue;
    }

    console.log(`Uploading linked image ${seed.slug} - ${seed.name}`);
    try {
      const candidate = {
        url: record.image_url,
        sourcePage: record.source_page_url,
        sourceName: record.institution_name ?? seed.name,
        reason: record.fallback_type ?? "manual source link",
        score: 100,
        sourceType: record.fallback_type ?? "manual source link",
        verificationStatus: record.verification ?? "manual_link",
        notes: record.notes ?? "",
      };
      let image;
      try {
        image = await uploadCandidate(seed, candidate);
      } catch (directError) {
        console.warn(`${seed.slug}: direct fetch failed; trying Cloudinary remote fetch (${String(directError)})`);
        image = await uploadRemoteCandidate(seed, candidate);
      }
      uploaded.push(image);
      existingSlugs.add(image.slug);
      await writeFile(TARGET_FILE, renderMap(uploaded), "utf8");
    } catch (error) {
      console.warn(`${seed.slug}: linked image rejected (${String(error)})`);
    }
  }

  await writeFile(TARGET_FILE, renderMap(uploaded), "utf8");
  console.log(`Uploaded ${uploaded.length} institution images after linked import.`);
  process.exit(0);
}

for (const seed of targetSeeds) {
  if (existingSlugs.has(seed.slug)) {
    console.log(`Skipping ${seed.slug} - already uploaded`);
    continue;
  }

  console.log(`Collecting ${seed.slug} - ${seed.name}`);
  const image = await collectAndUpload(seed);
  if (image) {
    uploaded.push(image);
    existingSlugs.add(image.slug);
    if (!args.has("--no-incremental-write")) {
      await writeFile(TARGET_FILE, renderMap(uploaded), "utf8");
    }
  }
}

await writeFile(TARGET_FILE, renderMap(uploaded), "utf8");

console.log(`Uploaded ${uploaded.length} of ${seeds.length} institution images.`);
