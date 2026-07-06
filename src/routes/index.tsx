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
  Target,
  UserRound,
  Wallet,
} from "lucide-react";
import { CAREERS, COURSES, FUNDING, OPPORTUNITIES } from "@/lib/data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SA Learn - Gain Skills. Get Qualifications. Get Hired." },
      {
        name: "description",
        content:
          "Find courses, careers, funding and skills paths that match your results and goals.",
      },
    ],
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
  return (
    <main className="pb-16">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-16 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            South African education, made clear
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            SA Learn
          </h1>
          <p className="mt-4 text-lg text-foreground md:text-xl">
            Gain Skills. Get Qualifications. Get Hired.
          </p>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Find courses, careers, funding and skills paths that match your results and your goals -
            all in one calm, verified place.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/match"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Check My Options <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/courses"
              className="inline-flex h-11 items-center rounded-md border border-input bg-background px-6 text-sm font-medium text-foreground hover:bg-muted"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      <SignedInDashboard />

      <LiveDeadlineFeed />

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
                Explore <ArrowRight className="h-3.5 w-3.5" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Mission */}
      <Section title="Our mission" eyebrow="Why SA Learn">
        <div className="grid gap-8 md:grid-cols-2">
          <p className="text-lg leading-relaxed text-foreground">
            To become South Africa's most trusted education discovery platform - making post-school
            opportunities simple, transparent and accessible.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            We don't just help you pick a course. We help you build a realistic path towards
            employment: study routes, funding, live opportunities and job-ready skills, all
            connected.
          </p>
        </div>
      </Section>

      {/* How it works */}
      <Section title="How it works" eyebrow="Three simple steps">
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
              to="/careers"
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
        eyebrow="Verified pathways"
        link={{ to: "/courses", label: "All courses" }}
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {COURSES.slice(0, 3).map((c) => (
            <div key={c.slug} className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs text-muted-foreground">{c.institution}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
                {c.title}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <Chip>NQF {c.nqf}</Chip>
                <Chip>{c.duration}</Chip>
                <Chip tone="info">{c.funding}</Chip>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{c.careers.join(", ")}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Trusted partners */}
      <Section title="Trusted sources" eyebrow="Verified information">
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
              a: "This is a prototype. Live deployment shows each page's Last Verified Date and source.",
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
        const { data: sessionData } = await supabase.auth.getSession();
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

type DeadlineItem = {
  title: string;
  deadline: string;
  source: string;
  status: string;
  href?: string;
};

type CatalogueOpportunityRow = {
  title: string | null;
  closing_date: string | null;
  provider: string | null;
  source_name: string | null;
  source_url: string | null;
  verification_status: string | null;
};

type CatalogueFundingRow = {
  name: string | null;
  deadline: string | null;
  provider: string | null;
  source_name: string | null;
  source_url: string | null;
  verification_status: string | null;
};

type CatalogueQuery<T> = {
  order: (column: string, options: { ascending: boolean }) => CatalogueQuery<T>;
  limit: (count: number) => Promise<{ data: T[] | null }>;
};

type CatalogueClient = {
  from: <T>(table: string) => {
    select: (columns: string) => CatalogueQuery<T>;
  };
};

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
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let alive = true;

    async function loadDeadlines() {
      try {
        const catalogueClient = supabase as unknown as CatalogueClient;
        const [opportunities, funding] = await Promise.all([
          catalogueClient
            .from<CatalogueOpportunityRow>("opportunities")
            .select("title,closing_date,provider,source_name,source_url,verification_status")
            .order("closing_date", { ascending: true })
            .limit(4),
          catalogueClient
            .from<CatalogueFundingRow>("funding_windows")
            .select("name,deadline,provider,source_name,source_url,verification_status")
            .order("deadline", { ascending: true })
            .limit(3),
        ]);

        const liveItems: DeadlineItem[] = [
          ...(opportunities.data ?? []).map((item) => ({
            title: item.title ?? "Opportunity deadline",
            deadline: item.closing_date ?? "Confirm with source",
            source: item.source_name ?? item.provider ?? "Official source",
            status: item.verification_status ?? "Provisional",
            href: item.source_url ?? undefined,
          })),
          ...(funding.data ?? []).map((item) => ({
            title: item.name ?? "Funding deadline",
            deadline: item.deadline ?? "Confirm with source",
            source: item.source_name ?? item.provider ?? "Official source",
            status: item.verification_status ?? "Provisional",
            href: item.source_url ?? undefined,
          })),
        ].filter((item) => item.title);

        if (alive && liveItems.length > 0) {
          setDeadlines(liveItems);
          setIsLive(true);
        }
      } catch {
        if (alive) setIsLive(false);
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
            Applications and funding
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Deadline watch
          </h2>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <BookmarkCheck className="h-3.5 w-3.5" />
          {isLive ? "Live catalogue feed" : "Prototype fallback"}
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
