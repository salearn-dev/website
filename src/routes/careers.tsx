import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { CAREERS } from "@/lib/data";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers - SA Learn" },
      { name: "description", content: "Explore careers and the study routes that get you there. Skills, subjects, salary and demand." },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  return (
    <PageShell
      eyebrow="Where does this lead?"
      title="Career pathways"
      description="Start from a career you want, and see the subjects, study routes and skills that get you there."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CAREERS.map((c) => (
          <article key={c.slug} className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{c.demand} demand</span>
              <span>·</span>
              <span>{c.salary}</span>
            </div>
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.short}</p>

            <div className="mt-5 space-y-3 text-sm">
              <Row label="Study routes" value={c.routes.join(", ")} />
              <Row label="Helpful subjects" value={c.subjects.join(", ")} />
              <Row label="Skills" value={c.skills.join(", ")} />
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Pathway</p>
              <ol className="space-y-2 text-sm text-foreground">
                <Step>Matric</Step>
                <Step>Higher Certificate / Diploma / Degree</Step>
                <Step>Internship / Junior role</Step>
                <Step>Professional growth</Step>
              </ol>
            </div>

            <button className="mt-6 inline-flex items-center gap-1 self-start text-sm font-medium text-foreground hover:underline">
              View path <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-foreground">{value}</p>
    </div>
  );
}

function Step({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3">
      <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
      <span>{children}</span>
    </li>
  );
}
