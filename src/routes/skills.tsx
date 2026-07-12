import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  Download,
  ListChecks,
  Save,
  Signal,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";
import { CAREERS, COURSES, SKILLS } from "@/lib/data";
import { buildSeoHead } from "@/lib/seo";
import { useI18n } from "@/lib/i18n";
import { makePdfBlob } from "@/lib/match-report";
import {
  buildSkillProgress,
  canDownloadSkillRecord,
  progressLabelFromStatus,
  type SkillProgressChoice,
} from "@/lib/skill-progress";

export const Route = createFileRoute("/skills")({
  head: () =>
    buildSeoHead({
      title: "Skills - SA Learn",
      description:
        "Job-ready skills you can start learning today with curated tracks, practice tasks, related careers and course pathways.",
      path: "/skills",
      ogType: "website",
    }),
  component: SkillsPage,
});

function SkillsPage() {
  const { t } = useI18n();
  const [userId, setUserId] = useState<string | null>(null);
  const [savedProgress, setSavedProgress] = useState<Record<string, string>>({});
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  // Codex: Curated skill tracks, mapping and learner progress
  // Status: Public tracks map to careers/courses; signed-in learners save progress in public.skill_progress.
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

  useEffect(() => {
    let alive = true;

    async function loadSavedProgress() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData.session?.user;
        if (!user) return;

        const { data } = await supabase
          .from("skill_progress")
          .select("skill_slug, status, completed_steps, total_steps")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });

        if (!alive) return;
        setUserId(user.id);
        setSavedProgress(
          Object.fromEntries(
            (data ?? []).map((item) => [
              item.skill_slug,
              `${progressLabelFromStatus(item.status)} - ${item.completed_steps}/${item.total_steps} steps`,
            ]),
          ),
        );
      } catch {
        if (alive) setStatusMessage("Sign in from Account to save skill progress.");
      }
    }

    loadSavedProgress();
    return () => {
      alive = false;
    };
  }, []);

  async function saveProgress(slug: string, title: string, progress: SkillProgressChoice) {
    setStatusMessage("");
    setSavingSlug(slug);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        setStatusMessage("Sign in from Account to save skill progress.");
        return;
      }

      const stepCount = SKILLS.find((skill) => skill.slug === slug)?.track.length ?? 3;
      const { totalSteps, completedSteps, status } = buildSkillProgress(stepCount, progress);

      const { error } = await supabase.from("skill_progress").upsert(
        {
          user_id: user.id,
          skill_slug: slug,
          completed_steps: completedSteps,
          total_steps: totalSteps,
          status,
          completed_at: status === "completed" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,skill_slug" },
      );
      if (error) throw error;

      setUserId(user.id);
      setSavedProgress((current) => ({ ...current, [slug]: `${progress} - ${completedSteps}/${totalSteps} steps` }));
      setStatusMessage(`Saved ${title} progress.`);
    } catch {
      setStatusMessage("Progress could not be saved yet. Please try again.");
    } finally {
      setSavingSlug(null);
    }
  }

  function downloadSkillCertificate(skillName: string, progress: string) {
    const issuedAt = new Date().toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const text = [
      "SA Learn Skill Completion Record",
      "",
      `Skill: ${skillName}`,
      `Progress: ${progress}`,
      `Issued: ${issuedAt}`,
      "",
      "This record confirms learner-reported progress on an SA Learn skill track.",
      "It is not an accredited qualification, SETA certificate, SAQA-registered award, or proof of formal competence.",
      "Use it as a learning-progress summary while building a portfolio and applying through official providers.",
    ].join("\n");
    const blob = makePdfBlob(text);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sa-learn-${skillName.toLowerCase().replace(/\s+/g, "-")}-progress-record.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <PageShell
      eyebrow={t("route.skills.eyebrow")}
      title={t("route.skills.title")}
      description={t("route.skills.description")}
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
              These tracks are public planning guides. Signed-in learners can save self-reported progress, compare the next practical action and follow mapped career pathways.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm md:min-w-56">
            <Stat label="Tracks" value={SKILLS.length.toString()} />
            <Stat label="Mapped careers" value={CAREERS.length.toString()} />
            <Stat label="Saved" value={Object.keys(savedProgress).length.toString()} />
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
          {userId
            ? statusMessage || "Signed-in learners can save progress on each skill track."
            : statusMessage || "Sign in from Account to track progress across visits."}
        </p>
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
              <div className="mt-4 flex flex-wrap gap-2">
                {(["Started", "Practising", "Ready to show"] as const).map((progress) => (
                  <button
                    key={progress}
                    type="button"
                    onClick={() => saveProgress(skill.slug, skill.name, progress)}
                    disabled={savingSlug === skill.slug}
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-60"
                  >
                    {savedProgress[skill.slug]?.startsWith(progress) ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    {progress}
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/35 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h5 className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Award className="h-4 w-4" aria-hidden="true" />
                      Completion record
                    </h5>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Download a learner-owned progress record. It is not an accredited
                      qualification or formal certificate.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      downloadSkillCertificate(
                        skill.name,
                        savedProgress[skill.slug] ?? "Not saved yet",
                      )
                    }
                    disabled={!canDownloadSkillRecord(savedProgress[skill.slug])}
                    title={
                      canDownloadSkillRecord(savedProgress[skill.slug])
                        ? undefined
                        : "Save this track as Ready to show before downloading"
                    }
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    {canDownloadSkillRecord(savedProgress[skill.slug])
                      ? "Download record"
                      : "Complete track to download"}
                  </button>
                </div>
              </div>
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
                empty="No linked course yet."
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
