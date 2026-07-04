import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { GUIDES } from "@/lib/data";

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: "Guides — SA Learn" },
      { name: "description", content: "Confusing education terms — APS, NQF, SAQA, NSFAS — explained in plain English." },
    ],
  }),
  component: GuidesPage,
});

function GuidesPage() {
  return (
    <PageShell
      eyebrow="Understand the system"
      title="Plain-English guides"
      description="Every confusing acronym, process and decision — explained simply. No jargon, no fluff."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => (
          <article key={g.slug} className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">{g.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{g.summary}</p>
            <button className="mt-5 inline-flex items-center gap-1 self-start text-sm font-medium text-foreground group-hover:underline">
              Read guide <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
