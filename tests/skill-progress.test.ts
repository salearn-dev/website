import { describe, expect, test } from "bun:test";
import {
  buildSkillProgress,
  canDownloadSkillRecord,
  progressLabelFromStatus,
} from "@/lib/skill-progress";

describe("skill progress contract", () => {
  test("maps learner choices to bounded persisted progress", () => {
    expect(buildSkillProgress(4, "Started")).toEqual({
      totalSteps: 4,
      completedSteps: 1,
      status: "in_progress",
    });
    expect(buildSkillProgress(4, "Practising")).toEqual({
      totalSteps: 4,
      completedSteps: 2,
      status: "in_progress",
    });
    expect(buildSkillProgress(4, "Ready to show")).toEqual({
      totalSteps: 4,
      completedSteps: 4,
      status: "completed",
    });
  });

  test("clamps invalid and single-step track lengths", () => {
    expect(buildSkillProgress(0, "Started")).toEqual({
      totalSteps: 1,
      completedSteps: 1,
      status: "in_progress",
    });
    expect(buildSkillProgress(Number.NaN, "Practising")).toEqual({
      totalSteps: 1,
      completedSteps: 1,
      status: "in_progress",
    });
  });

  test("uses stable learner-facing labels", () => {
    expect(progressLabelFromStatus("completed")).toBe("Ready to show");
    expect(progressLabelFromStatus("in_progress")).toBe("Practising");
    expect(progressLabelFromStatus("not_started")).toBe("Started");
  });

  test("only permits a completion record after completion", () => {
    expect(canDownloadSkillRecord(undefined)).toBe(false);
    expect(canDownloadSkillRecord("Started - 1/3 steps")).toBe(false);
    expect(canDownloadSkillRecord("Practising - 2/3 steps")).toBe(false);
    expect(canDownloadSkillRecord("Ready to show - 3/3 steps")).toBe(true);
  });
});
