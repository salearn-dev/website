import { readFile } from "node:fs/promises";

const [funding, types, uploadPolicy, rlsTests] = await Promise.all([
  readFile("src/routes/funding.tsx", "utf8"),
  readFile("src/integrations/supabase/types.ts", "utf8"),
  readFile("src/lib/learner-document.ts", "utf8"),
  readFile("tests/integration/rls.test.ts", "utf8"),
]);

const failures = [];
if (!types.includes("consent_records: {")) failures.push("consent_records type is missing");
if (!funding.includes('.from("consent_records")')) {
  failures.push("document uploads do not use typed consent_records");
}
if (funding.includes("document_consents") || funding.includes("supabase as unknown")) {
  failures.push("funding route contains an undocumented schema cast");
}
if (!funding.includes('storage.from("learner-documents").remove([path])')) {
  failures.push("failed consent writes do not roll back uploaded objects");
}
if (!uploadPolicy.includes("MAX_LEARNER_DOCUMENT_BYTES")) {
  failures.push("learner document size boundary is missing");
}
if (!rlsTests.includes("learner document objects are owner scoped")) {
  failures.push("storage isolation integration proof is missing");
}

if (failures.length > 0) {
  throw new Error(`Sensitive-data contract failed: ${failures.join("; ")}`);
}

console.log("Sensitive-data contract verified.");
