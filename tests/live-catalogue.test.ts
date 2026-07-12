import { describe, expect, test } from "bun:test";
import {
  isPaidOpportunity,
  normaliseDeliveryMode,
} from "@/lib/live-catalogue";

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
});
