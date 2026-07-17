import { describe, expect, test } from "bun:test";
import { CAREERS, COURSES, GUIDES, INSTITUTIONS } from "../../src/lib/data";

function expectUniqueSlugs(records: Array<{ slug: string }>) {
  expect(new Set(records.map((record) => record.slug)).size).toBe(records.length);
}

describe("public catalogue contracts", () => {
  test("keeps public route slugs unique", () => {
    [CAREERS, COURSES, GUIDES, INSTITUTIONS].forEach(expectUniqueSlugs);
  });

  test("covers all public universities and TVET colleges", () => {
    expect(INSTITUTIONS).toHaveLength(76);
    expect(INSTITUTIONS.every((item) => item.trust.sourceUrl.startsWith("https://"))).toBe(true);
  });

  test("gives every course an HTTPS source", () => {
    expect(COURSES.every((item) => item.trust.sourceUrl.startsWith("https://"))).toBe(true);
  });
});
