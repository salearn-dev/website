import { describe, expect, test } from "bun:test";
import {
  prepareInstitutionSubmission,
  slugifyInstitution,
} from "@/lib/institution-submission";

describe("institution submission contract", () => {
  test("creates a provisional submitted moderation row", () => {
    const result = prepareInstitutionSubmission({
      name: "  Example College  ",
      type: "TVET College",
      province: "Gauteng",
      website: "https://example.edu/",
      accreditationStatus: "Submitted for confirmation",
      sourceUrl: "https://example.edu/about",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        slug: "example-college",
        name: "Example College",
        type: "TVET College",
        province: "Gauteng",
        website: "https://example.edu/",
        accreditation_status: "Submitted for confirmation",
        source_url: "https://example.edu/about",
        source_name: "Example College",
        verification_status: "provisional",
        moderation_state: "submitted",
      },
    });
  });

  test("requires a usable institution name and official source", () => {
    expect(prepareInstitutionSubmission({
      name: "",
      type: "",
      province: "",
      website: "",
      accreditationStatus: "",
      sourceUrl: "",
    }).ok).toBe(false);
  });

  test("rejects non-HTTPS website and source links", () => {
    expect(prepareInstitutionSubmission({
      name: "Example",
      type: "College",
      province: "",
      website: "http://example.edu",
      accreditationStatus: "",
      sourceUrl: "https://example.edu/source",
    }).ok).toBe(false);
    expect(prepareInstitutionSubmission({
      name: "Example",
      type: "College",
      province: "",
      website: "",
      accreditationStatus: "",
      sourceUrl: "javascript:alert(1)",
    }).ok).toBe(false);
  });

  test("bounds generated slugs", () => {
    expect(slugifyInstitution("A".repeat(200))).toHaveLength(80);
  });
});
