import { CAREERS, COURSES, SKILLS } from "./data";
import type { MatchGroup } from "./match-engine";

export type QualificationProfile = {
  type: "Higher Certificate" | "Diploma" | "Degree" | "Postgraduate" | "Other";
  nqf: number;
  field: string;
  title: string;
};

export function buildQualificationGroups(
  qualification: QualificationProfile,
  interest: string,
): MatchGroup[] {
  const safeNqf = Number.isFinite(qualification.nqf)
    ? Math.max(1, Math.min(10, qualification.nqf))
    : 1;
  const safeField = qualification.field.trim() || "General";
  const safeInterest = interest.trim() || "General";
  const field = safeField.toLowerCase();
  const type = qualification.type.toLowerCase();
  const matchedCareers = CAREERS.filter((career) => {
    const text =
      `${career.title} ${career.short} ${career.routes.join(" ")} ${career.skills.join(" ")} ${career.subjects.join(" ")}`.toLowerCase();
    return (
      text.includes(field) ||
      text.includes(safeInterest.toLowerCase()) ||
      career.routes.some((route) => route.toLowerCase().includes(type))
    );
  }).slice(0, 4);
  const careerPool = matchedCareers.length > 0 ? matchedCareers : CAREERS.slice(0, 4);
  const relatedCourseSlugs = new Set(careerPool.flatMap((career) => career.relatedCourseSlugs));
  const relatedSkillSlugs = new Set(careerPool.flatMap((career) => career.relatedSkillSlugs));
  const relatedCourses = COURSES.filter((course) => relatedCourseSlugs.has(course.slug)).slice(0, 4);
  const relatedSkills = SKILLS.filter((skill) => relatedSkillSlugs.has(skill.slug)).slice(0, 4);

  return [
    {
      tone: "growth",
      title: "Career directions",
      results: careerPool.map((career) => ({
        title: career.title,
        institution: "Career explorer",
        confidence: "Needs confirmation",
        reason: `${career.title} appears relevant to a ${qualification.type} / NQF ${safeNqf} profile in ${safeField}.`,
        requirementsMet: [
          `${qualification.type} captured at NQF ${safeNqf}.`,
          `Interest selected: ${safeInterest}.`,
          `Related route examples: ${career.routes.join(", ")}.`,
        ],
        requirementsMissing: [
          "Employer, professional-body, postgraduate and articulation requirements still need confirmation.",
        ],
        additionalChecks: [
          "Check whether your qualification is recognised by employers or professional bodies in this field.",
          "Confirm whether bridging, honours, PGCE, articles, trade test or vendor certification is required.",
        ],
        nextStep: `Open the ${career.title} career page and compare linked courses, skills and entry roles.`,
      })),
    },
    {
      tone: "success",
      title: "Study or upskilling options",
      results: [
        ...relatedCourses.map((course) => ({
          title: course.title,
          institution: course.institution,
          confidence: "Needs confirmation" as const,
          reason: `This course connects to careers that match your ${safeField} qualification path.`,
          requirementsMet: [
            `Course level: ${course.nqf ? `NQF ${course.nqf}` : "Not NQF-rated in current data"}.`,
            `Delivery: ${course.deliveryMode}; city: ${course.city}.`,
          ],
          requirementsMissing: [
            "Credit transfer, recognition of prior learning and current admission rules are not verified yet.",
          ],
          additionalChecks: [
            "Ask the provider about articulation from your current qualification.",
            "Confirm accreditation, cost and deadlines before paying or applying.",
          ],
          nextStep: `Review the ${course.title} course detail page and official source link.`,
        })),
        ...relatedSkills.map((skill) => ({
          title: skill.name,
          institution: "SA Learn skills",
          confidence: "Partial match" as const,
          reason: "This skill can help convert your qualification into visible job evidence.",
          requirementsMet: [`Track duration: ${skill.time}.`, `Difficulty: ${skill.diff}.`],
          requirementsMissing: ["This is not an accredited qualification or employer guarantee."],
          additionalChecks: [
            "Use projects or portfolio evidence alongside formal qualifications.",
            "Check whether employers in your target field request specific tools or certificates.",
          ],
          nextStep: `Open Skills and start the ${skill.name} track.`,
        })),
      ].slice(0, 6),
    },
  ];
}
