import { describe, expect, test } from "bun:test";
import { deadlineFeedStatusLabel, resolveDeadlineFeed, type DeadlineItem } from "@/lib/home-deadlines";

const fallback: DeadlineItem[] = [{
  title: "Curated bursary",
  deadline: "Confirm with source",
  source: "SA Learn",
  status: "Needs confirmation",
}];

describe("homepage deadline feed", () => {
  test("keeps the curated fallback when live queries return no rows", () => {
    expect(resolveDeadlineFeed(fallback, [], [])).toEqual({
      items: fallback,
      isLive: false,
    });
  });

  test("uses live rows and normalises missing optional fields", () => {
    const result = resolveDeadlineFeed(fallback, [{
      title: "Open learnership",
      closing_date: null,
      provider: "Official provider",
      source_name: null,
      source_url: "https://example.org/apply",
      verification_status: null,
    }], []);

    expect(result).toEqual({
      isLive: true,
      items: [{
        title: "Open learnership",
        deadline: "Confirm with source",
        source: "Official provider",
        status: "Provisional",
        href: "https://example.org/apply",
      }],
    });
  });

  test("does not replace usable fallback data after a failed query", () => {
    expect(resolveDeadlineFeed(fallback, null, null).items).toBe(fallback);
  });

  test("labels loading, live and fallback states without ambiguity", () => {
    expect(deadlineFeedStatusLabel("loading")).toBe("Checking live catalogue…");
    expect(deadlineFeedStatusLabel("live")).toBe("Live catalogue feed");
    expect(deadlineFeedStatusLabel("fallback")).toBe("Curated catalogue fallback");
  });

});
