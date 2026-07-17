import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarClock,
  ExternalLink,
  Landmark,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { StructuredData } from "@/components/structured-data";
import { InstitutionHeroMedia } from "@/components/institution-hero-media";
import { TrustMetadata } from "@/components/trust-metadata";
import { INSTITUTIONS } from "@/lib/data";
import { buildBreadcrumbJsonLd, buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/institutions/$slug")({
  loader: ({ params }) => {
    const institution = INSTITUTIONS.find((item) => item.slug === params.slug);

    if (!institution) {
      throw notFound();
    }

    return { institution };
  },
  head: ({ loaderData }) => {
    const institution = loaderData?.institution;
    const title = institution ? `${institution.name} - SA Learn` : "Institution - SA Learn";
    const description = institution
      ? `${institution.name} profile with accreditation notes, campuses, application windows and source links.`
      : "Institution profile on SA Learn.";

    return buildSeoHead({
      title,
      description,
      path: institution ? `/institutions/${institution.slug}` : "/institutions",
      ogType: "article",
    });
  },
  component: InstitutionDetailPage,
});

function InstitutionDetailPage() {
  const { institution } = Route.useLoaderData();

  // Codex: Institution profile template
  // Status: Public-institution identity and type are checked against DHET directories.
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Institutions", path: "/institutions" },
    { name: institution.name, path: `/institutions/${institution.slug}` },
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: institution.name,
    url: institution.trust.sourceUrl,
    address: {
      "@type": "PostalAddress",
      addressRegion: institution.province,
      addressCountry: "ZA",
    },
    description: `${institution.type} profile on SA Learn. Registration, accreditation and application windows require official confirmation before applying or paying.`,
  };

  return (
    <PageShell
      eyebrow="Institution profile"
      title={institution.name}
      description={`${institution.type} in ${institution.province}. Review registration notes, application windows and official source links before choosing where to study.`}
    >
      <StructuredData data={[jsonLd, breadcrumbJsonLd]} />

      <div className="mb-6">
        <Link
          to="/institutions"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to institutions
        </Link>
      </div>

      <InstitutionHeroMedia
        image={institution.heroImage}
        institutionName={institution.name}
        variant="detail"
      />

      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <article className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge>{institution.type}</Badge>
            <Badge>{institution.province}</Badge>
            <Badge>{institution.funding}</Badge>
          </div>

          <h2 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
            Study safety summary
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This profile gives learners one place to compare the institution, listed campuses,
            registration notes and application timing. Institution identity is sourced from DHET;
            programme accreditation and current admissions must still be checked separately.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InfoPanel icon={Landmark} label="Institution type" value={institution.type} />
            <InfoPanel icon={MapPin} label="Province" value={institution.province} />
            <InfoPanel icon={Building2} label="Campuses" value={institution.campuses.join(", ")} />
            <InfoPanel
              icon={ShieldCheck}
              label="Accreditation note"
              value={institution.accreditationStatus}
            />
          </div>

          <section className="mt-8">
            <h3 className="text-base font-semibold text-foreground">Application windows</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {institution.applicationWindows.map((window: { label: string; period: string; status: string }) => (
                <div
                  key={window.label}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium text-foreground">{window.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{window.period}</p>
                  <p className="mt-3 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-medium text-warning-foreground">
                    {window.status}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h3 className="text-base font-semibold text-foreground">Register and source links</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {institution.registerLinks.map((link: { label: string; url: string }) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-4 text-sm font-medium text-foreground hover:bg-muted/50"
                >
                  {link.label}
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                </a>
              ))}
            </div>
          </section>
        </article>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-foreground">Next step</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Confirm registration, programme accreditation, application dates and fees on official
              sources before applying or paying any provider.
            </p>
            <a
              href={institution.trust.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Open official site <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <TrustMetadata trust={institution.trust} />

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-foreground">Verification boundary</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              DHET directory evidence confirms this public institution listing. It does not verify
              current application windows, campus programmes, fees or professional accreditation.
            </p>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-muted px-3 py-1.5 font-medium text-foreground">
      {children}
    </span>
  );
}

function InfoPanel({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <p className="mt-3 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-foreground">{value}</p>
    </div>
  );
}
