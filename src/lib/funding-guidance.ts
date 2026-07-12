export function getFundingMatchReasons(
  slug: string,
  studyArea: string,
  fundingNeed: string,
  institutionType: string,
) {
  const reasons: string[] = [];

  if (slug === "nsfas") {
    if (institutionType === "Any" || institutionType.includes("Public")) {
      reasons.push("Fits public university or TVET study routes.");
    }
    if (fundingNeed === "Full funding" || fundingNeed === "Tuition help") {
      reasons.push("May cover tuition and allowances for eligible public study.");
    }
  }

  if (slug === "funza-lushaka") {
    if (studyArea === "Any" || studyArea === "Teaching") {
      reasons.push("Matches teaching-focused study plans.");
    }
    if (institutionType === "Any" || institutionType === "Public university") {
      reasons.push("Usually linked to approved teacher education routes.");
    }
  }

  if (slug === "sasol" || slug === "eskom") {
    if (studyArea === "Any" || studyArea === "Engineering" || studyArea === "Science") {
      reasons.push("Matches engineering or science-focused study interests.");
    }
    if (fundingNeed === "Full funding" || fundingNeed === "Tuition help") {
      reasons.push("May be worth checking for tuition-heavy STEM study costs.");
    }
  }

  if (slug === "seta-learnership") {
    if (studyArea === "Any" || studyArea === "Trades") {
      reasons.push("Matches learnership or practical workplace routes.");
    }
    if (fundingNeed === "Stipend / earn while learning" || institutionType === "Workplace route") {
      reasons.push("Useful when stipend or workplace learning matters.");
    }
  }

  if (slug === "employer") {
    if (institutionType === "Any" || institutionType === "Private provider") {
      reasons.push("May help when public funding is not the right fit.");
    }
    if (studyArea === "Any" || studyArea === "Business" || studyArea === "Engineering") {
      reasons.push("Employer funding can depend on field and company needs.");
    }
  }

  return reasons;
}

export function evaluateNsfasAnswers({
  citizenship,
  institutionType,
  householdIncome,
  qualification,
}: {
  citizenship: string;
  institutionType: string;
  householdIncome: string;
  qualification: string;
}) {
  const isCitizen = citizenship === "South African citizen";
  const isPublic =
    institutionType === "Public university" || institutionType === "Public TVET college";
  const incomeLikely =
    householdIncome === "Under R350,000" || householdIncome === "Disability band under R600,000";
  const isFundableLevel = qualification !== "Private provider course";

  if (isCitizen && isPublic && incomeLikely && isFundableLevel) {
    return {
      tone: "success" as const,
      title: "Likely worth checking NSFAS",
      body: "Your answers fit the broad public NSFAS pathway. This is not approval - confirm the current official rules and apply through NSFAS only.",
      checks: [
        "Public institution route selected.",
        "Income band appears within the planning NSFAS threshold.",
        "No information is saved by this eligibility guide.",
      ],
    };
  }

  return {
    tone: "warning" as const,
    title: "Needs careful confirmation",
    body: "One or more answers may fall outside the broad NSFAS route. You may still have other funding options, but confirm official NSFAS rules before deciding.",
    checks: [
      isCitizen
        ? "Citizenship answer does not block this initial check."
        : "NSFAS usually focuses on South African citizens.",
      isPublic
        ? "Institution type appears public."
        : "NSFAS usually funds public universities and TVET colleges.",
      incomeLikely
        ? "Income band may fit the broad threshold."
        : "Income band may be above the broad planning threshold.",
      isFundableLevel
        ? "Qualification answer may be fundable."
        : "Private provider routes usually need different funding checks.",
    ],
  };
}
