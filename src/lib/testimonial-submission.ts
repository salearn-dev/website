export type TestimonialDraft = {
  displayName: string;
  province: string;
  quote: string;
  consent: boolean;
};

export function prepareTestimonialSubmission(draft: TestimonialDraft) {
  const learnerName = draft.displayName.trim();
  const province = draft.province.trim();
  const quote = draft.quote.trim();

  if (!draft.consent || learnerName.length === 0 || quote.length < 20) {
    return {
      ok: false as const,
      error: "Add a display name, write at least 20 characters, and confirm consent.",
    };
  }

  return {
    ok: true as const,
    data: {
      learner_name: learnerName.slice(0, 80),
      province: province ? province.slice(0, 80) : null,
      quote: quote.slice(0, 700),
      role_or_school: "Learner submission",
      consent_to_publish: true,
      approved: false as const,
    },
  };
}
