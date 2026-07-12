import { describe, expect, test } from "bun:test";
import { filterCourses, filterOpportunities } from "../src/lib/catalogue-filters";
import { COURSES, OPPORTUNITIES } from "../src/lib/data";

describe("course filters", () => {
  test("searches title, institution and careers without case sensitivity", () => {
    expect(filterCourses(COURSES, { query: "software" }).length).toBeGreaterThan(0);
    expect(filterCourses(COURSES, { query: "UNIVERSITY" }).length).toBeGreaterThan(0);
  });

  test("combines category, province, city, NQF, cost and delivery filters", () => {
    const course = COURSES[0];
    const result = filterCourses(COURSES, {
      category: course.category,
      province: course.province,
      city: course.city,
      nqf: course.nqf ? `NQF ${course.nqf}` : "Not NQF-rated",
      cost: course.cost,
      delivery: course.deliveryMode,
    });
    expect(result).toContainEqual(course);
    expect(result.every((item) => item.province === course.province)).toBe(true);
  });

  test("returns the unfiltered catalogue for default controls", () => {
    expect(filterCourses(COURSES, {
      query: "",
      category: null,
      province: "All",
      city: "All",
      nqf: "All",
      cost: "Any",
      delivery: "Any",
    })).toEqual(COURSES);
  });

  test("returns an empty result for incompatible combined filters", () => {
    expect(filterCourses(COURSES, { province: "__missing__", delivery: "__missing__" })).toEqual([]);
  });
});

describe("opportunity filters", () => {
  test("combines province, sector and type", () => {
    const opportunity = OPPORTUNITIES[0];
    const result = filterOpportunities(OPPORTUNITIES, {
      province: opportunity.province,
      sector: opportunity.sector,
      type: opportunity.type,
    });
    expect(result).toContainEqual(opportunity);
  });

  test("resets to the full catalogue with All filters", () => {
    expect(filterOpportunities(OPPORTUNITIES, {
      province: "All",
      sector: "All",
      type: "All",
    })).toEqual(OPPORTUNITIES);
  });

  test("returns no rows for a missing filter value", () => {
    expect(filterOpportunities(OPPORTUNITIES, { province: "__missing__" })).toEqual([]);
  });
});
