import { describe, expect, test } from "bun:test";
import { ADMISSION_RULES, evaluateAdmissionRule } from "../../src/lib/admission-rules";

describe("source-backed admission rules", () => {
  test("all rules carry dated HTTPS evidence", () => {
    expect(ADMISSION_RULES.every((rule) => rule.sourceUrl.startsWith("https://") && /^\d{4}-\d{2}-\d{2}$/.test(rule.verifiedAt))).toBe(true);
  });

  test("evaluates APS and faculty subject thresholds", () => {
    const rule = ADMISSION_RULES.find((item) => item.id === "up-biotechnology-2026")!;
    const result = evaluateAdmissionRule(rule, 34, [
      { name: "English FAL", mark: 62 },
      { name: "Mathematics", mark: 58 },
      { name: "Physical Sciences", mark: 55 },
    ]);
    expect(result.eligible).toBe(true);
    expect(result.missing).toEqual([]);
  });
});
