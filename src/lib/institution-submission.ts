export type InstitutionDraft = {
  name: string;
  type: string;
  province: string;
  website: string;
  accreditationStatus: string;
  sourceUrl: string;
};

function optionalHttps(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return { ok: true as const, value: null };
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") throw new Error("HTTPS required");
    return { ok: true as const, value: url.toString() };
  } catch {
    return { ok: false as const };
  }
}

export function slugifyInstitution(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function prepareInstitutionSubmission(draft: InstitutionDraft) {
  const name = draft.name.trim().slice(0, 160);
  const slug = slugifyInstitution(name);
  if (!slug) {
    return { ok: false as const, error: "Institution name is required." };
  }

  const website = optionalHttps(draft.website);
  const sourceUrl = optionalHttps(draft.sourceUrl || draft.website);
  if (!website.ok || !sourceUrl.ok) {
    return { ok: false as const, error: "Website and source links must use HTTPS." };
  }
  if (!sourceUrl.value) {
    return { ok: false as const, error: "An official source URL is required." };
  }

  return {
    ok: true as const,
    data: {
      slug,
      name,
      type: draft.type.trim().slice(0, 80) || null,
      province: draft.province.trim().slice(0, 80) || null,
      website: website.value,
      accreditation_status: draft.accreditationStatus.trim().slice(0, 240) || null,
      source_url: sourceUrl.value,
      source_name: name,
      verification_status: "provisional" as const,
      moderation_state: "submitted" as const,
    },
  };
}
