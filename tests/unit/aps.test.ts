import { describe, expect, test } from "bun:test";
import { apsPoints, calculateAps } from "../../src/lib/aps";

describe("APS calculation", () => {
  test("maps marks to the seven-point scale", () => {
    expect([29, 30, 40, 50, 60, 70, 80].map(apsPoints)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test("uses the best six subjects and excludes Life Orientation", () => {
    expect(calculateAps([
      { name: "Mathematics", mark: 82 },
      { name: "English HL", mark: 74 },
      { name: "Physical Sciences", mark: 68 },
      { name: "Life Sciences", mark: 61 },
      { name: "Geography", mark: 55 },
      { name: "History", mark: 48 },
      { name: "Accounting", mark: 35 },
      { name: "Life Orientation", mark: 95 },
    ])).toBe(30);
  });
});
