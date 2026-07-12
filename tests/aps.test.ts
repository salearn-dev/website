import { describe, expect, test } from "bun:test";
import { apsPoints, calculateAps } from "../src/lib/aps";
import { strongSubjectProfile } from "./fixtures/match";

describe("apsPoints", () => {
  test.each([
    [100, 7], [80, 7], [79, 6], [70, 6], [69, 5], [60, 5],
    [59, 4], [50, 4], [49, 3], [40, 3], [39, 2], [30, 2],
    [29, 1], [0, 1], [-5, 1], [Number.NaN, 1],
  ])("maps %p to %p point(s)", (mark, points) => {
    expect(apsPoints(mark)).toBe(points);
  });
});

describe("calculateAps", () => {
  test("excludes Life Orientation", () => {
    expect(calculateAps([
      { name: "Life Orientation", mark: 100 },
      { name: "Mathematics", mark: 50 },
    ])).toBe(4);
  });

  test("uses the strongest six eligible subjects regardless of input order", () => {
    expect(calculateAps(strongSubjectProfile)).toBe(33);
  });

  test("does not mutate the supplied subject order", () => {
    const subjects = [...strongSubjectProfile];
    calculateAps(subjects);
    expect(subjects).toEqual(strongSubjectProfile);
  });

  test("returns zero when no eligible subjects exist", () => {
    expect(calculateAps([{ name: "Life Orientation", mark: 90 }])).toBe(0);
  });
});
