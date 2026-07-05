import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, MapPin, Coins } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { TrustMetadata } from "@/components/trust-metadata";
import { OPPORTUNITIES } from "@/lib/data";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunities - SA Learn" },
      { name: "description", content: "Real, open opportunities: applications, learnerships, internships, bursaries and entry-level jobs across South Africa." },
    ],
  }),
  component: OpportunitiesPage,
});

const CATS = ["All", "University Applications", "TVET Applications", "Learnerships", "Internships", "Graduate Programmes", "Scholarships", "Apprenticeships", "Entry-Level Jobs"];

function OpportunitiesPage() {
  return (
    <PageShell
      eyebrow="What can I apply for right now?"
      title="Open opportunities"
      description="Real listings with real deadlines. Filter by category, province and closing date."
    >
      <div className="mb-8 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c} className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground hover:bg-muted">
            {c}
          </button>
        ))}
      </div>

      <div className="divide-y divide-border rounded-2xl border border-border bg-card">
        {OPPORTUNITIES.map((o) => (
          <article key={o.id} className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{o.category}</p>
              <h3 className="mt-1 text-base font-semibold text-foreground">{o.title}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {o.province}</span>
                <span className="inline-flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" /> Closes {o.closes}</span>
                <span className="inline-flex items-center gap-1"><Coins className="h-3.5 w-3.5" /> {o.paid ? "Paid / stipend" : "No stipend"}</span>
              </div>
              <TrustMetadata trust={o.trust} />
            </div>
            <button className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Apply
            </button>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
