import { readFile } from "node:fs/promises";

const [migration, route, types] = await Promise.all([
  readFile("supabase/migrations/20260708121200_learner_testimonials.sql", "utf8"),
  readFile("src/routes/index.tsx", "utf8"),
  readFile("src/integrations/supabase/types.ts", "utf8"),
]);

const requiredFields = [
  "user_id",
  "display_name",
  "quote",
  "language",
  "consent_to_publish",
  "moderation_state",
];

const failures = [];
if (!migration.includes("CREATE TABLE IF NOT EXISTS public.learner_testimonials")) {
  failures.push("canonical testimonial migration is missing");
}
if (!route.includes('.from("learner_testimonials")')) {
  failures.push("homepage does not use learner_testimonials");
}
if (route.includes('.from("testimonials")')) {
  failures.push("homepage still uses the legacy testimonials table");
}
if (!types.includes("learner_testimonials: {")) {
  failures.push("Supabase types omit learner_testimonials");
}
for (const field of requiredFields) {
  if (!migration.includes(field) || !types.includes(`${field}:`)) {
    failures.push(`testimonial field is not aligned: ${field}`);
  }
}

if (failures.length > 0) {
  throw new Error(`Testimonial schema contract failed: ${failures.join("; ")}`);
}

console.log("Testimonial schema contract verified.");
