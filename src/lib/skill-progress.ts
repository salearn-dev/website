export type SkillProgressChoice = "Started" | "Practising" | "Ready to show";

export function buildSkillProgress(totalSteps: number, choice: SkillProgressChoice) {
  const total = Number.isFinite(totalSteps) ? Math.max(1, Math.floor(totalSteps)) : 1;
  const completedSteps =
    choice === "Ready to show"
      ? total
      : choice === "Practising"
        ? Math.max(1, Math.ceil(total / 2))
        : 1;
  const status = choice === "Ready to show" ? "completed" : "in_progress";

  return { totalSteps: total, completedSteps, status };
}

export function progressLabelFromStatus(status: string) {
  if (status === "completed") return "Ready to show";
  if (status === "in_progress" || status === "practising") return "Practising";
  return "Started";
}

export function canDownloadSkillRecord(savedProgress: string | undefined) {
  return savedProgress?.startsWith("Ready to show") ?? false;
}
