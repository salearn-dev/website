import { readFile } from "node:fs/promises";

const workflow = await readFile(".github/workflows/quality.yml", "utf8");
const packageJson = JSON.parse(await readFile("package.json", "utf8"));

const requiredWorkflowFragments = [
  "rls-integration:",
  "vars.RLS_TESTS_REQUIRED == 'true'",
  "run: bun run test:integration:rls",
  "SUPABASE_TEST_URL: ${{ secrets.SUPABASE_TEST_URL }}",
  "SUPABASE_TEST_ADMIN_TOKEN: ${{ secrets.SUPABASE_TEST_ADMIN_TOKEN }}",
  "SUPABASE_TEST_INSTITUTION_TOKEN: ${{ secrets.SUPABASE_TEST_INSTITUTION_TOKEN }}",
  "SUPABASE_TEST_USER_A_EMAIL: ${{ secrets.SUPABASE_TEST_USER_A_EMAIL }}",
  "SUPABASE_TEST_USER_A_PASSWORD: ${{ secrets.SUPABASE_TEST_USER_A_PASSWORD }}",
  "SUPABASE_TEST_USER_B_EMAIL: ${{ secrets.SUPABASE_TEST_USER_B_EMAIL }}",
  "SUPABASE_TEST_USER_B_PASSWORD: ${{ secrets.SUPABASE_TEST_USER_B_PASSWORD }}",
  "SUPABASE_TEST_ADMIN_EMAIL: ${{ secrets.SUPABASE_TEST_ADMIN_EMAIL }}",
  "SUPABASE_TEST_ADMIN_PASSWORD: ${{ secrets.SUPABASE_TEST_ADMIN_PASSWORD }}",
  "SUPABASE_TEST_INSTITUTION_EMAIL: ${{ secrets.SUPABASE_TEST_INSTITUTION_EMAIL }}",
  "SUPABASE_TEST_INSTITUTION_PASSWORD: ${{ secrets.SUPABASE_TEST_INSTITUTION_PASSWORD }}",
];

const missingWorkflow = requiredWorkflowFragments.filter((fragment) => !workflow.includes(fragment));
const integrationCommand = packageJson.scripts?.["test:integration:rls"] ?? "";
const unitCommand = packageJson.scripts?.["test:unit"] ?? "";

if (missingWorkflow.length > 0) {
  throw new Error(`RLS CI contract is missing: ${missingWorkflow.join(", ")}`);
}
if (!integrationCommand.includes("REQUIRE_RLS_TESTS=1")) {
  throw new Error("RLS integration command must fail closed when credentials are missing.");
}
if (unitCommand.includes("integration")) {
  throw new Error("The unit-test command must not include credential-dependent integration tests.");
}

console.log("RLS CI contract verified.");
