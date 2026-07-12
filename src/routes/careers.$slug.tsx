import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  LineChart,
  Sparkles,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { StructuredData } from "@/components/structured-data";
import { CAREERS, COURSES, SKILLS } from "@/lib/data";
import { buildBreadcrumbJsonLd, buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/careers/$slug")({
  loader: ({ params }) => {
    const career = CAREERS.find((item) => item.slug === params.slug);

    if (!career) {
      throw notFound();
    }

    const relatedCourses = COURSES.filter((course) =>
      career.relatedCourseSlugs.includes(course.slug),
    );
    const relatedSkills = SKILLS.filter((skill) => career.relatedSkillSlugs.includes(skill.slug));

    return { career, relatedCourses, relatedSkills };
  },
  head: ({ loaderData }) => {
    const career = loaderData?.career;
    const title = career ? `${career.title} Career Path - SA Learn` : "Career Path - SA Learn";
    const description = career
      ? `${career.title} pathway with salary bands, demand outlook, helpful subjects, study routes, courses and skills.`
      : "Career detail page on SA Learn.";

    return buildSeoHead({
      title,
      description,
      path: career ? `/careers/${career.slug}` : "/careers",
      ogType: "article",
    });
  },
  component: CareerDetailPage,
});

function CareerDetailPage() {
  const { career, relatedCourses, relatedSkills } = Route.useLoaderData();

  // Codex: Career detail page template
  // Status: Static-dynamic pages expose career pathways; verified labour-market data remains pending.
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers" },
    { name: career.title, path: `/careers/${career.slug}` },
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Occupation",
    name: career.title,
    description: career.short,
    occupationalCategory: career.routes.join(", "),
    skills: career.skills,
    estimatedSalary: [
      {
        "@type": "MonetaryAmountDistribution",
        name: "Estimated monthly salary range",
        currency: "ZAR",
        duration: "P1M",
      },
    ],
  };

  return (
    <PageShell
      eyebrow="Career detail"
      title={career.title}
      description={`${career.short} Compare routes, salary bands, demand signals, linked courses and skills before choosing your next step.`}
    >
      <StructuredData data={[jsonLd, breadcrumbJsonLd]} />

      <div className="mb-6">
        <Link
          to="/careers"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to careers
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <article className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge>{career.demand} demand</Badge>
            {career.routes.map((route: string) => (
              <Badge key={route}>{route}</Badge>
            ))}
          </div>

          <h2 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
            What this career involves
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This career page uses one fixed SA Learn template so learners can compare pathways
            consistently. Salary and demand are planning signals, not verified
            labour-market guarantees.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InfoPanel icon={LineChart} label="Demand outlook" value={career.outlook} />
            <InfoPanel
              icon={BriefcaseBusiness}
              label="Entry roles"
              value={career.entryRoles.join(", ")}
            />
            <InfoPanel
              icon={GraduationCap}
              label="Helpful subjects"
              value={career.subjects.join(", ")}
            />
            <InfoPanel icon={Sparkles} label="Personality fit" value={career.fit.join(", ")} />
          </div>

          <section className="mt-8">
            <h3 className="text-base font-semibold text-foreground">Typical work activities</h3>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {career.dailyWork.map((item: string) => (
                <CheckItem key={item}>{item}</CheckItem>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h3 className="text-base font-semibold text-foreground">Possible route timeline</h3>
            <ol className="mt-3 space-y-3">
              {career.timeline.map((step: string, index: number) => (
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

          <section className="mt-8">
            <h3 className="text-base font-semibold text-foreground">Salary bands</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <SalaryBand label="Entry" value={career.salaryBands.entry} />
              <SalaryBand label="Mid-level" value={career.salaryBands.mid} />
              <SalaryBand label="Senior" value={career.salaryBands.senior} />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Estimate only. SA Learn still needs verified salary sources before these
              ranges can be treated as production labour-market data.
            </p>
          </section>
        </article>

        <aside className="space-y-4">
          <RelatedCourses courses={relatedCourses} />
          <RelatedSkills skills={relatedSkills} />

          <div className="rounded-2xl border border-border bg-card p-6">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <h2 className="mt-3 text-base font-semibold text-foreground">Next step</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Compare at least two study routes and one skill you can start now. If a route needs
              official admission rules, confirm the source before applying or paying.
            </p>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

function RelatedCourses({ courses }: { courses: typeof COURSES }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-base font-semibold text-foreground">Courses that can lead here</h2>
      {courses.length > 0 ? (
        <div className="mt-4 space-y-3">
          {courses.map((course) => (
            <Link
              key={course.slug}
              to="/courses/$slug"
              params={{ slug: course.slug }}
              className="block rounded-xl border border-border bg-background p-4 hover:bg-muted/50"
            >
              <p className="text-sm font-medium text-foreground">{course.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{course.institution}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          No linked course yet. This career still needs verified course mapping.
        </p>
      )}
    </div>
  );
}

function RelatedSkills({ skills }: { skills: typeof SKILLS }) {
  // Codex: Career-to-skill mapping
  // Status: Career detail links learners back to the skills overview; skill detail pages remain future work.
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-base font-semibold text-foreground">Skills to start now</h2>
      {skills.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Link
              key={skill.slug}
              to="/skills"
              className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/70"
            >
              {skill.name}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Skill links are still being mapped for this career.
        </p>
      )}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-muted px-3 py-1.5 font-medium text-foreground">
      {children}
    </span>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
      {children}
    </div>
  );
}

function SalaryBand({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
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
