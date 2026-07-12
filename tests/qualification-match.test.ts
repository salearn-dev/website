import { describe, expect, test } from "bun:test";
import { buildQualificationGroups } from "@/lib/qualification-match";

describe("non-matric qualification matching", () => {
  test("uses an existing qualification instead of APS admission rules", () => {
    const groups = buildQualificationGroups({
      type: "Diploma",
      nqf: 6,
      field: "Business",
      title: "Diploma in Business Management",
    }, "Business");

    expect(groups.map((group) => group.title)).toEqual([
      "Career directions",
      "Study or upskilling options",
    ]);
    expect(JSON.stringify(groups)).toContain("Diploma captured at NQF 6");
    expect(JSON.stringify(groups)).not.toContain("Estimated APS");
  });

  test("keeps qualification recommendations advisory", () => {
    const results = buildQualificationGroups({
      type: "Degree",
      nqf: 7,
      field: "Technology",
      title: "BSc Information Systems",
    }, "Technology").flatMap((group) => group.results);

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((result) => result.confidence !== "Verified match")).toBe(true);
    expect(JSON.stringify(results)).toContain("confirmation");
  });

  test("clamps invalid NQF levels and defaults blank interests", () => {
    const groups = buildQualificationGroups({
      type: "Other",
      nqf: Number.POSITIVE_INFINITY,
      field: "",
      title: "",
    }, " ");

    const serialized = JSON.stringify(groups);
    expect(serialized).toContain("NQF 1");
    expect(serialized).toContain("Interest selected: General");
  });

  test("falls back to a stable career set when no field matches", () => {
    const first = buildQualificationGroups({
      type: "Other",
      nqf: 4,
      field: "Unmapped specialist field",
      title: "Certificate",
    }, "Unmapped interest");
    const second = buildQualificationGroups({
      type: "Other",
      nqf: 4,
      field: "Unmapped specialist field",
      title: "Certificate",
    }, "Unmapped interest");

    expect(first[0].results.map((result) => result.title)).toEqual(
      second[0].results.map((result) => result.title),
    );
    expect(first[0].results).toHaveLength(4);
  });
});
