import { ADMISSION_RULES, evaluateAdmissionRule } from "./admission-rules";

export type MatchSubject = { name: string; mark: number };
export type MatchResult = {
  title: string;
  institution: string;
  confidence: "Verified match" | "Partial match" | "Needs confirmation" | "Data outdated";
  reason: string;
  requirementsMet: string[];
  requirementsMissing: string[];
  additionalChecks: string[];
  nextStep: string;
};
export type MatchGroup = {
  title: string;
  tone: "success" | "warning" | "danger" | "growth";
  results: MatchResult[];
};

export function markFor(subjects: MatchSubject[], ...names: string[]) {
  for (const name of names) {
    const mark = subjects.find((subject) => subject.name === name)?.mark;
    if (typeof mark === "number" && Number.isFinite(mark)) return Math.max(0, Math.min(100, mark));
  }
  return 0;
}

export function buildMatchGroups({
  aps,
  interest,
  subjects,
}: {
  aps: number;
  interest: string;
  subjects: MatchSubject[];
}): MatchGroup[] {
  const safeAps = Number.isFinite(aps) ? Math.max(0, aps) : 0;
  const safeInterest = interest.trim() || "General";
  const mathsMark = markFor(subjects, "Mathematics", "Mathematical Literacy");
  const englishMark = markFor(subjects, "English HL", "English FAL");
  const lifeSciencesMark = markFor(subjects, "Life Sciences");

  const groups: MatchGroup[] = [
    {
      tone: "success",
      title: "You qualify",
      results: [
        {
          title: "Higher Certificate in Information Technology",
          institution: "Walter Sisulu University",
          confidence: "Partial match",
          reason: "Your marks meet the current estimated APS and English thresholds for this pathway.",
          requirementsMet: [
            `Estimated APS is ${safeAps}, above the planning minimum of 20.`,
            `English mark is ${englishMark}%, above the planning minimum of 50%.`,
          ],
          requirementsMissing: ["Official faculty requirements still need source verification."],
          additionalChecks: [
            "NBT status: Not flagged in this guidance route.",
            "Additional tests: No additional-test rule is known yet; confirm with the institution.",
          ],
          nextStep: "Confirm the current admission rules on the official institution page before applying.",
        },
        {
          title: "Diploma in Information Technology",
          institution: "False Bay TVET College",
          confidence: "Partial match",
          reason: "Your APS and Mathematics result fit the current estimated rule for this technical route.",
          requirementsMet: [
            `Estimated APS is ${safeAps}, above the planning minimum of 22.`,
            `Mathematics-related mark is ${mathsMark}%, above the planning minimum of 50%.`,
          ],
          requirementsMissing: ["Campus-specific intake and subject rules are not verified yet."],
          additionalChecks: [
            "NBT status: Usually not part of TVET intake, but this needs official confirmation.",
            "Additional tests: Placement or campus readiness checks may apply for some intakes.",
          ],
          nextStep: "Compare this with related ICT programmes and confirm the latest TVET intake dates.",
        },
      ],
    },
    {
      tone: "warning",
      title: "Almost qualify",
      results: [{
        title: "Diploma in Nursing",
        institution: "University of Limpopo",
        confidence: "Needs confirmation",
        reason: "You are close, but one listed planning threshold is not met.",
        requirementsMet: [`Estimated APS is ${safeAps}, which may be competitive for some diploma routes.`],
        requirementsMissing: [`Life Sciences planning minimum is 60%; your mark is ${lifeSciencesMark}%.`],
        additionalChecks: [
          "NBT status: Health programmes may require additional selection steps; no verified NBT rule is stored yet.",
          "Additional tests: Selection, interview, health clearance or placement checks may apply.",
        ],
        nextStep: "Consider rewriting Life Sciences, checking bridging options, or comparing related health programmes.",
      }],
    },
    {
      tone: "danger",
      title: "Do not qualify yet",
      results: [{
        title: "BSc Engineering (Civil)",
        institution: "University of Cape Town",
        confidence: "Needs confirmation",
        reason: "This path usually has higher Mathematics requirements than your current profile shows.",
        requirementsMet: [`Estimated APS is ${safeAps}; some engineering alternatives may still be worth checking.`],
        requirementsMissing: [`Mathematics planning minimum is 70%; your Mathematics-related mark is ${mathsMark}%.`],
        additionalChecks: [
          "NBT status: NBTs may be required or recommended for some university engineering routes.",
          "Additional tests: Faculty selection and placement requirements must be confirmed from the official source.",
        ],
        nextStep: "Look at a bridging year, a higher certificate route, or a related TVET engineering pathway.",
      }],
    },
    {
      tone: "growth",
      title: "Alternative pathways",
      results: [
        {
          title: "Learnership: Health Promotion",
          institution: "HWSETA partner",
          confidence: "Needs confirmation",
          reason: "This alternative is shown because learnership routes may rely less on APS and more on provider requirements.",
          requirementsMet: ["APS is not used in this alternative-path rule.", `Interest selected: ${safeInterest}.`],
          requirementsMissing: ["Open provider, age, location, and closing-date requirements still need verification."],
          additionalChecks: [
            "NBT status: Not applicable in this learnership route.",
            "Additional tests: Provider screening, interviews or workplace checks may apply.",
          ],
          nextStep: "Check current HWSETA-linked listings and only apply through official provider links.",
        },
        {
          title: "Short Course: Community Health Worker",
          institution: "Online / accredited providers",
          confidence: "Needs confirmation",
          reason: "This is a lower-barrier skill route that may help you build evidence while comparing formal programmes.",
          requirementsMet: [
            `Interest selected: ${safeInterest}.`,
            "Short courses can be useful while preparing stronger applications.",
          ],
          requirementsMissing: ["Provider accreditation and certificate value must be checked before paying."],
          additionalChecks: [
            "NBT status: Not applicable for most short-course routes.",
            "Additional tests: Provider onboarding or practical assessments may apply.",
          ],
          nextStep: "Choose only providers with visible registration or accreditation evidence.",
        },
      ],
    },
  ];

  for (const rule of ADMISSION_RULES.filter((item) => item.interests.includes(safeInterest))) {
    const evaluation = evaluateAdmissionRule(rule, safeAps, subjects);
    if (evaluation.met.length === 0 && evaluation.missing.length === 0) {
      evaluation.met.push(`Interest selected: ${safeInterest}.`);
    }
    const target = evaluation.eligible ? groups[0] : groups[1];
    target.results.unshift({
      title: rule.programme,
      institution: rule.institution,
      confidence: "Verified match",
      reason: `Compared with the published ${rule.intakeYear} ${rule.faculty} rule, verified ${rule.verifiedAt}.`,
      requirementsMet: evaluation.met,
      requirementsMissing: evaluation.missing,
      additionalChecks: rule.tests.map(
        (test) =>
          `${test.name}: ${test.required ? "Required" : "Not listed as required"}. ${test.note}`,
      ),
      nextStep: `Recheck the current rule at ${rule.sourceName} before applying: ${rule.sourceUrl}`,
    });
  }

  return groups;
}
