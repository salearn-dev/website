import { describe, expect, test } from "bun:test";
import { evaluateNsfasAnswers, getFundingMatchReasons } from "../src/lib/funding-guidance";

describe("funding matcher", () => {
  test("explains public full-funding NSFAS relevance", () => {
    expect(getFundingMatchReasons("nsfas", "Health", "Full funding", "Public university")).toEqual([
      "Fits public university or TVET study routes.",
      "May cover tuition and allowances for eligible public study.",
    ]);
  });

  test("matches field-specific and workplace routes", () => {
    expect(getFundingMatchReasons("funza-lushaka", "Teaching", "Tuition help", "Public university")).toHaveLength(2);
    expect(getFundingMatchReasons("seta-learnership", "Trades", "Stipend / earn while learning", "Workplace route")).toHaveLength(2);
  });

  test("returns no fabricated reason when the profile does not match", () => {
    expect(getFundingMatchReasons("nsfas", "Creative", "Stipend / earn while learning", "Private provider")).toEqual([]);
  });
});

describe("NSFAS advisory outcomes", () => {
  test("returns a qualified success for the broad public pathway", () => {
    const result = evaluateNsfasAnswers({
      citizenship: "South African citizen",
      institutionType: "Public university",
      householdIncome: "Under R350,000",
      qualification: "Undergraduate qualification",
    });
    expect(result.tone).toBe("success");
    expect(result.body).toContain("not approval");
    expect(result.body).toContain("confirm");
  });

  test.each([
    ["Permanent resident / other", "Public university", "Under R350,000", "Undergraduate qualification"],
    ["South African citizen", "Private provider", "Under R350,000", "Private provider course"],
    ["South African citizen", "Public TVET college", "Above threshold", "TVET programme"],
  ])("returns a warning when a broad condition falls outside guidance", (
    citizenship,
    institutionType,
    householdIncome,
    qualification,
  ) => {
    const result = evaluateNsfasAnswers({ citizenship, institutionType, householdIncome, qualification });
    expect(result.tone).toBe("warning");
    expect(result.title).toBe("Needs careful confirmation");
    expect(result.checks).toHaveLength(4);
  });
});
