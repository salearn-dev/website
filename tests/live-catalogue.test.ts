import { describe, expect, test } from "bun:test";
import {
  isPaidOpportunity,
  normaliseCatalogueTrust,
  normaliseDeliveryMode,
} from "@/lib/catalogue-normalization";

describe("live catalogue normalization", () => {
  test("maps canonical paid states correctly", () => {
    expect(isPaidOpportunity("yes")).toBe(true);
    expect(isPaidOpportunity(" paid ")).toBe(true);
    expect(isPaidOpportunity("true")).toBe(true);
    expect(isPaidOpportunity("no")).toBe(false);
    expect(isPaidOpportunity("unknown")).toBe(false);
    expect(isPaidOpportunity(null)).toBe(false);
  });

  test("accepts supported delivery modes", () => {
    expect(normaliseDeliveryMode("Contact")).toBe("Contact");
    expect(normaliseDeliveryMode("Online")).toBe("Online");
    expect(normaliseDeliveryMode("Blended")).toBe("Blended");
    expect(normaliseDeliveryMode("Workplace")).toBe("Workplace");
  });

  test("falls back safely for invalid delivery modes", () => {
    expect(normaliseDeliveryMode("Hybrid-ish")).toBe("Contact");
    expect(normaliseDeliveryMode(null)).toBe("Contact");
  });

  test("only keeps verified trust when source and date evidence are complete", () => {
    const verified = normaliseCatalogueTrust({
      source_name: "Official institution",
      source_url: "https://example.edu/programme",
      last_verified_at: "2026-07-01T00:00:00Z",
      verification_status: "verified",
    });
    expect(verified.verificationStatus).toBe("Verified");
    expect(verified.sourceName).toBe("Official institution");

    for (const incomplete of [
      { source_url: null, last_verified_at: "2026-07-01T00:00:00Z" },
      { source_url: "http://example.edu", last_verified_at: "2026-07-01T00:00:00Z" },
      { source_url: "https://example.edu", last_verified_at: null },
      { source_url: "https://example.edu", last_verified_at: "not-a-date" },
    ]) {
      expect(normaliseCatalogueTrust({
        source_name: null,
        verification_status: "verified",
        ...incomplete,
      }).verificationStatus).toBe("Needs confirmation");
    }
  });

});
