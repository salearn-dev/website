import { describe, expect, test } from "bun:test";
import {
  filterCourses,
  filterOpportunities,
  isOpportunityExpired,
  reminderDateFromDeadline,
} from "../src/lib/catalogue-filters";
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

  test("removes opportunities whose parseable deadline has passed", () => {
    const items = [
      { province: "Gauteng", sector: "Tech", type: "Internship", closes: "2026-01-01" },
      { province: "Gauteng", sector: "Tech", type: "Internship", closes: "2026-12-01" },
      { province: "Gauteng", sector: "Tech", type: "Internship", closes: "Information unavailable" },
    ];
    const result = filterOpportunities(items, { asOf: new Date("2026-07-12T12:00:00Z") });
    expect(result).toEqual([items[1], items[2]]);
    expect(isOpportunityExpired("2026-01-01", new Date("2026-07-12T12:00:00Z"))).toBe(true);
  });

  test("sets reminders seven days before a valid deadline with a safe fallback", () => {
    expect(reminderDateFromDeadline("2026-08-01", new Date("2026-07-01T00:00:00Z")).toISOString().slice(0, 10)).toBe("2026-07-25");
    expect(reminderDateFromDeadline("Unknown", new Date("2026-07-01T00:00:00Z")).toISOString().slice(0, 10)).toBe("2026-07-31");
  });
});
