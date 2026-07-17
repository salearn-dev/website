import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { StructuredData } from "@/components/structured-data";
import { buildGuideSchemas, getGuideDetail } from "@/lib/guide-detail";
import { GLOSSARY_ZU, GUIDE_ZU } from "@/lib/guide-translations";
import { useI18n } from "@/lib/i18n";
import { buildBreadcrumbJsonLd, buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/guides/$slug")({
  loader: ({ params }) => {
    const detail = getGuideDetail(params.slug);

    if (!detail) {
      throw notFound();
    }

    return detail;
  },
  head: ({ loaderData }) => {
    const guide = loaderData?.guide;
    const title = guide ? `${guide.title} - SA Learn Guide` : "Guide - SA Learn";
    const description = guide?.summary ?? "Plain-language education guide on SA Learn.";

    return buildSeoHead({
      title,
      description,
      path: guide ? `/guides/${guide.slug}` : "/guides",
      ogType: "article",
    });
  },
  component: GuideDetailPage,
});

function GuideDetailPage() {
  const { guide, glossary } = Route.useLoaderData();
  const { language } = useI18n();
  const isiZulu = language === "zu";
  const body = isiZulu ? GUIDE_ZU[guide.slug] : guide;
  const labels = isiZulu
    ? {
        eyebrow: "Umhlahlandlela",
        back: "Buyela emihlahlandleleni",
        explanation: "Incazelo elula",
        remember: "Okufanele ukukhumbule",
        steps: "Izinyathelo",
        terms: "Amagama ahlobene",
        source: "Isikhumbuzo ngomthombo",
        sourceBody:
          "Qinisekisa imininingwane ebalulekile yezicelo, uxhaso, ukugunyazwa noma ukungena emithonjeni esemthethweni.",
      }
    : {
        eyebrow: `${guide.category} guide`,
        back: "Back to guides",
        explanation: "Plain-English explanation",
        remember: "What to remember",
        steps: "Steps",
        terms: "Related glossary terms",
        source: "Source reminder",
        sourceBody:
          "Critical application, funding, accreditation or admission details still need confirmation from official sources.",
      };

  const schemas = buildGuideSchemas(guide.slug);

  if (!schemas) {
    throw notFound();
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: guide.title, path: `/guides/${guide.slug}` },
  ]);

  return (
    <PageShell eyebrow={labels.eyebrow} title={body.title} description={body.summary}>
      <StructuredData data={[schemas.article, breadcrumbJsonLd]} />
      {schemas.howTo && <StructuredData data={schemas.howTo} />}

      <div className="mb-6">
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {labels.back}
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <article className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
            {labels.explanation}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {body.plainLanguage}
          </p>

          <section className="mt-8">
            <h3 className="text-base font-semibold text-foreground">{labels.remember}</h3>
            <div className="mt-3 grid gap-2">
              {body.keyPoints.map((point: string) => (
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

          {body.steps && (
            <section className="mt-8">
              <h3 className="text-base font-semibold text-foreground">{labels.steps}</h3>
              <ol className="mt-3 space-y-3">
                {body.steps.map((step: string, index: number) => (
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
            <h2 className="text-base font-semibold text-foreground">{labels.terms}</h2>
            <div className="mt-4 space-y-3">
              {glossary.map((item: { term: string; meaning: string }) => (
                <div key={item.term} className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm font-semibold text-foreground">{item.term}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {isiZulu ? GLOSSARY_ZU[item.term] : item.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-foreground">{labels.source}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {labels.sourceBody}
            </p>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
