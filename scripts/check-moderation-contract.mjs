import { readFile } from "node:fs/promises";

const [portal, admin, contract] = await Promise.all([
  readFile("src/routes/institutions.portal.tsx", "utf8"),
  readFile("src/routes/admin.data.tsx", "utf8"),
  readFile("src/lib/catalogue-moderation.ts", "utf8"),
]);

const failures = [];
if (portal.includes("supabase as unknown") || portal.includes('status: "under_review"')) {
  failures.push("institution portal contains a legacy schema bypass");
}
if (!portal.includes('moderation_state: "submitted"') &&
    !portal.includes("prepareInstitutionSubmission")) {
  failures.push("institution submissions do not enter moderation");
}
if (!admin.includes("moderationSelectColumns(tableName)")) {
  failures.push("admin queue does not use table-specific select columns");
}
if (!admin.includes("canMarkVerified(row.sourceUrl)")) {
  failures.push("admin verification does not require source evidence");
}
if (!contract.includes('"institutions": "name"') &&
    !contract.includes('institutions: "name"')) {
  failures.push("institution label-column contract is missing");
}

if (failures.length > 0) {
  throw new Error(`Moderation contract failed: ${failures.join("; ")}`);
}

console.log("Moderation contract verified.");
