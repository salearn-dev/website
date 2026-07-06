import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { GLOSSARY_TERMS, GUIDES } from "@/lib/data";

export const Route = createFileRoute("/guides/$slug")({
  loader: ({ params }) => {
    const guide = GUIDES.find((item) => item.slug === params.slug);

    if (!guide) {
      throw notFound();
    }

    const glossary = GLOSSARY_TERMS.filter((item) => guide.relatedTerms.includes(item.term));

    return { guide, glossary };
  },
  head: ({ loaderData }) => {
    const guide = loaderData?.guide;
    const title = guide ? `${guide.title} - SA Learn Guide` : "Guide - SA Learn";
    const description = guide?.summary ?? "Plain-language education guide on SA Learn.";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: GuideDetailPage,
});

function GuideDetailPage() {
  const { guide, glossary } = Route.useLoaderData();

  // Codex: Structured guide JSON-LD
  // Status: Detail pages emit Article JSON-LD, and step-based guides also emit HowTo JSON-LD.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.summary,
    articleSection: guide.category,
    publisher: {
      "@type": "Organization",
      name: "SA Learn",
    },
  };

  const howToJsonLd = guide.steps
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: guide.title,
        description: guide.summary,
        step: guide.steps.map((step: string, index: number) => ({
          "@type": "HowToStep",
          position: index + 1,
          text: step,
        })),
      }
    : null;

  return (
    <PageShell eyebrow={`${guide.category} guide`} title={guide.title} description={guide.summary}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {howToJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
      )}

      <div className="mb-6">
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to guides
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <article className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
            Plain-English explanation
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {guide.plainLanguage}
          </p>

          <section className="mt-8">
            <h3 className="text-base font-semibold text-foreground">What to remember</h3>
            <div className="mt-3 grid gap-2">
              {guide.keyPoints.map((point: string) => (
                <div
                  key={point}
                  className="flex gap-3 rounded-xl border border-border bg-background p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="text-sm leading-relaxed text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </section>

          {guide.steps && (
            <section className="mt-8">
              <h3 className="text-base font-semibold text-foreground">Steps</h3>
              <ol className="mt-3 space-y-3">
                {guide.steps.map((step: string, index: number) => (
                  <li
                    key={step}
                    className="flex gap-3 rounded-xl border border-border bg-background p-4"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-foreground">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </article>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-foreground">Related glossary terms</h2>
            <div className="mt-4 space-y-3">
              {glossary.map((item: { term: string; meaning: string }) => (
                <div key={item.term} className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm font-semibold text-foreground">{item.term}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-foreground">Source reminder</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              This guide explains concepts in plain language. Critical application, funding,
              accreditation or admission details still need confirmation from official sources.
            </p>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
