import { describe, expect, test } from "bun:test";
import { escapePdfText, makePdfBlob } from "@/lib/match-report";

describe("match report PDF", () => {
  test("escapes PDF control characters", () => {
    expect(escapePdfText(String.raw`Path\name (draft)`)).toBe(
      String.raw`Path\\name \(draft\)`,
    );
  });

  test("creates a complete PDF document with the expected MIME type", async () => {
    const blob = makePdfBlob("SA Learn Match Report\nEstimated APS: 31");
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const pdf = new TextDecoder().decode(bytes);

    expect(blob.type).toBe("application/pdf");
    expect(pdf.startsWith("%PDF-1.4")).toBe(true);
    expect(pdf).toContain("SA Learn Match Report");
    expect(pdf).toContain("xref");
    expect(pdf.endsWith("%%EOF")).toBe(true);
  });

  test("uses byte offsets for non-ASCII learner content", async () => {
    const blob = makePdfBlob("Qualification: isiZulu – NQF 6");
    const pdf = new TextDecoder().decode(await blob.arrayBuffer());
    const xrefOffset = Number(pdf.match(/startxref\n(\d+)/)?.[1]);
    const encodedPrefix = new TextEncoder().encode(pdf.slice(0, pdf.indexOf("xref"))).length;

    expect(xrefOffset).toBe(encodedPrefix);
  });

  test("wraps long report lines into multiple PDF text operations", async () => {
    const blob = makePdfBlob("word ".repeat(40));
    const pdf = new TextDecoder().decode(await blob.arrayBuffer());
    const operations = pdf.match(/\) Tj/g) ?? [];

    expect(operations.length).toBeGreaterThan(1);
  });
});
