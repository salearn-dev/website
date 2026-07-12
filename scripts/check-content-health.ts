import { COURSES, INSTITUTIONS, LAST_VERIFIED } from "../src/lib/data";
import { INSTITUTION_IMAGES } from "../src/lib/institution-images";

const failures: string[] = [];

function isHttps(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function checkUniqueSlugs(label: string, records: Array<{ slug: string }>) {
  const seen = new Set<string>();
  for (const record of records) {
    if (!record.slug || seen.has(record.slug)) failures.push(`${label}: duplicate or empty slug ${record.slug}`);
    seen.add(record.slug);
  }
}

function checkTrust(
  label: string,
  records: Array<{ slug: string; trust: { sourceName: string; sourceUrl: string; lastVerifiedAt: string; verificationStatus: string } }>,
) {
  for (const record of records) {
    if (!record.trust.sourceName.trim()) failures.push(`${label}/${record.slug}: missing source name`);
    if (!isHttps(record.trust.sourceUrl)) failures.push(`${label}/${record.slug}: invalid source URL`);
    if (record.trust.verificationStatus === "Verified") {
      if (record.trust.lastVerifiedAt === LAST_VERIFIED || Number.isNaN(Date.parse(record.trust.lastVerifiedAt))) {
        failures.push(`${label}/${record.slug}: verified record lacks a valid verification date`);
      }
    }
  }
}

checkUniqueSlugs("courses", COURSES);
checkUniqueSlugs("institutions", INSTITUTIONS);
checkTrust("courses", COURSES);
checkTrust("institutions", INSTITUTIONS);

const institutionSlugs = new Set(INSTITUTIONS.map((institution) => institution.slug));
for (const slug of institutionSlugs) {
  const image = INSTITUTION_IMAGES[slug];
  if (!image) {
    failures.push(`institutions/${slug}: missing hero image`);
    continue;
  }
  if (!isHttps(image.url) || !isHttps(image.sourceUrl)) {
    failures.push(`institutions/${slug}: image or source URL is invalid`);
  }
  if (!image.alt.trim() || !image.sourceName.trim()) {
    failures.push(`institutions/${slug}: image attribution or alt text is missing`);
  }
  if (image.width < 320 || image.height < 120) {
    failures.push(`institutions/${slug}: image is too small (${image.width}x${image.height})`);
  }
}

for (const slug of Object.keys(INSTITUTION_IMAGES)) {
  if (!institutionSlugs.has(slug)) failures.push(`institution-images/${slug}: orphan image mapping`);
}

if (failures.length) {
  console.error("Content health check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Content health passed: ${COURSES.length} courses, ${INSTITUTIONS.length} institutions, ${Object.keys(INSTITUTION_IMAGES).length} images.`,
);
