import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { FUNDING } from "@/lib/data";

export const Route = createFileRoute("/funding")({
  head: () => ({
    meta: [
      { title: "Funding — SA Learn" },
      { name: "description", content: "NSFAS, bursaries, scholarships and learnership funding — eligibility, coverage and deadlines in one place." },
    ],
  }),
  component: FundingPage,
});

function FundingPage() {
  return (
    <PageShell
      eyebrow="How will I pay?"
      title="Funding your studies"
      description="Clear, calm information about NSFAS, bursaries, scholarships and learnership funding — so cost is never the reason you don't apply."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {FUNDING.map((f) => (
          <article key={f.slug} className="flex flex-col rounded-2xl border border-border bg-card p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{f.short}</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{f.name}</h3>

            <dl className="mt-5 space-y-3 text-sm">
              <Item label="Eligibility" value={f.eligibility} />
              <Item label="Covers" value={f.coverage} />
              <Item label="Best for" value={f.best} />
            </dl>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarClock className="h-3.5 w-3.5" /> {f.deadline}
              </p>
              <button className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-foreground">{value}</dd>
    </div>
  );
}
