import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight, BookOpen, ListChecks } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { GLOSSARY_TERMS, GUIDES } from "@/lib/data";

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: "Guides - SA Learn" },
      {
        name: "description",
        content: "Confusing education terms - APS, NQF, SAQA, NSFAS - explained in plain English.",
      },
    ],
  }),
  component: GuidesPage,
});

function GuidesPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  // Codex: Guide detail route outlet
  // Status: Parent route yields to /guides/:slug so structured guide pages replace the grid.
  if (pathname !== "/guides") {
    return <Outlet />;
  }

  return (
    <PageShell
      eyebrow="Understand the system"
      title="Plain-English guides"
      description="Every confusing acronym, process and decision - explained simply. No jargon, no fluff."
    >
      {/* Codex: Plain-language glossary
         Status: Glossary terms now live directly on /guides and link to relevant guide detail pages. */}
      <section className="mb-10 rounded-2xl border border-border bg-card p-6 md:p-8">
        <div className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Glossary</h2>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {GLOSSARY_TERMS.map((item) => (
            <Link
              key={item.term}
              to="/guides/$slug"
              params={{ slug: item.guideSlug }}
              className="rounded-xl border border-border bg-background p-4 hover:bg-muted/50"
            >
              <p className="text-sm font-semibold text-foreground">{item.term}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.meaning}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => (
          <article
            key={g.slug}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-[var(--shadow-card-hover)]"
          >
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <div className="mt-4 flex items-center gap-2">
              <h3 className="text-base font-semibold tracking-tight text-foreground">{g.title}</h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {g.category}
              </span>
            </div>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{g.summary}</p>
            <p className="mt-4 text-sm leading-relaxed text-foreground">{g.plainLanguage}</p>
            <Link
              to="/guides/$slug"
              params={{ slug: g.slug }}
              className="mt-5 inline-flex items-center gap-1 self-start text-sm font-medium text-foreground group-hover:underline"
            >
              Read guide <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
