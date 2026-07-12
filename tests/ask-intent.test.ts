import { describe, expect, test } from "bun:test";
import { askTokens, detectAskIntent, hasAskQuerySignal } from "@/lib/ask-intent";

describe("Ask SA Learn intent routing", () => {
  test("routes personal eligibility questions to the rules-aware matcher", () => {
    expect(detectAskIntent("What do I qualify for?")).toBe("match");
    expect(detectAskIntent("Check my options with my marks")).toBe("match");
    expect(detectAskIntent("What can I do with my subjects?")).toBe("match");
    expect(detectAskIntent("My APS score is 28")).toBe("match");
  });

  test("keeps general qualification discovery in course search", () => {
    expect(detectAskIntent("NQF 6 technology courses")).toBe("courses");
    expect(detectAskIntent("What can I do with a diploma in business?")).toBe("careers");
    expect(detectAskIntent("Find online degree programmes")).toBe("courses");
  });

  test("prioritises funding and opportunity language", () => {
    expect(detectAskIntent("Find NSFAS funding for nursing")).toBe("funding");
    expect(detectAskIntent("Which learnership applications are open?")).toBe("opportunities");
  });

  test("removes stop words from deterministic ranking tokens", () => {
    expect(askTokens("What can I study with a diploma in business?")).toEqual([
      "study",
      "diploma",
      "business",
    ]);
  });

  test("treats blank and stop-word-only questions as no match signal", () => {
    expect(hasAskQuerySignal("")).toBe(false);
    expect(hasAskQuerySignal("what can I do")).toBe(false);
    expect(hasAskQuerySignal("funding")).toBe(true);
  });

});
