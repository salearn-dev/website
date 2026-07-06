import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, BriefcaseBusiness, Clock, ListChecks, Signal } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { CAREERS, COURSES, SKILLS } from "@/lib/data";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills - SA Learn" },
      {
        name: "description",
        content:
          "Job-ready skills you can start learning today with curated tracks, practice tasks, related careers and course pathways.",
      },
    ],
  }),
  component: SkillsPage,
});

function SkillsPage() {
  // Codex: Curated skill tracks and mapping
  // Status: Public static tracks link skills to careers and courses; saved progress/certificates remain backend-owned.
  const skillTracks = SKILLS.map((skill) => {
    const relatedCareers = CAREERS.filter((career) =>
      career.relatedSkillSlugs.includes(skill.slug),
    );
    const relatedCourseSlugs = new Set(
      relatedCareers.flatMap((career) => career.relatedCourseSlugs),
    );
    const relatedCourses = COURSES.filter((course) => relatedCourseSlugs.has(course.slug));

    return { skill, relatedCareers, relatedCourses };
  });

  return (
    <PageShell
      eyebrow="What can I learn today?"
      title="Job-ready skills"
      description="Practical skills that make you employable - start now, mostly free, and connect each skill to real career and study routes."
    >
      <section className="mb-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Curated tracks
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              Learn in steps, then compare where the skill can take you.
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              These tracks are public planning guides. They do not save progress yet, but they show
              the next practical action and the career pathways already mapped in SA Learn.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm md:min-w-56">
            <Stat label="Tracks" value={SKILLS.length.toString()} />
            <Stat label="Mapped careers" value={CAREERS.length.toString()} />
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        {skillTracks.map(({ skill, relatedCareers, relatedCourses }) => (
          <article
            key={skill.slug}
            className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-[var(--shadow-card-hover)]"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {skill.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {skill.practice}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs md:justify-end">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                  <Signal className="h-3 w-3" /> {skill.diff}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                  <Clock className="h-3 w-3" /> {skill.time}
                </span>
              </div>
            </div>

            <section className="mt-5">
              <h4 className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <ListChecks className="h-4 w-4" /> Suggested learning track
              </h4>
              <ol className="mt-3 space-y-2">
                {skill.track.map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-3 rounded-xl border border-border bg-background p-3"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-foreground">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <LinkGroup
                icon={BriefcaseBusiness}
                title="Career paths"
                empty="Career links still need mapping."
                items={relatedCareers.map((career) => ({
                  label: career.title,
                  to: "/careers/$slug",
                  params: { slug: career.slug },
                }))}
              />
              <LinkGroup
                icon={BookOpen}
                title="Related courses"
                empty="No linked prototype course yet."
                items={relatedCourses.slice(0, 3).map((course) => ({
                  label: course.title,
                  to: "/courses/$slug",
                  params: { slug: course.slug },
                }))}
              />
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

function LinkGroup({
  icon: Icon,
  title,
  empty,
  items,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  empty: string;
  items: Array<{
    label: string;
    to: "/careers/$slug" | "/courses/$slug";
    params: { slug: string };
  }>;
}) {
  return (
    <section className="rounded-xl border border-border bg-background p-4">
      <h4 className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="h-4 w-4" /> {title}
      </h4>
      {items.length > 0 ? (
        <div className="mt-3 space-y-2">
          {items.map((item) => (
            <Link
              key={`${item.to}-${item.params.slug}`}
              to={item.to}
              params={item.params}
              className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/70"
            >
              <span>{item.label}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{empty}</p>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
