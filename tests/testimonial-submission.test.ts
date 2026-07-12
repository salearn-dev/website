import { describe, expect, test } from "bun:test";
import { prepareTestimonialSubmission } from "@/lib/testimonial-submission";

describe("testimonial submission policy", () => {
  test("requires a name, meaningful quote and explicit consent", () => {
    expect(prepareTestimonialSubmission({
      displayName: "",
      province: "",
      quote: "Too short",
      consent: false,
    })).toEqual({
      ok: false,
      error: "Add a display name, write at least 20 characters, and confirm consent.",
    });
  });

  test("normalises an accepted submission into an unapproved moderation row", () => {
    const result = prepareTestimonialSubmission({
      displayName: "  Lerato  ",
      province: "  Gauteng  ",
      quote: "  SA Learn helped me compare safer study options.  ",
      consent: true,
    });

    expect(result).toEqual({
      ok: true,
      data: {
        learner_name: "Lerato",
        province: "Gauteng",
        quote: "SA Learn helped me compare safer study options.",
        role_or_school: "Learner submission",
        consent_to_publish: true,
        approved: false,
      },
    });
  });

  test("bounds every public free-text field", () => {
    const result = prepareTestimonialSubmission({
      displayName: "N".repeat(100),
      province: "P".repeat(100),
      quote: "Q".repeat(900),
      consent: true,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.learner_name).toHaveLength(80);
      expect(result.data.province).toHaveLength(80);
      expect(result.data.quote).toHaveLength(700);
      expect(result.data.approved).toBe(false);
    }
  });
});
