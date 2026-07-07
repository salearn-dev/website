import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight, BookOpen, ClipboardCheck, ListChecks } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { GLOSSARY_TERMS, GUIDES } from "@/lib/data";
import { buildSeoHead } from "@/lib/seo";

const ISIZULU_GLOSSARY: Record<string, string> = {
  APS: "Amaphuzu asiza izikhungo ukubheka ukuthi imiphumela yakho iyahlangabezana yini nezidingo zokungena.",
  NQF: "Uhlelo lwamazinga olukhombisa ukuthi isitifiketi, idiploma noma iziqu zisezingeni liphi eNingizimu Afrika.",
  SAQA: "Inhlangano esiza ukubheka nokuphatha imininingwane yezimfanelo ezisemthethweni.",
  DHET: "Umnyango kahulumeni obhekele imfundo ephakeme, ama-TVET kanye nokuqeqeshwa kwamakhono.",
  NSFAS: "Uhlelo losizo lwezimali kubafundi abafanelekile emanyuvesi omphakathi nama-TVET.",
  TVET: "Amakolishi agxile emakhonweni asebenzayo nasezifundweni ezixhumene nomsebenzi.",
  Accreditation: "Ubufakazi bokuthi isikhungo noma uhlelo luhloliwe noma lubhaliswe ngendlela efanele.",
  Learnership: "Uhlelo oluhlanganisa ukufunda kanye nesipiliyoni somsebenzi.",
  Diploma: "Isiqu esivame ukugxila emsebenzini futhi sivame ukuba sendleleni ephathekayo.",
  Degree: "Isiqu semfundo ephakeme esivame ukunikezwa izikhungo zemfundo ephakeme.",
  "Higher Certificate": "Isiqu sokuqala semfundo ephakeme esingakusiza uqhubekele phambili.",
};

export const Route = createFileRoute("/guides")({
  head: () =>
    buildSeoHead({
      title: "Guides - SA Learn",
      description: "Confusing education terms - APS, NQF, SAQA, NSFAS - explained in plain English.",
      path: "/guides",
      ogType: "website",
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
      {/* Codex: Editorial workflow visibility
         Status: Public guide cards expose draft/review/published states; persistent CMS remains backend-owned. */}
      <section className="mb-10 rounded-2xl border border-border bg-card p-6 md:p-8">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Editorial workflow
          </h2>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            ["Draft", "Plain-language notes are written and checked against SA Learn principles."],
            ["Review", "Claims, official links and risky wording are checked before publishing."],
            ["Published", "Learner-facing guides can be linked from search, cards and reports."],
          ].map(([state, description]) => (
            <div key={state} className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground">{state}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Current guides are published static records. A database-backed editor can replace this
          display without changing the learner-facing card structure.
        </p>
      </section>

      {/* Codex: Plain-language glossary
         Status: Glossary terms now live directly on /guides and link to relevant guide detail pages. */}
      <section className="mb-10 rounded-2xl border border-border bg-card p-6 md:p-8">
        <div className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Glossary / Amagama abalulekile
          </h2>
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
              {ISIZULU_GLOSSARY[item.term] && (
                <p lang="zu" className="mt-3 text-sm leading-relaxed text-foreground">
                  {ISIZULU_GLOSSARY[item.term]}
                </p>
              )}
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
