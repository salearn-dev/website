import { describe, expect, test } from "bun:test";
import {
  canMarkVerified,
  CATALOGUE_TABLES,
  moderationSelectColumns,
} from "@/lib/catalogue-moderation";

describe("catalogue moderation columns", () => {
  test("uses name only for name-based catalogue tables", () => {
    for (const table of ["institutions", "qualifications", "funding_windows"] as const) {
      expect(moderationSelectColumns(table)).toBe(
        "id,name,source_url,verification_status",
      );
    }
  });

  test("uses title only for title-based catalogue tables", () => {
    for (const table of ["courses", "opportunities", "careers", "skills", "guides"] as const) {
      expect(moderationSelectColumns(table)).toBe(
        "id,title,source_url,verification_status",
      );
    }
  });

  test("defines a label contract for every moderated table", () => {
    expect(CATALOGUE_TABLES).toHaveLength(8);
    expect(CATALOGUE_TABLES.map(moderationSelectColumns).every(
      (columns) => !columns.includes("name,title"),
    )).toBe(true);
  });

  test("requires an HTTPS source before verification", () => {
    expect(canMarkVerified("https://example.edu/source")).toBe(true);
    expect(canMarkVerified("http://example.edu/source")).toBe(false);
    expect(canMarkVerified("javascript:alert(1)")).toBe(false);
    expect(canMarkVerified(null)).toBe(false);
  });

});
