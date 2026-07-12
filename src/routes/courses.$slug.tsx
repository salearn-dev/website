import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, BriefcaseBusiness, GraduationCap } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { StructuredData } from "@/components/structured-data";
import { TrustMetadata } from "@/components/trust-metadata";
import { COURSES } from "@/lib/data";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/courses/$slug")({
  loader: ({ params }) => {
    const course = COURSES.find((item) => item.slug === params.slug);

    if (!course) {
      throw notFound();
    }

    return { course };
  },
  head: ({ loaderData }) => {
    const course = loaderData?.course;
    const title = course ? `${course.title} - SA Learn` : "Course - SA Learn";
    const description = course
      ? `${course.title} at ${course.institution}. See qualification type, NQF level, funding notes, related careers and verification status.`
      : "Course detail page on SA Learn.";

    return buildSeoHead({
      title,
      description,
      path: course ? `/courses/${course.slug}` : "/courses",
      ogType: "article",
    });
  },
  component: CourseDetailPage,
});

function CourseDetailPage() {
  const { course } = Route.useLoaderData();

  // Codex: Course detail page template
  // Status: Static-dynamic course pages use one fixed detail template; backend-backed requirements remain pending.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: `${course.qualification} pathway at ${course.institution}. Admission details and fees require official confirmation before applying.`,
    provider: {
      "@type": "EducationalOrganization",
      name: course.institution,
    },
    educationalCredentialAwarded: course.qualification,
    educationalLevel: course.nqf ? `NQF ${course.nqf}` : "Information unavailable",
    timeRequired: course.duration,
    offers: {
      "@type": "Offer",
      price: course.cost === "Free" ? "0" : undefined,
      priceCurrency: "ZAR",
      availability: "https://schema.org/LimitedAvailability",
    },
  };

  return (
    <PageShell
      eyebrow="Course detail"
      title={course.title}
      description={`${course.institution} - ${course.qualification}. Review the route, funding fit and verification status before taking your next step.`}
    >
      <StructuredData data={jsonLd} />

      <div className="mb-6">
        <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to courses
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <article className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge>{course.qualification}</Badge>
            <Badge>{course.nqf ? `NQF ${course.nqf}` : "NQF unavailable"}</Badge>
            <Badge>{course.duration}</Badge>
            <Badge>{course.province}</Badge>
          </div>

          <h2 className="mt-6 text-xl font-semibold tracking-tight text-foreground">What this pathway is for</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This course page uses SA Learn's consistent detail template. It helps learners compare the
            pathway without pretending that every official admission rule has been verified yet.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InfoPanel icon={GraduationCap} label="Institution" value={course.institution} />
            <InfoPanel icon={BookOpen} label="Accreditation note" value={course.accreditation} />
            <InfoPanel icon={BriefcaseBusiness} label="Funding" value={course.funding} />
            <InfoPanel icon={ArrowRight} label="Estimated cost" value={course.cost} />
          </div>

          <section className="mt-8">
            <h3 className="text-base font-semibold text-foreground">Entry requirements</h3>
            <div className="mt-3 rounded-xl border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">
                Information unavailable. SA Learn needs official programme requirements before this page can
                show APS, subject minimums, Mathematics vs Mathematical Literacy rules, NBT flags or faculty
                conditions.
              </p>
            </div>
          </section>

          <section className="mt-8">
            <h3 className="text-base font-semibold text-foreground">Where this can lead</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {course.careers.map((career: string) => (
                <span key={career} className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground">
                  {career}
                </span>
              ))}
            </div>
          </section>
        </article>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-foreground">Next step</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Use this page as a planning view, then confirm requirements, costs and deadlines with the
              official provider before applying or paying.
            </p>
            <a
              href={course.trust.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              View official source <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <TrustMetadata trust={course.trust} />

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-foreground">Missing data warning</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Application deadline, detailed fees, campus availability and subject-specific requirements are
              not verified in this record.
            </p>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-muted px-3 py-1.5 font-medium text-foreground">{children}</span>;
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
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
