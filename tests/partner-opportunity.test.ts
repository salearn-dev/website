import { describe, expect, test } from "bun:test";
import {
  authorizePartnerKey,
  constantTimeEqual,
  isSamePartnerSubmission,
  MAX_PARTNER_BODY_BYTES,
  parsePartnerOpportunityBody,
  partnerOpportunitySlug,
} from "../src/lib/partner-opportunity";

const validPayload = {
  title: "Graduate learnership",
  source_url: "https://example.org/opportunities/graduate-learnership",
  provider: "Example Provider",
  paid: "yes",
};

describe("partner API authentication", () => {
  test("accepts the exact configured key", () => {
    expect(authorizePartnerKey("correct-key", "correct-key")).toEqual({ ok: true });
  });

  test("rejects missing, incorrect and differently sized keys", () => {
    expect(authorizePartnerKey(null, "correct-key").status).toBe(401);
    expect(authorizePartnerKey("wrong-key", "correct-key").status).toBe(401);
    expect(authorizePartnerKey("correct-key-extra", "correct-key").status).toBe(401);
    expect(constantTimeEqual("same", "same")).toBe(true);
    expect(constantTimeEqual("same", "different")).toBe(false);
  });

  test("fails closed when the deployment secret is absent", () => {
    expect(authorizePartnerKey("anything", undefined).status).toBe(503);
  });
});

describe("partner opportunity payload validation", () => {
  test("accepts a constrained HTTPS submission", () => {
    const result = parsePartnerOpportunityBody(JSON.stringify(validPayload));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.title).toBe(validPayload.title);
  });

  test("rejects malformed JSON, unknown fields and insecure source URLs", () => {
    expect(parsePartnerOpportunityBody("{").status).toBe(400);
    expect(parsePartnerOpportunityBody(JSON.stringify({ ...validPayload, unexpected: true })).status).toBe(400);
    expect(parsePartnerOpportunityBody(JSON.stringify({ ...validPayload, source_url: "http://example.org" })).status).toBe(400);
  });

  test("rejects missing required fields and invalid enum values", () => {
    expect(parsePartnerOpportunityBody(JSON.stringify({ source_url: validPayload.source_url })).status).toBe(400);
    expect(parsePartnerOpportunityBody(JSON.stringify({ ...validPayload, paid: "sometimes" })).status).toBe(400);
  });

  test("rejects request bodies above the byte limit", () => {
    const body = JSON.stringify({ ...validPayload, description: "x".repeat(MAX_PARTNER_BODY_BYTES) });
    expect(parsePartnerOpportunityBody(body).status).toBe(413);
  });
});


describe("partner opportunity identity", () => {
  test("creates a stable retry-safe slug", () => {
    const first = partnerOpportunitySlug(validPayload);
    expect(first).toBe(partnerOpportunitySlug(validPayload));
    expect(first.length).toBeLessThanOrEqual(80);
  });

  test("separates otherwise identical listings from different source URLs", () => {
    expect(partnerOpportunitySlug(validPayload)).not.toBe(
      partnerOpportunitySlug({
        ...validPayload,
        source_url: "https://example.org/opportunities/a-different-listing",
      }),
    );
  });

  test("only treats the same title and source as an idempotent retry", () => {
    expect(
      isSamePartnerSubmission(
        { title: validPayload.title, source_url: validPayload.source_url },
        validPayload,
      ),
    ).toBe(true);
    expect(
      isSamePartnerSubmission(
        { title: "Different opportunity", source_url: validPayload.source_url },
        validPayload,
      ),
    ).toBe(false);
  });
});
