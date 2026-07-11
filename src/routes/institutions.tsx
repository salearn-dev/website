import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, MapPin } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { TrustMetadata } from "@/components/trust-metadata";
import { INSTITUTIONS, type Institution } from "@/lib/data";
import { loadApprovedInstitutions } from "@/lib/live-catalogue";
import { buildSeoHead } from "@/lib/seo";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/institutions")({
  head: () =>
    buildSeoHead({
      title: "Institutions - SA Learn",
      description: "Verified South African universities, TVET colleges and private institutions.",
      path: "/institutions",
      ogType: "website",
    }),
  component: InstitutionsPage,
});

function InstitutionsPage() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [institutions, setInstitutions] = useState<Institution[]>(INSTITUTIONS);
  const [catalogueSource, setCatalogueSource] = useState<"live" | "static">("static");
  const [type, setType] = useState("All");

  useEffect(() => {
    let alive = true;

    // Codex: Live approved institution catalogue bridge
    // Status: Reads Lovable Phase 2 approved institutions and falls back to static prototype data.
    loadApprovedInstitutions().then((result) => {
      if (!alive) return;
      setInstitutions(result.items);
      setCatalogueSource(result.source);
    });

    return () => {
      alive = false;
    };
  }, []);

  const types = useMemo(() => ["All", ...unique(institutions.map((item) => item.type))], [institutions]);
  const filtered = institutions.filter((item) => type === "All" || item.type === type);

  // Codex: Institution detail route outlet
  // Status: Parent route yields to /institutions/:slug so detail pages replace the list view.
  if (pathname !== "/institutions") {
    return <Outlet />;
  }

  return (
    <PageShell
      eyebrow={t("route.institutions.eyebrow")}
      title={t("route.institutions.title")}
      description={t("route.institutions.description")}
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            aria-pressed={type === t}
            className={`rounded-full border px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
              type === t
                ? "border-foreground/40 bg-muted text-foreground"
                : "border-border bg-background text-foreground hover:bg-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
        Showing <span className="font-medium text-foreground">{filtered.length}</span> of{" "}
        {institutions.length} {catalogueSource === "live" ? "approved live" : "prototype"} institutions.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((i) => (
          <article
            key={i.slug}
            className="overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-[var(--shadow-card-hover)]"
          >
            {i.heroImage ? (
              <img
                src={i.heroImage.url}
                alt={i.heroImage.alt}
                className="h-44 w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : null}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">{i.type}</p>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                    {i.name}
                  </h3>
                  <p className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {i.province}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
                  <CheckCircle2 className="h-3 w-3" /> Listed
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

              <TrustMetadata trust={i.trust} />

              <div className="mt-5 flex items-center justify-between">
                <a
                  href={`https://${i.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  {i.website} <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <Link
                  to="/institutions/$slug"
                  params={{ slug: i.slug }}
                  className="text-sm font-medium text-foreground hover:underline"
                >
                  View institution
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

function unique(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}
