import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Compass,
  Download,
  Save,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { calculateAps } from "@/lib/aps";
import { evaluateMatch, type MatchGroup, type MatchResult } from "@/lib/match-engine.functions";
import { buildSeoHead } from "@/lib/seo";
import { useI18n } from "@/lib/i18n";
import { buildQualificationGroups, type QualificationProfile } from "@/lib/qualification-match";
import { makePdfBlob } from "@/lib/match-report";

export const Route = createFileRoute("/match")({
  head: () =>
    buildSeoHead({
      title: "Match - SA Learn",
      description:
        "Enter your subjects and marks to see what you qualify for, and what to do if you almost qualify.",
      path: "/match",
      ogType: "website",
    }),
  component: MatchPage,
});

type Subject = { name: string; mark: number };
type LearnerPath = "subjects" | "qualification";
const SUBJECT_OPTIONS = [
  "Mathematics",
  "Mathematical Literacy",
  "English HL",
  "English FAL",
  "Physical Sciences",
  "Life Sciences",
  "Accounting",
  "Geography",
  "History",
  "Business Studies",
  "Life Orientation",
];

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const STEP_LABELS = ["Subjects", "Marks", "Interests", "Results"];
const QUALIFICATION_TYPES = ["Higher Certificate", "Diploma", "Degree", "Postgraduate", "Other"] as const;
const QUALIFICATION_FIELDS = ["Technology", "Business", "Health", "Engineering", "Education", "Creative", "Law", "General"];

function MatchPage() {
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [learnerPath, setLearnerPath] = useState<LearnerPath>("subjects");
  const [subjects, setSubjects] = useState<Subject[]>([
    { name: "Mathematics", mark: 62 },
    { name: "English HL", mark: 71 },
    { name: "Life Sciences", mark: 58 },
    { name: "Physical Sciences", mark: 55 },
    { name: "Life Orientation", mark: 68 },
    { name: "Geography", mark: 64 },
  ]);
  const [qualification, setQualification] = useState<QualificationProfile>({
    type: "Diploma",
    nqf: 6,
    field: "Business",
    title: "",
  });
  const [interest, setInterest] = useState<string>("Health");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [profileConsent, setProfileConsent] = useState(false);

  const aps = useMemo(() => calculateAps(subjects), [subjects]);

  const markFor = (name: string) => subjects.find((subject) => subject.name === name)?.mark;

  const activeStepLabels = learnerPath === "subjects" ? STEP_LABELS : ["Path", "Qualification", "Interests", "Results"];

  // Codex: Saved match profile
  // Status: Saves learner-owned subjects/marks or non-matric qualification profile after explicit consent.
  async function saveLearnerProfile() {
    if (!profileConsent) {
      setSaveState("error");
      setSaveMessage("Please consent before saving subjects and marks to your learner profile.");
      return;
    }

    setSaveState("saving");
    setSaveMessage("");

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const user = sessionData.session?.user;
      if (!user) {
        setSaveState("error");
        setSaveMessage("Sign in first, then return here to save your subjects and marks.");
        return;
      }

      const isSubjectPath = learnerPath === "subjects";
      const mathsMark = isSubjectPath ? (markFor("Mathematics") ?? markFor("Mathematical Literacy") ?? null) : null;
      const englishMark = isSubjectPath ? (markFor("English HL") ?? markFor("English FAL") ?? null) : null;
      const lifeSciencesMark = isSubjectPath ? (markFor("Life Sciences") ?? null) : null;
      const profileSubjects = isSubjectPath
        ? subjects
        : [
            {
              name: qualification.title.trim() || qualification.type,
              mark: qualification.nqf,
              qualificationType: qualification.type,
              nqf: qualification.nqf,
              field: qualification.field,
            },
          ];

      const { error } = await supabase.from("learner_details").upsert(
        {
          user_id: user.id,
          aps: isSubjectPath ? aps : null,
          subjects: profileSubjects as Json,
          maths_mark: mathsMark,
          english_mark: englishMark,
          life_sciences_mark: lifeSciencesMark,
          interests: [interest],
          preferred_study_mode: isSubjectPath ? "Matric subjects" : qualification.type,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      if (error) throw error;

      setSaveState("saved");
      setSaveMessage("Saved to your learner profile.");
    } catch {
      setSaveState("error");
      setSaveMessage("We could not save this profile yet. Please try again after refreshing.");
    }
  }

  return (
    <PageShell
      eyebrow={t("route.match.eyebrow")}
      title={t("route.match.title")}
      description={t("route.match.description")}
    >
      {/* 3.4 — Screen-reader live region: announces step changes and results without requiring navigation */}
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {step < 4
          ? `Step ${step} of 4: ${activeStepLabels[step - 1]}`
          : "Results loaded. Step 4 of 4: your match results are ready below."}
      </p>

      {/* Stepper */}
      <ol className="mb-8 flex flex-wrap gap-2 text-xs">
        {activeStepLabels.map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <li
              key={label}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${active ? "bg-primary text-primary-foreground" : done ? "bg-muted text-foreground" : "bg-muted/50 text-muted-foreground"}`}
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-background/20 text-[10px] font-semibold">
                {n}
              </span>
              {label}
            </li>
          );
        })}
      </ol>

      <div className="rounded-3xl border border-border bg-card p-6 md:p-10">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Step 1 - Choose your starting point
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Subjects and APS remain primary. If you already have a qualification, use the NQF path for career direction.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {[
                ["subjects", "Matric subjects", "Use subjects and marks to estimate APS and compare study options."],
                ["qualification", "I already have a qualification", "Use a degree, diploma, higher certificate or NQF level to explore career direction."],
              ].map(([value, title, description]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={learnerPath === value}
                  onClick={() => setLearnerPath(value as LearnerPath)}
                  className={`rounded-2xl border p-5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    learnerPath === value ? "border-foreground/40 bg-muted/60" : "border-border bg-background hover:border-foreground/20"
                  }`}
                >
                  <p className="text-base font-semibold text-foreground">{title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </button>
              ))}
            </div>
            {learnerPath === "subjects" && (
            <div className="mt-6 flex flex-wrap gap-2">
              {SUBJECT_OPTIONS.map((s) => {
                const on = subjects.some((x) => x.name === s);
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      setSubjects((prev) =>
                        on ? prev.filter((x) => x.name !== s) : [...prev, { name: s, mark: 50 }],
                      )
                    }
                    className={`rounded-full border px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${on ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground hover:bg-muted"}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {learnerPath === "subjects" ? "Step 2 - Enter your marks" : "Step 2 - Add your qualification"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {learnerPath === "subjects"
                ? "Type the percentage for each subject."
                : "Tell us the highest qualification or NQF level you already hold. SA Learn will use this for career direction, not APS admission matching."}
            </p>
            {learnerPath === "qualification" ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <MatchSelect
                  label="Qualification type"
                  value={qualification.type}
                  onChange={(value) =>
                    setQualification((current) => ({
                      ...current,
                      type: value as QualificationProfile["type"],
                    }))
                  }
                  options={[...QUALIFICATION_TYPES]}
                />
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-muted-foreground">NQF level</span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={qualification.nqf}
                    onChange={(event) =>
                      setQualification((current) => ({
                        ...current,
                        nqf: Math.max(1, Math.min(10, Number(event.target.value) || 1)),
                      }))
                    }
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
                <MatchSelect
                  label="Closest field"
                  value={qualification.field}
                  onChange={(field) => setQualification((current) => ({ ...current, field }))}
                  options={QUALIFICATION_FIELDS}
                />
                <label className="block text-sm">
                  <span className="mb-1.5 block font-medium text-muted-foreground">Qualification name</span>
                  <input
                    value={qualification.title}
                    onChange={(event) =>
                      setQualification((current) => ({ ...current, title: event.target.value }))
                    }
                    placeholder="Example: Diploma in Business Management"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
              </div>
            ) : (
              <>
                <div className="mt-6 divide-y divide-border rounded-xl border border-border">
                  {subjects.map((s, i) => (
                    <fieldset key={s.name} className="flex items-center justify-between px-4 py-3">
                      <legend className="text-sm font-medium text-foreground">{s.name}</legend>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={s.mark}
                          aria-label={`${s.name} mark (percentage)`}
                          aria-describedby={`${s.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-unit`}
                          onChange={(e) => {
                            const v = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                            setSubjects((prev) =>
                              prev.map((x, j) => (j === i ? { ...x, mark: v } : x)),
                            );
                          }}
                          className="h-10 w-20 rounded-md border border-input bg-background px-3 text-right text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        <span
                          id={`${s.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-unit`}
                          className="text-sm text-muted-foreground"
                        >
                          percent
                        </span>
                      </div>
                    </fieldset>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3 text-sm">
                  <span className="text-muted-foreground">Estimated APS (best 6, excluding LO)</span>
                  <span className="text-lg font-semibold text-foreground">{aps}</span>
                </div>
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Step 3 - Choose an interest
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick the field that interests you most. You can change this later.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {["Health", "Technology", "Business", "Engineering", "Education", "Creative"].map(
                (f) => (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={interest === f}
                    onClick={() => setInterest(f)}
                    className={`rounded-2xl border p-5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${interest === f ? "border-foreground/40 bg-muted/60" : "border-border bg-background hover:border-foreground/20"}`}
                  >
                    <p className="text-base font-medium text-foreground">{f}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Careers, courses and skills related to {f.toLowerCase()}.
                    </p>
                  </button>
                ),
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <Results
            aps={aps}
            interest={interest}
            subjects={subjects}
            learnerPath={learnerPath}
            qualification={qualification}
          />
        )}

        {step === 4 && (
          <div className="mt-8 rounded-2xl border border-border bg-background p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Save this learner profile
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Keep this match profile attached to your account for the next visit.
                </p>
                <label className="mt-3 flex max-w-2xl items-start gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={profileConsent}
                    onChange={(event) => setProfileConsent(event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-input"
                  />
                  <span>
                    I consent to SA Learn saving this profile to my protected learner record. This
                    is not an application submission.
                  </span>
                </label>
                {saveMessage && (
                  <p
                    className={`mt-2 text-sm ${saveState === "saved" ? "text-success" : "text-muted-foreground"}`}
                    aria-live="polite"
                  >
                    {saveMessage}{" "}
                    {saveState === "error" && (
                      <Link to="/account" className="font-medium text-foreground underline">
                        Open account
                      </Link>
                    )}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={saveLearnerProfile}
                disabled={saveState === "saving" || !profileConsent}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saveState === "saving" ? "Saving..." : "Save profile"}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex h-10 items-center rounded-md border border-input bg-background px-5 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Start over
            </button>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function MatchSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function Results({
  aps,
  interest,
  subjects,
  learnerPath,
  qualification,
}: {
  aps: number;
  interest: string;
  subjects: Subject[];
  learnerPath: LearnerPath;
  qualification: QualificationProfile;
}) {
  const [serverGroups, setServerGroups] = useState<MatchGroup[] | null>(null);
  const [engineVersion, setEngineVersion] = useState("client-fallback");
  const markFor = (name: string) => subjects.find((subject) => subject.name === name)?.mark;
  const mathsMark = markFor("Mathematics") ?? markFor("Mathematical Literacy") ?? 0;
  const englishMark = markFor("English HL") ?? markFor("English FAL") ?? 0;
  const lifeSciencesMark = markFor("Life Sciences") ?? 0;
  const fallbackGroups: Array<{
    title: string;
    tone: "success" | "warning" | "danger" | "growth";
    icon: React.ComponentType<{ className?: string }>;
    results: MatchResult[];
  }> = [
    {
      tone: "success",
      icon: CheckCircle2,
      title: "You qualify",
      results: [
        {
          title: "Higher Certificate in Information Technology",
          institution: "Walter Sisulu University",
          confidence: "Partial match",
          reason:
            "Your current marks appear to meet the estimated APS and English thresholds for this pathway.",
          requirementsMet: [
            `Estimated APS is ${aps}, above the planning minimum of 20.`,
            `English mark is ${englishMark}%, above the planning minimum of 50%.`,
          ],
          requirementsMissing: ["Official faculty requirements still need source verification."],
          additionalChecks: [
            "NBT status: Not flagged in this guidance route.",
            "Additional tests: No additional-test rule is known yet; confirm with the institution.",
          ],
          nextStep:
            "Confirm the current admission rules on the official institution page before applying.",
        },
        {
          title: "Diploma in Information Technology",
          institution: "False Bay TVET College",
          confidence: "Partial match",
          reason:
            "Your APS and Mathematics result fit the current estimated rule for this technical route.",
          requirementsMet: [
            `Estimated APS is ${aps}, above the planning minimum of 22.`,
            `Mathematics-related mark is ${mathsMark}%, above the planning minimum of 50%.`,
          ],
          requirementsMissing: ["Campus-specific intake and subject rules are not verified yet."],
          additionalChecks: [
            "NBT status: Usually not part of TVET intake, but this needs official confirmation.",
            "Additional tests: Placement or campus readiness checks may apply for some intakes.",
          ],
          nextStep:
            "Compare this with related ICT programmes and confirm the latest TVET intake dates.",
        },
      ],
    },
    {
      tone: "warning",
      icon: AlertTriangle,
      title: "Almost qualify",
      results: [
        {
          title: "Diploma in Nursing",
          institution: "University of Limpopo",
          confidence: "Needs confirmation",
          reason: "You are close, but one listed planning threshold is not met.",
          requirementsMet: [
            `Estimated APS is ${aps}, which may be competitive for some diploma routes.`,
          ],
          requirementsMissing: [
            `Life Sciences planning minimum is 60%; your mark is ${lifeSciencesMark}%.`,
          ],
          additionalChecks: [
            "NBT status: Health programmes may require additional selection steps; no verified NBT rule is stored yet.",
            "Additional tests: Selection, interview, health clearance or placement checks may apply.",
          ],
          nextStep:
            "Consider rewriting Life Sciences, checking bridging options, or comparing related health programmes.",
        },
      ],
    },
    {
      tone: "danger",
      icon: XCircle,
      title: "Do not qualify yet",
      results: [
        {
          title: "BSc Engineering (Civil)",
          institution: "University of Cape Town",
          confidence: "Needs confirmation",
          reason:
            "This path usually has higher Mathematics requirements than your current profile shows.",
          requirementsMet: [
            `Estimated APS is ${aps}; some engineering alternatives may still be worth checking.`,
          ],
          requirementsMissing: [
            `Mathematics planning minimum is 70%; your Mathematics-related mark is ${mathsMark}%.`,
          ],
          additionalChecks: [
            "NBT status: NBTs may be required or recommended for some university engineering routes.",
            "Additional tests: Faculty selection and placement requirements must be confirmed from the official source.",
          ],
          nextStep:
            "Look at a bridging year, a higher certificate route, or a related TVET engineering pathway.",
        },
      ],
    },
    {
      tone: "growth",
      icon: Compass,
      title: "Alternative pathways",
      results: [
        {
          title: "Learnership: Health Promotion",
          institution: "HWSETA partner",
          confidence: "Needs confirmation",
          reason:
            "This alternative is shown because learnership routes may rely less on APS and more on provider requirements.",
          requirementsMet: [
            "APS is not used in this alternative-path rule.",
            `Interest selected: ${interest}.`,
          ],
          requirementsMissing: [
            "Open provider, age, location, and closing-date requirements still need verification.",
          ],
          additionalChecks: [
            "NBT status: Not applicable in this learnership route.",
            "Additional tests: Provider screening, interviews or workplace checks may apply.",
          ],
          nextStep:
            "Check current HWSETA-linked listings and only apply through official provider links.",
        },
        {
          title: "Short Course: Community Health Worker",
          institution: "Online / accredited providers",
          confidence: "Needs confirmation",
          reason:
            "This is a lower-barrier skill route that may help you build evidence while comparing formal programmes.",
          requirementsMet: [
            `Interest selected: ${interest}.`,
            "Short courses can be useful while preparing stronger applications.",
          ],
          requirementsMissing: [
            "Provider accreditation and certificate value must be checked before paying.",
          ],
          additionalChecks: [
            "NBT status: Not applicable for most short-course routes.",
            "Additional tests: Provider onboarding or practical assessments may apply.",
          ],
          nextStep: "Choose only providers with visible registration or accreditation evidence.",
        },
      ],
    },
  ];
  const qualificationGroups = useMemo(
    () => buildQualificationGroups(qualification, interest),
    [qualification, interest],
  );
  const groups =
    learnerPath === "qualification"
      ? qualificationGroups.map((group) => ({ ...group, icon: iconForTone(group.tone) }))
      : serverGroups
        ? serverGroups.map((group) => ({ ...group, icon: iconForTone(group.tone) }))
        : fallbackGroups;

  useEffect(() => {
    if (learnerPath === "qualification") {
      setServerGroups(null);
      setEngineVersion("qualification-career-v1");
      return;
    }

    let alive = true;

    // Codex: Server-side match rules engine
    // Status: Routes match evaluation through a versioned server function with client fallback.
    evaluateMatch({ data: { aps, interest, subjects } })
      .then((result) => {
        if (!alive) return;
        setServerGroups(result.groups);
        setEngineVersion(result.engineVersion);
      })
      .catch(() => {
        if (!alive) return;
        setServerGroups(null);
        setEngineVersion("client-fallback");
      });

    return () => {
      alive = false;
    };
  }, [aps, interest, learnerPath, subjects]);

  function downloadReport() {
    const lines = [
      "SA Learn Match Report",
      "",
      learnerPath === "subjects"
        ? `Estimated APS: ${aps}`
        : `Qualification path: ${qualification.type}, NQF ${qualification.nqf}`,
      learnerPath === "qualification"
        ? `Qualification name: ${qualification.title || "Not specified"}`
        : `Subjects: ${subjects.map((subject) => `${subject.name} ${subject.mark}%`).join(", ")}`,
      `Selected interest: ${interest}`,
      "",
      "Important: This is an advisory report. Confirm requirements, deadlines, NBT rules, articulation rules and additional tests with official providers before applying.",
      "",
      ...groups.flatMap((group) => [
        group.title,
        ...group.results.flatMap((result) => [
          `- ${result.title} (${result.institution})`,
          `  Confidence: ${result.confidence}`,
          `  Why: ${result.reason}`,
          `  Met: ${result.requirementsMet.join("; ")}`,
          `  Missing/unverified: ${result.requirementsMissing.join("; ")}`,
          `  Additional checks: ${result.additionalChecks.join("; ")}`,
          `  Next step: ${result.nextStep}`,
          "",
        ]),
      ]),
    ];

    saveBlob(makePdfBlob(lines.join("\n")), "sa-learn-match-report.pdf");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Your results</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {learnerPath === "subjects" ? (
              <>
                Based on an APS of <span className="font-medium text-foreground">{aps}</span> and
                interest in <span className="font-medium text-foreground">{interest}</span>.
              </>
            ) : (
              <>
                Based on <span className="font-medium text-foreground">{qualification.type}</span>{" "}
                at NQF <span className="font-medium text-foreground">{qualification.nqf}</span> in{" "}
                <span className="font-medium text-foreground">{qualification.field}</span>.
              </>
            )}{" "}
            Engine:{" "}
            <span className="font-medium text-foreground">{engineVersion}</span>.
          </p>
        </div>
        <button
          onClick={downloadReport}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Download className="h-4 w-4" /> Download report
        </button>
      </div>

      {groups.map((group) => (
        <Group key={group.title} tone={group.tone} icon={group.icon} title={group.title}>
          {group.results.map((result) => (
            <ResultCard key={result.title} {...result} />
          ))}
        </Group>
      ))}
    </div>
  );
}

function iconForTone(tone: "success" | "warning" | "danger" | "growth") {
  return {
    success: CheckCircle2,
    warning: AlertTriangle,
    danger: XCircle,
    growth: Compass,
  }[tone];
}

function Group({
  title,
  tone,
  icon: Icon,
  children,
}: {
  title: string;
  tone: "success" | "warning" | "danger" | "growth";
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  const map = {
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning-foreground",
    danger: "bg-danger-soft text-danger",
    growth: "bg-growth-soft text-growth",
  } as const;
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${map[tone]}`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-2">{children}</div>
    </section>
  );
}

function ResultCard({
  title,
  institution,
  confidence,
  reason,
  requirementsMet,
  requirementsMissing,
  additionalChecks,
  nextStep,
}: {
  title: string;
  institution: string;
  confidence: "Verified match" | "Partial match" | "Needs confirmation" | "Data outdated";
  reason: string;
  requirementsMet: string[];
  requirementsMissing: string[];
  additionalChecks: string[];
  nextStep: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <p className="text-xs text-muted-foreground">{institution}</p>
      <h4 className="mt-1 text-base font-semibold text-foreground">{title}</h4>
      <span className="mt-3 inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
        {confidence}
      </span>
      <p className="mt-3 text-sm text-muted-foreground">{reason}</p>
      <div className="mt-4 grid gap-3 text-sm">
        <RequirementList title="Requirements met" items={requirementsMet} tone="success" />
        <RequirementList
          title="Still missing or unverified"
          items={requirementsMissing}
          tone="warning"
        />
        <RequirementList title="NBT / additional checks" items={additionalChecks} tone="warning" />
      </div>
      <p className="mt-3 rounded-md bg-muted/60 p-3 text-sm text-foreground">
        <span className="font-medium">Next step: </span>
        {nextStep}
      </p>
    </div>
  );
}

// Codex: Match result explanations
// Status: Client-side prototype explains why results appear; server-side versioned rules remain pending.
function RequirementList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "success" | "warning";
}) {
  const marker = tone === "success" ? "bg-success" : "bg-warning";

  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <ul className="mt-1 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-muted-foreground">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${marker}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
