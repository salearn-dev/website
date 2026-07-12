import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TrustMetadata } from "@/components/trust-metadata";

describe("trust metadata", () => {
  test("links genuine external evidence", () => {
    const html = renderToStaticMarkup(createElement(TrustMetadata, {
      trust: {
        sourceName: "Official institution",
        sourceUrl: "https://example.edu/programme",
        lastVerifiedAt: "1 Jul 2026",
        verificationStatus: "Verified",
      },
    }));

    expect(html).toContain('href="https://example.edu/programme"');
    expect(html).toContain("Source: Official institution");
  });

  test("does not present SA Learn fallback as source evidence", () => {
    const html = renderToStaticMarkup(createElement(TrustMetadata, {
      trust: {
        sourceName: "Source unavailable",
        sourceUrl: "https://salearn.online",
        lastVerifiedAt: "Awaiting verification date",
        verificationStatus: "Needs confirmation",
      },
    }));

    expect(html).toContain("Source unavailable");
    expect(html).not.toContain('href="https://salearn.online"');
  });
});
