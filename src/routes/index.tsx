import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  BookmarkCheck,
  CalendarClock,
  Compass,
  GraduationCap,
  HelpCircle,
  Landmark,
  MessageCircle,
  ShieldCheck,
  Target,
  UserRound,
  Wallet,
} from "lucide-react";
import { CAREERS, COURSES, FUNDING, OPPORTUNITIES } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";
import { buildSeoHead } from "@/lib/seo";
import { isLanguageCode, useI18n, type LanguageCode } from "@/lib/i18n";
import {
  deadlineFeedStatusLabel,
  resolveDeadlineFeed,
  type DeadlineFeedState,
  type DeadlineItem,
} from "@/lib/home-deadlines";
import { prepareTestimonialSubmission } from "@/lib/testimonial-submission";

export const Route = createFileRoute("/")({
  head: () =>
    buildSeoHead({
      title: "SA Learn - Gain Skills. Get Qualifications. Get Hired.",
      description:
        "Find courses, careers, funding and skills paths that match your results and goals.",
      path: "/",
      ogType: "website",
    }),
  component: Landing,
});

const QUICK = [
  { q: "What can I study?", to: "/courses", icon: BookOpen },
  { q: "What do I qualify for?", to: "/match", icon: Target },
  { q: "How will I pay?", to: "/funding", icon: Wallet },
  { q: "What can I apply for now?", to: "/opportunities", icon: Compass },
];

function Landing() {
  const { t } = useI18n();

  return (
    <main id="main-content" className="pb-16">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-16 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {t("landing.eyebrow")}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            SA Learn
          </h1>
          <p className="mt-4 text-lg text-foreground md:text-xl">
            {t("landing.tagline")}
          </p>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            {t("landing.description")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/match"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t("nav.checkOptions")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/courses"
              className="inline-flex h-11 items-center rounded-md border border-input bg-background px-6 text-sm font-medium text-foreground hover:bg-muted"
            >
              {t("landing.browseCourses")}
            </Link>
          </div>
        </div>
      </section>

      <SignedInDashboard />

      <LiveDeadlineFeed />

      <LearnerTestimonials />

      {/* Quick answers */}
      <section className="mx-auto mt-20 max-w-7xl px-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {QUICK.map(({ q, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-[var(--shadow-card-hover)]"
            >
              <Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
              <p className="mt-6 text-lg font-medium tracking-tight text-foreground">{q}</p>
              <p className="mt-4 inline-flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground">
                {t("landing.quickExplore")} <ArrowRight className="h-3.5 w-3.5" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Mission */}
      <Section title={t("landing.missionTitle")} eyebrow={t("landing.missionEyebrow")}>
        <div className="grid gap-8 md:grid-cols-2">
          <p className="text-lg leading-relaxed text-foreground">
            {t("landing.missionLead")}
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t("landing.missionBody")}
          </p>
        </div>
      </Section>

      {/* How it works */}
      <Section title={t("landing.stepsTitle")} eyebrow={t("landing.stepsEyebrow")}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Tell us your marks",
              d: "Enter your subjects and results. Or skip and browse.",
            },
            {
              n: "02",
              t: "See what fits",
              d: "Get grouped results: qualify, almost qualify, alternatives.",
            },
            {
              n: "03",
              t: "Apply with confidence",
              d: "Compare institutions, funding and open opportunities.",
            },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-border bg-card p-8">
              <p className="text-sm font-medium text-muted-foreground">{s.n}</p>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">{s.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Featured careers */}
      <Section
        title="Featured careers"
        eyebrow="Where does this lead?"
        link={{ to: "/careers", label: "All careers" }}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CAREERS.slice(0, 6).map((c) => (
            <Link
              key={c.slug}
              to="/careers/$slug"
              params={{ slug: c.slug }}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-foreground/20 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {c.demand} demand
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.short}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Featured courses */}
      <Section
        title="Featured courses"
        eyebrow="Explore pathways"
        link={{ to: "/courses", label: "All courses" }}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {COURSES.slice(0, 3).map((c) => (
            <Link
              key={c.slug}
              to="/courses/$slug"
              params={{ slug: c.slug }}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-foreground/20 hover:shadow-[var(--shadow-card-hover)]"
            >
              <p className="text-xs text-muted-foreground">{c.institution}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:underline">
                {c.title}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <Chip>NQF {c.nqf}</Chip>
                <Chip>{c.duration}</Chip>
                <Chip tone="info">{c.funding}</Chip>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{c.careers.join(", ")}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Trusted partners */}
      <Section title="Official reference points" eyebrow="Confirm critical information">
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          {["SAQA", "DHET", "NSFAS", "SETAs", "Universities SA", "SANC"].map((p) => (
            <div
              key={p}
              className="grid h-16 place-items-center rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground"
            >
              {p}
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section title="Frequently asked" eyebrow="Common questions">
        <div className="divide-y divide-border rounded-2xl border border-border bg-card">
          {[
            {
              q: "Is SA Learn free to use?",
              a: "Yes. Browsing courses, funding and guides is free. Accounts are only needed to save results.",
            },
            {
              q: "Is the information verified?",
              a: "Every education record shows its source, verification status and Last Verified Date where available.",
            },
            {
              q: "I didn't pass matric. Can I still study?",
              a: "Yes. We show bridging routes, rewrites, learnerships and short courses that don't need matric.",
            },
            {
              q: "How do I apply for NSFAS?",
              a: "Visit our Funding page for NSFAS eligibility, coverage and the official application link.",
            },
          ].map((f, i) => (
            <details key={i} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium text-foreground">
                <span>{f.q}</span>
                <HelpCircle className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <section className="mx-auto mt-20 max-w-7xl px-6">
        <div className="rounded-3xl border border-border bg-muted/40 p-10 text-center md:p-16">
          <Landmark className="mx-auto h-8 w-8 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Ready to see your options?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-muted-foreground">
            Enter your subjects and marks. See what you qualify for - and what to do next.
          </p>
          <Link
            to="/match"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Check My Options <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

type DashboardSummary = {
  email: string;
  displayName: string | null;
  aps: number | null;
  savedCount: number;
};

// Codex: Signed-in learner dashboard
// Status: Reads Phase 1 profile, learner_details and saved summary; richer recommendations wait for Phase 2 loader swaps.
function SignedInDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    let alive = true;

    async function loadDashboard() {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
        const user = sessionData.session?.user;
        if (!user) return;

        const [{ data: profile }, { data: learner }, { count }] = await Promise.all([
          supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
          supabase.from("learner_details").select("aps").eq("user_id", user.id).maybeSingle(),
          supabase
            .from("saved_items")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id),
        ]);

        if (!alive) return;
        setSummary({
          email: user.email ?? "Signed-in learner",
          displayName: profile?.display_name ?? null,
          aps: learner?.aps ?? null,
          savedCount: count ?? 0,
        });
      } catch {
        if (alive) setSummary(null);
      }
    }

    loadDashboard();
    return () => {
      alive = false;
    };
  }, []);

  if (!summary) return null;

  return (
    <section className="mx-auto mt-10 max-w-7xl px-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <UserRound className="h-4 w-4" />
              Learner dashboard
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              Welcome back, {summary.displayName ?? summary.email}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your saved profile is ready to continue from the account area or the match checker.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:min-w-80">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Latest APS</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {summary.aps ?? "Not saved"}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Saved items</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{summary.savedCount}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/account"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Open account <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/match"
            className="inline-flex h-10 items-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground hover:bg-muted"
          >
            Update marks
          </Link>
        </div>
      </div>
    </section>
  );
}

const STATIC_DEADLINES: DeadlineItem[] = [
  ...OPPORTUNITIES.slice(0, 4).map((item) => ({
    title: item.title,
    deadline: item.closes,
    source: item.trust.sourceName,
    status: item.trust.verificationStatus,
    href: item.trust.sourceUrl,
  })),
  ...FUNDING.slice(0, 2).map((item) => ({
    title: item.name,
    deadline: item.deadline,
    source: item.trust.sourceName,
    status: item.trust.verificationStatus,
    href: item.trust.sourceUrl,
  })),
];

// Codex: Live application deadline feed
// Status: Reads Phase 2 public catalogue tables with a static fallback until external source integrations are live.
function LiveDeadlineFeed() {
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(STATIC_DEADLINES);
  const [feedState, setFeedState] = useState<DeadlineFeedState>("loading");
  const { t } = useI18n();

  useEffect(() => {
    let alive = true;

    async function loadDeadlines() {
      try {
        const [opportunities, funding] = await Promise.all([
          supabase
            .from("opportunities")
            .select("title,closing_date,provider,source_name,source_url,verification_status")
            .order("closing_date", { ascending: true })
            .limit(4),
          supabase
            .from("funding_windows")
            .select("name,deadline,provider,source_name,source_url,verification_status")
            .order("deadline", { ascending: true })
            .limit(3),
        ]);

        const feed = resolveDeadlineFeed(
          STATIC_DEADLINES,
          opportunities.data,
          funding.data,
        );

        if (alive) {
          setDeadlines(feed.items);
          setFeedState(feed.isLive ? "live" : "fallback");
        }
      } catch {
        if (alive) setFeedState("fallback");
      }
    }

    loadDeadlines();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="mx-auto mt-16 max-w-7xl px-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {t("landing.deadlinesEyebrow")}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {t("landing.deadlinesTitle")}
          </h2>
        </div>
        <span role="status" aria-live="polite" className="inline-flex w-fit items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <BookmarkCheck className="h-3.5 w-3.5" />
          {deadlineFeedStatusLabel(feedState)}
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {deadlines.slice(0, 6).map((item) => {
          const body = (
            <>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <CalendarClock className="h-4 w-4" />
                {item.deadline}
              </div>
              <h3 className="mt-3 text-base font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.source} - {item.status}
              </p>
            </>
          );

          return item.href ? (
            <a
              key={`${item.title}-${item.deadline}`}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-border bg-card p-5 hover:border-foreground/20 hover:shadow-[var(--shadow-card-hover)]"
            >
              {body}
            </a>
          ) : (
            <div
              key={`${item.title}-${item.deadline}`}
              className="rounded-2xl border border-border bg-card p-5"
            >
              {body}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          to="/opportunities"
          className="inline-flex h-10 items-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground hover:bg-muted"
        >
          Browse opportunities
        </Link>
        <Link
          to="/whatsapp"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground hover:bg-muted"
        >
          <MessageCircle className="h-4 w-4" /> Send to WhatsApp
        </Link>
      </div>
    </section>
  );
}

type LearnerTestimonial = {
  id: string;
  display_name: string;
  province: string | null;
  quote: string;
  language: LanguageCode;
  created_at: string;
};

// Codex: Canonical learner testimonial pipeline
// Status: Uses public.learner_testimonials; learner submissions stay submitted until admin moderation.
function LearnerTestimonials() {
  const { t, language } = useI18n();
  const [items, setItems] = useState<LearnerTestimonial[]>([]);
  const [form, setForm] = useState({ displayName: "", province: "", quote: "", consent: false });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let alive = true;

    async function loadTestimonials() {
      try {
        const { data, error: testimonialError } = await supabase
          .from("learner_testimonials")
          .select("id,display_name,province,quote,language,created_at")
          .eq("moderation_state", "approved")
          .eq("consent_to_publish", true)
          .order("created_at", { ascending: false })
          .limit(6);

        if (testimonialError) throw testimonialError;
        if (alive) {
          setItems((data ?? []).map((item) => ({
            ...item,
            language: isLanguageCode(item.language) ? item.language : "en",
          })));
        }
      } catch {
        if (alive) setItems([]);
      }
    }

    loadTestimonials();
    return () => {
      alive = false;
    };
  }, []);

  async function submitTestimonial(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const submission = prepareTestimonialSubmission(form);
    if (!submission.ok) {
      setMessage(submission.error);
      return;
    }

    setSubmitting(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const user = sessionData.session?.user;
      if (!user) {
        setMessage(t("landing.testimonialSignIn"));
        return;
      }

      const { error } = await supabase.from("learner_testimonials").insert({
        ...submission.data,
        user_id: user.id,
        language,
      });

      if (error) throw error;
      setForm({ displayName: "", province: "", quote: "", consent: false });
      setMessage("Thank you. Your feedback was submitted for moderation.");
    } catch {
      setMessage("Feedback could not be submitted. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section title={t("landing.testimonialsTitle")} eyebrow={t("landing.testimonialsEyebrow")}>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {items.length > 0 ? (
            items.map((item) => (
              <figure key={item.id} className="rounded-2xl border border-border bg-card p-6">
                <ShieldCheck className="h-5 w-5 text-success" aria-hidden="true" />
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                  "{item.quote}"
                </blockquote>
                <figcaption className="mt-4 text-xs text-muted-foreground">
                  {item.display_name}
                  {item.province ? `, ${item.province}` : ""} · {item.language.toUpperCase()}
                </figcaption>
              </figure>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card p-6 md:col-span-2">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {t("landing.testimonialsEmpty")}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={submitTestimonial} className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground">{t("landing.testimonialSubmit")}</h3>
          <div className="mt-4 space-y-3">
            <TextInput
              label={t("landing.testimonialName")}
              value={form.displayName}
              onChange={(displayName) => setForm((current) => ({ ...current, displayName }))}
              required
              maxLength={80}
              autoComplete="name"
            />
            <TextInput
              label={t("landing.testimonialProvince")}
              value={form.province}
              onChange={(province) => setForm((current) => ({ ...current, province }))}
              maxLength={80}
              autoComplete="address-level1"
            />
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-muted-foreground">
                {t("landing.testimonialQuote")}
              </span>
              <textarea
                value={form.quote}
                onChange={(event) =>
                  setForm((current) => ({ ...current, quote: event.target.value }))
                }
                rows={4}
                required
                minLength={20}
                maxLength={700}
                aria-describedby="testimonial-quote-help"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <span id="testimonial-quote-help" className="mt-1 block text-xs text-muted-foreground">
                20 to 700 characters. Do not include private contact or identity information.
              </span>
            </label>
            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                required
                checked={form.consent}
                onChange={(event) =>
                  setForm((current) => ({ ...current, consent: event.target.checked }))
                }
                className="mt-1 h-4 w-4 rounded border-input"
              />
              <span>{t("landing.testimonialConsent")}</span>
            </label>
          </div>
          <button
            type="submit"
            disabled={submitting || !form.consent}
            className="mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : t("landing.testimonialSubmitButton")}
          </button>
          {message && (
            <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
              {message}
            </p>
          )}
        </form>
      </div>
    </Section>
  );
}

function TextInput({
  label,
  value,
  onChange,
  required = false,
  maxLength,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  maxLength?: number;
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
    </label>
  );
}

function Section({
  title,
  eyebrow,
  link,
  children,
}: {
  title: string;
  eyebrow?: string;
  link?: { to: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {title}
          </h2>
        </div>
        {link && (
          <Link
            to={link.to}
            className="hidden items-center gap-1 text-sm font-medium text-foreground hover:underline md:inline-flex"
          >
            {link.label} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function Chip({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "info" | "success" | "warning";
}) {
  const map = {
    default: "bg-muted text-muted-foreground",
    info: "bg-info-soft text-info",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning-foreground",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${map[tone]}`}
    >
      {children}
    </span>
  );
}
