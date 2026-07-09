import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight, LineChart, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { CAREERS } from "@/lib/data";
import { buildSeoHead } from "@/lib/seo";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/careers")({
  head: () =>
    buildSeoHead({
      title: "Careers - SA Learn",
      description:
        "Explore careers and the study routes that get you there. Skills, subjects, salary and demand.",
      path: "/careers",
      ogType: "website",
    }),
  component: CareersPage,
});

function CareersPage() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  // Codex: Career detail route outlet
  // Status: Parent route yields to /careers/:slug so detail pages replace the list view.
  if (pathname !== "/careers") {
    return <Outlet />;
  }

  return (
    <PageShell
      eyebrow={t("route.careers.eyebrow")}
      title={t("route.careers.title")}
      description={t("route.careers.description")}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CAREERS.map((c) => (
          <article
            key={c.slug}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-[var(--shadow-card-hover)]"
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{c.demand} demand</span>
              <span>-</span>
              <span>{c.salary}</span>
            </div>
            <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.short}</p>

            {/* Codex: Career explorer readiness
               Status: Cards now preview salary bands, growth outlook and linked detail pages. */}
            <div className="mt-5 rounded-xl border border-border bg-background p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <LineChart className="h-3.5 w-3.5" />
                Outlook
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{c.outlook}</p>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <Row label="Study routes" value={c.routes.join(", ")} />
              <Row label="Helpful subjects" value={c.subjects.join(", ")} />
              <Row label="Skills" value={c.skills.join(", ")} />
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Salary bands
              </p>
              <div className="grid gap-2 text-sm text-foreground">
                <Salary label="Entry" value={c.salaryBands.entry} />
                <Salary label="Mid" value={c.salaryBands.mid} />
                <Salary label="Senior" value={c.salaryBands.senior} />
              </div>
            </div>

            <Link
              to="/careers/$slug"
              params={{ slug: c.slug }}
              className="mt-6 inline-flex items-center gap-1 self-start text-sm font-medium text-foreground hover:underline"
            >
              View path <ArrowRight className="h-3.5 w-3.5" />
            </Link>
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

function Salary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-muted px-3 py-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
