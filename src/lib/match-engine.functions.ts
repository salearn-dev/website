import { createServerFn } from "@tanstack/react-start";
import { buildMatchGroups, type MatchSubject } from "@/lib/match-engine";

export type { MatchGroup, MatchResult, MatchSubject } from "@/lib/match-engine";

export const evaluateMatch = createServerFn({ method: "POST" })
  .validator((data: { aps: number; interest: string; subjects: MatchSubject[] }) => data)
  .handler(async ({ data }) => ({
    engineVersion: "server-rules-v2-sourced",
    groups: buildMatchGroups(data),
  }));
