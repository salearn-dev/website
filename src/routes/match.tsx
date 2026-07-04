import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Compass } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/match")({
  head: () => ({
    meta: [
      { title: "Match - SA Learn" },
      { name: "description", content: "Enter your subjects and marks to see what you qualify for, and what to do if you almost qualify." },
    ],
  }),
  component: MatchPage,
});

type Subject = { name: string; mark: number };

const SUBJECT_OPTIONS = [
  "Mathematics", "Mathematical Literacy", "English HL", "English FAL",
  "Physical Sciences", "Life Sciences", "Accounting", "Geography",
  "History", "Business Studies", "Life Orientation",
];

function apsPoints(mark: number) {
  if (mark >= 80) return 7;
  if (mark >= 70) return 6;
  if (mark >= 60) return 5;
  if (mark >= 50) return 4;
  if (mark >= 40) return 3;
  if (mark >= 30) return 2;
  return 1;
}

function MatchPage() {
  const [step, setStep] = useState(1);
  const [subjects, setSubjects] = useState<Subject[]>([
    { name: "Mathematics", mark: 62 },
    { name: "English HL", mark: 71 },
    { name: "Life Sciences", mark: 58 },
    { name: "Physical Sciences", mark: 55 },
    { name: "Life Orientation", mark: 68 },
    { name: "Geography", mark: 64 },
  ]);
  const [interest, setInterest] = useState<string>("Health");

  const aps = useMemo(
    () =>
      subjects
        .filter((s) => s.name !== "Life Orientation")
        .slice(0, 6)
        .reduce((sum, s) => sum + apsPoints(s.mark), 0),
    [subjects],
  );

  return (
    <PageShell
      eyebrow="What do I qualify for?"
      title="Check your options"
      description="A calm, four-step check based on your matric subjects and interests. No account needed."
    >
      {/* Stepper */}
      <ol className="mb-8 flex flex-wrap gap-2 text-xs">
        {["Subjects", "Marks", "Interests", "Results"].map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <li key={label} className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${active ? "bg-primary text-primary-foreground" : done ? "bg-muted text-foreground" : "bg-muted/50 text-muted-foreground"}`}>
              <span className="grid h-5 w-5 place-items-center rounded-full bg-background/20 text-[10px] font-semibold">{n}</span>
              {label}
            </li>
          );
        })}
      </ol>

      <div className="rounded-3xl border border-border bg-card p-6 md:p-10">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Step 1 - Pick your subjects</h2>
            <p className="mt-1 text-sm text-muted-foreground">Add or remove the subjects that appear on your report.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SUBJECT_OPTIONS.map((s) => {
                const on = subjects.some((x) => x.name === s);
                return (
                  <button
                    key={s}
                    onClick={() =>
                      setSubjects((prev) =>
                        on ? prev.filter((x) => x.name !== s) : [...prev, { name: s, mark: 50 }],
                      )
                    }
                    className={`rounded-full border px-4 py-2 text-sm ${on ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground hover:bg-muted"}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Step 2 - Enter your marks</h2>
            <p className="mt-1 text-sm text-muted-foreground">Type the percentage for each subject.</p>
            <div className="mt-6 divide-y divide-border rounded-xl border border-border">
              {subjects.map((s, i) => (
                <div key={s.name} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-medium text-foreground">{s.name}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={s.mark}
                      onChange={(e) => {
                        const v = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                        setSubjects((prev) => prev.map((x, j) => (j === i ? { ...x, mark: v } : x)));
                      }}
                      className="h-10 w-20 rounded-md border border-input bg-background px-3 text-right text-sm"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Estimated APS (best 6, excluding LO)</span>
              <span className="text-lg font-semibold text-foreground">{aps}</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Step 3 - Choose an interest</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pick the field that interests you most. You can change this later.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {["Health", "Technology", "Business", "Engineering", "Education", "Creative"].map((f) => (
                <button
                  key={f}
                  onClick={() => setInterest(f)}
                  className={`rounded-2xl border p-5 text-left transition-all ${interest === f ? "border-foreground/40 bg-muted/60" : "border-border bg-background hover:border-foreground/20"}`}
                >
                  <p className="text-base font-medium text-foreground">{f}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Careers, courses and skills related to {f.toLowerCase()}.</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && <Results aps={aps} interest={interest} />}

        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setStep(1)}
              className="inline-flex h-10 items-center rounded-md border border-input bg-background px-5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Start over
            </button>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function Results({ aps, interest }: { aps: number; interest: string }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Your results</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Based on an APS of <span className="font-medium text-foreground">{aps}</span> and interest in <span className="font-medium text-foreground">{interest}</span>.
        </p>
      </div>

      <Group tone="success" icon={CheckCircle2} title="You qualify">
        <ResultCard
          title="Higher Certificate in Information Technology"
          institution="Walter Sisulu University"
          note="Meets minimum APS and English requirement."
        />
        <ResultCard
          title="Diploma in Information Technology"
          institution="False Bay TVET College"
          note="Meets subject and APS requirements."
        />
      </Group>

      <Group tone="warning" icon={AlertTriangle} title="Almost qualify">
        <ResultCard
          title="Diploma in Nursing"
          institution="University of Limpopo"
          note="Life Sciences minimum is 60%. Your mark: 58%."
          action="Consider rewriting Life Sciences, a bridging programme, or related health programmes."
        />
      </Group>

      <Group tone="danger" icon={XCircle} title="Do not qualify yet">
        <ResultCard
          title="BSc Engineering (Civil)"
          institution="University of Cape Town"
          note="Mathematics requirement is 70%+. Your mark falls short."
          action="Bridging year or Higher Certificate in Engineering as an entry route."
        />
      </Group>

      <Group tone="growth" icon={Compass} title="Alternative pathways">
        <ResultCard
          title="Learnership: Health Promotion"
          institution="HWSETA partner"
          note="No APS required. Earn a stipend while training."
        />
        <ResultCard
          title="Short Course: Community Health Worker"
          institution="Online / accredited providers"
          note="4–8 weeks, entry-level pathway into healthcare."
        />
      </Group>
    </div>
  );
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
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${map[tone]}`}>
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-2">{children}</div>
    </section>
  );
}

function ResultCard({ title, institution, note, action }: { title: string; institution: string; note: string; action?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <p className="text-xs text-muted-foreground">{institution}</p>
      <h4 className="mt-1 text-base font-semibold text-foreground">{title}</h4>
      <p className="mt-3 text-sm text-muted-foreground">{note}</p>
      {action && (
        <p className="mt-3 rounded-md bg-muted/60 p-3 text-sm text-foreground">
          <span className="font-medium">What you can do: </span>{action}
        </p>
      )}
    </div>
  );
}
