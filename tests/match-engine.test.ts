import { describe, expect, test } from "bun:test";
import { buildMatchGroups, markFor } from "../src/lib/match-engine";
import { literacyProfile, strongSubjectProfile } from "./fixtures/match";

describe("markFor", () => {
  test("prefers Mathematics when both maths subjects exist", () => {
    expect(markFor([
      { name: "Mathematics", mark: 61 },
      { name: "Mathematical Literacy", mark: 79 },
    ], "Mathematics", "Mathematical Literacy")).toBe(61);
  });

  test("falls back to Mathematical Literacy and English FAL", () => {
    expect(markFor(literacyProfile, "Mathematics", "Mathematical Literacy")).toBe(71);
    expect(markFor(literacyProfile, "English HL", "English FAL")).toBe(62);
  });

  test("clamps invalid out-of-range values", () => {
    expect(markFor([{ name: "Mathematics", mark: 120 }], "Mathematics")).toBe(100);
    expect(markFor([{ name: "Mathematics", mark: -4 }], "Mathematics")).toBe(0);
  });
});

describe("buildMatchGroups", () => {
  const groups = buildMatchGroups({ aps: 33, interest: "Health", subjects: strongSubjectProfile });

  test("returns the four learner-facing result groups in stable order", () => {
    expect(groups.map((group) => group.title)).toEqual([
      "You qualify",
      "Almost qualify",
      "Do not qualify yet",
      "Alternative pathways",
    ]);
  });

  test("provides a reason, evidence and next step for every result", () => {
    for (const result of groups.flatMap((group) => group.results)) {
      expect(result.reason.length).toBeGreaterThan(0);
      expect(result.requirementsMet.length + result.requirementsMissing.length).toBeGreaterThan(0);
      expect(result.additionalChecks.length).toBeGreaterThan(0);
      expect(result.nextStep.length).toBeGreaterThan(0);
    }
  });

  test("limits verified claims to source-backed admission rules", () => {
    const results = groups.flatMap((group) => group.results);
    const verified = results.filter((result) => result.confidence === "Verified match");
    const advisory = results.filter((result) => result.confidence !== "Verified match");
    expect(verified.length).toBeGreaterThan(0);
    expect(verified.every((result) => result.nextStep.includes("https://"))).toBe(true);
    expect(advisory.length).toBeGreaterThan(0);
    expect(JSON.stringify(advisory)).toContain("confirm");
  });

  test("falls back safely for missing subjects and blank interest", () => {
    const fallback = buildMatchGroups({ aps: Number.NaN, interest: " ", subjects: [] });
    const serialized = JSON.stringify(fallback);
    expect(serialized).toContain("Estimated APS is 0");
    expect(serialized).toContain("Interest selected: General");
    expect(serialized).toContain("Mathematics-related mark is 0%");
  });
});
