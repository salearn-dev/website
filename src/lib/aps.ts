export type ApsSubject = { name: string; mark: number };

export function apsPoints(mark: number) {
  const safeMark = Number.isFinite(mark) ? Math.max(0, Math.min(100, mark)) : 0;
  if (safeMark >= 80) return 7;
  if (safeMark >= 70) return 6;
  if (safeMark >= 60) return 5;
  if (safeMark >= 50) return 4;
  if (safeMark >= 40) return 3;
  if (safeMark >= 30) return 2;
  return 1;
}

export function calculateAps(subjects: ApsSubject[]) {
  return subjects
    .filter((subject) => subject.name !== "Life Orientation")
    .map((subject, index) => ({ ...subject, index }))
    .sort((left, right) => apsPoints(right.mark) - apsPoints(left.mark) || left.index - right.index)
    .slice(0, 6)
    .reduce((sum, subject) => sum + apsPoints(subject.mark), 0);
}
