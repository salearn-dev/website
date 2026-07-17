export type AdmissionRule = {
  id: string;
  institution: string;
  faculty: string;
  programme: string;
  interests: string[];
  minimumAps?: number;
  subjects: Array<{ names: string[]; label: string; minimum: number; minimumByName?: Record<string, number> }>;
  tests: Array<{ name: string; required: boolean; note: string }>;
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string;
  intakeYear: number;
};

// Codex: Source-backed admission and additional-test rules
// Status: A deliberately small verified dataset; unmatched programmes remain clearly unverified.
export const ADMISSION_RULES: AdmissionRule[] = [
  {
    id: "uct-commerce-2026",
    institution: "University of Cape Town",
    faculty: "Commerce",
    programme: "Commerce undergraduate route",
    interests: ["Business", "Technology"],
    subjects: [
      { names: ["English HL", "English FAL"], label: "English", minimum: 60, minimumByName: { "English HL": 50, "English FAL": 60 } },
      { names: ["Mathematics"], label: "Mathematics", minimum: 60 },
    ],
    tests: [{ name: "NBT AQL", required: true, note: "Commerce applicants write the AQL test." }],
    sourceName: "UCT Commerce admissions",
    sourceUrl: "https://commerce.uct.ac.za/educommerce/admissions",
    verifiedAt: "2026-07-17",
    intakeYear: 2026,
  },
  {
    id: "up-biotechnology-2026",
    institution: "University of Pretoria",
    faculty: "Natural and Agricultural Sciences",
    programme: "BSc Biotechnology",
    interests: ["Health", "Science"],
    minimumAps: 32,
    subjects: [
      { names: ["English HL", "English FAL"], label: "English", minimum: 50 },
      { names: ["Mathematics"], label: "Mathematics", minimum: 50 },
      { names: ["Physical Sciences"], label: "Physical Sciences", minimum: 50 },
    ],
    tests: [{ name: "NBT", required: false, note: "The published 2026 programme rule does not list NBT as an admission requirement." }],
    sourceName: "University of Pretoria 2026 Yearbook",
    sourceUrl: "https://www.up.ac.za/yearbooks/2026/SCI-faculty/UD-programmes/view/02133403",
    verifiedAt: "2026-07-17",
    intakeYear: 2026,
  },
  {
    id: "wits-health-nbt-2027",
    institution: "University of the Witwatersrand",
    faculty: "Health Sciences",
    programme: "Health Sciences selection route",
    interests: ["Health"],
    subjects: [],
    tests: [{ name: "NBT AQL and MAT", required: true, note: "Venue-based NBT results are required for current matric applicants; basic-range scores are unsuccessful." }],
    sourceName: "Wits NBT standard operating procedure",
    sourceUrl: "https://www.wits.ac.za/media/wits-university/study/undergraduate/documents/2026%20for%202027%20WITS%20Standard%20Operating%20Procedures%20%28SOP%29%20for%20NBT%20results.pdf",
    verifiedAt: "2026-07-17",
    intakeYear: 2027,
  },
];

export function evaluateAdmissionRule(
  rule: AdmissionRule,
  aps: number,
  subjects: Array<{ name: string; mark: number }>,
) {
  const met: string[] = [];
  const missing: string[] = [];
  if (rule.minimumAps !== undefined) {
    (aps >= rule.minimumAps ? met : missing).push(`APS ${aps} (minimum ${rule.minimumAps})`);
  }
  for (const requirement of rule.subjects) {
    const marks = subjects.filter((subject) => requirement.names.includes(subject.name));
    const qualifying = marks.find((subject) => subject.mark >= (requirement.minimumByName?.[subject.name] ?? requirement.minimum));
    const best = Math.max(0, ...marks.map((subject) => subject.mark));
    const threshold = marks.length === 1
      ? (requirement.minimumByName?.[marks[0].name] ?? requirement.minimum)
      : requirement.minimum;
    (qualifying ? met : missing).push(`${requirement.label} ${best}% (minimum ${threshold}%)`);
  }
  return { met, missing, eligible: missing.length === 0 };
}
