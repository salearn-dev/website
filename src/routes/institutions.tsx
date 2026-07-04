import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ExternalLink, MapPin } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { INSTITUTIONS } from "@/lib/data";

export const Route = createFileRoute("/institutions")({
  head: () => ({
    meta: [
      { title: "Institutions — SA Learn" },
      { name: "description", content: "Verified South African universities, TVET colleges and private institutions." },
    ],
  }),
  component: InstitutionsPage,
});

const TYPES = ["All", "Public University", "University of Technology", "TVET College", "Private College"];

function InstitutionsPage() {
  return (
    <PageShell
      eyebrow="Where can I study?"
      title="Institutions"
      description="Verified universities, universities of technology, TVET colleges and private institutions across South Africa."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button key={t} className="rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground hover:bg-muted">
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {INSTITUTIONS.map((i) => (
          <article key={i.slug} className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">{i.type}</p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">{i.name}</h3>
                <p className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {i.province}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
                <CheckCircle2 className="h-3 w-3" /> Verified
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Courses on SA Learn</p>
                <p className="font-medium text-foreground">{i.courses}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Funding</p>
                <p className="font-medium text-foreground">{i.funding}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <a href={`https://${i.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                {i.website} <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button className="text-sm font-medium text-foreground hover:underline">View institution</button>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
