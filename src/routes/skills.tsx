import { createFileRoute } from "@tanstack/react-router";
import { Clock, Signal } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SKILLS } from "@/lib/data";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills - SA Learn" },
      { name: "description", content: "Job-ready skills you can start learning today - free and paid resources for programming, design, business and more." },
    ],
  }),
  component: SkillsPage,
});

function SkillsPage() {
  return (
    <PageShell
      eyebrow="What can I learn today?"
      title="Job-ready skills"
      description="Practical skills that make you employable - start now, mostly free, no matric required."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SKILLS.map((s) => (
          <article key={s.slug} className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">{s.name}</h3>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                <Signal className="h-3 w-3" /> {s.diff}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                <Clock className="h-3 w-3" /> {s.time}
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Careers: </span>{s.careers.join(", ")}
            </p>
            <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
              <button className="font-medium text-foreground hover:underline">Free resources</button>
              <button className="text-muted-foreground hover:text-foreground">Certificates</button>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
