import { describe, expect, test } from "bun:test";
import { buildGuideSchemas, getGuideDetail } from "@/lib/guide-detail";

describe("guide detail", () => {
  test("resolves guide content and only its related glossary terms", () => {
    const detail = getGuideDetail("aps-explained");

    expect(detail).not.toBeNull();
    expect(detail?.guide.keyPoints.length).toBeGreaterThan(0);
    expect(detail?.guide.steps?.length).toBeGreaterThan(0);
    expect(detail?.glossary.map((item) => item.term)).toEqual([
      "APS",
      "Diploma",
      "Degree",
      "Higher Certificate",
    ]);
  });

  test("returns null for an unknown guide", () => {
    expect(getGuideDetail("not-a-guide")).toBeNull();
    expect(buildGuideSchemas("not-a-guide")).toBeNull();
  });

  test("builds ordered HowTo steps for procedural guides", () => {
    const schemas = buildGuideSchemas("aps-explained");

    expect(schemas?.article["@type"]).toBe("Article");
    expect(schemas?.howTo?.["@type"]).toBe("HowTo");
    expect(schemas?.howTo?.step[0]).toMatchObject({
      "@type": "HowToStep",
      position: 1,
      text: "Write down your subjects and percentages.",
    });
  });

  test("omits HowTo schema for non-procedural guides", () => {
    expect(buildGuideSchemas("nqf-explained")?.howTo).toBeNull();
  });
});
