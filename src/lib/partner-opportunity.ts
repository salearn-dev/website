import { z } from "zod";

export const MAX_PARTNER_BODY_BYTES = 32 * 1024;

const optionalText = (max: number) => z.string().trim().max(max).optional();

export const partnerOpportunitySchema = z.object({
  title: z.string().trim().min(3).max(160),
  source_url: z.string().url().max(2048).refine((value) => value.startsWith("https://"), {
    message: "source_url must use HTTPS.",
  }),
  category: optionalText(80),
  sector: optionalText(80),
  type: optionalText(80),
  province: optionalText(80),
  provider: optionalText(160),
  closing_date: z.string().date().optional(),
  paid: z.enum(["yes", "no", "unknown"]).optional(),
  description: optionalText(4000),
  source_name: optionalText(160),
}).strict();

export type PartnerOpportunityPayload = z.infer<typeof partnerOpportunitySchema>;

export function constantTimeEqual(actual: string, expected: string) {
  const length = Math.max(actual.length, expected.length);
  let mismatch = actual.length ^ expected.length;
  for (let index = 0; index < length; index += 1) {
    mismatch |= (actual.charCodeAt(index) || 0) ^ (expected.charCodeAt(index) || 0);
  }
  return mismatch === 0;
}

export function authorizePartnerKey(actual: string | null, expected: string | undefined) {
  if (!expected) return { ok: false as const, status: 503, error: "Partner API is unavailable." };
  if (!actual || !constantTimeEqual(actual, expected)) {
    return { ok: false as const, status: 401, error: "Invalid partner credentials." };
  }
  return { ok: true as const };
}

export function parsePartnerOpportunityBody(rawBody: string) {
  if (new TextEncoder().encode(rawBody).byteLength > MAX_PARTNER_BODY_BYTES) {
    return { ok: false as const, status: 413, error: "Request body is too large." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return { ok: false as const, status: 400, error: "Invalid JSON body." };
  }

  const result = partnerOpportunitySchema.safeParse(parsed);
  if (!result.success) {
    return {
      ok: false as const,
      status: 400,
      error: "Request body failed validation.",
      fields: result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    };
  }

  return { ok: true as const, data: result.data };
}


function slugPart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36).padStart(7, "0").slice(0, 7);
}

export function partnerOpportunitySlug(payload: Pick<PartnerOpportunityPayload, "title" | "provider" | "source_name" | "source_url">) {
  const provider = payload.provider ?? payload.source_name ?? "partner";
  const base = slugPart(`${provider}-${payload.title}`).slice(0, 72) || "partner-opportunity";
  return `${base}-${stableHash(payload.source_url)}`;
}

export function isSamePartnerSubmission(
  existing: { source_url: string | null; title: string },
  payload: Pick<PartnerOpportunityPayload, "source_url" | "title">,
) {
  return existing.source_url === payload.source_url && existing.title === payload.title;
}
