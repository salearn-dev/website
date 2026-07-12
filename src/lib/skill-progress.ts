export type SkillProgressChoice = "Started" | "Practising" | "Ready to show";

export function buildSkillProgress(totalSteps: number, choice: SkillProgressChoice) {
  const total = Math.max(1, Math.floor(totalSteps));
  const completedSteps =
    choice === "Ready to show"
      ? total
      : choice === "Practising"
        ? Math.max(1, total - 1)
        : 1;
  const status =
    choice === "Ready to show"
      ? "completed"
      : choice === "Practising"
        ? "practising"
        : "started";

  return { totalSteps: total, completedSteps, status };
}

export function progressLabelFromStatus(status: string) {
  if (status === "completed") return "Ready to show";
  if (status === "practising") return "Practising";
  return "Started";
}

export function canDownloadSkillRecord(savedProgress: string | undefined) {
  return savedProgress?.startsWith("Ready to show") ?? false;
}
