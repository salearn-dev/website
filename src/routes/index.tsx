import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, GraduationCap, HelpCircle, Landmark, Sparkles, Target, Wallet } from "lucide-react";
import { CAREERS, COURSES } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SA Learn - Gain skills. Get qualified. Get hired." },
      { name: "description", content: "Find courses, careers, funding and skills paths that match your results and goals." },
    ],
  }),
  component: Landing,
});

const QUICK = [
  { q: "What can I study?", to: "/courses", icon: BookOpen },
  { q: "What do I qualify for?", to: "/match", icon: Target },
  { q: "How will I pay?", to: "/funding", icon: Wallet },
  { q: "What can I apply for now?", to: "/opportunities", icon: Sparkles },
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
            Gain skills. Get qualified. Get hired.
          </p>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Find courses, careers, funding and skills paths that match your results and your goals - all in one calm, verified place.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/match" className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Check My Options <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/courses" className="inline-flex h-11 items-center rounded-md border border-input bg-background px-6 text-sm font-medium text-foreground hover:bg-muted">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

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
            To become South Africa's most trusted education discovery platform - making post-school opportunities simple, transparent and accessible.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            We don't just help you pick a course. We help you build a realistic path towards employment: study routes, funding, live opportunities and job-ready skills, all connected.
          </p>
        </div>
      </Section>

      {/* How it works */}
      <Section title="How it works" eyebrow="Three simple steps">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { n: "01", t: "Tell us your marks", d: "Enter your subjects and results. Or skip and browse." },
            { n: "02", t: "See what fits", d: "Get grouped results: qualify, almost qualify, alternatives." },
            { n: "03", t: "Apply with confidence", d: "Compare institutions, funding and open opportunities." },
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
      <Section title="Featured careers" eyebrow="Where does this lead?" link={{ to: "/careers", label: "All careers" }}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CAREERS.slice(0, 6).map((c) => (
            <Link key={c.slug} to="/careers" className="group rounded-2xl border border-border bg-card p-6 hover:border-foreground/20 hover:shadow-[var(--shadow-card-hover)]">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.demand} demand</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.short}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Featured courses */}
      <Section title="Featured courses" eyebrow="Verified pathways" link={{ to: "/courses", label: "All courses" }}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {COURSES.slice(0, 3).map((c) => (
            <div key={c.slug} className="rounded-2xl border border-border bg-card p-6">
              <p className="text-xs text-muted-foreground">{c.institution}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">{c.title}</h3>
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
            <div key={p} className="grid h-16 place-items-center rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground">
              {p}
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section title="Frequently asked" eyebrow="Common questions">
        <div className="divide-y divide-border rounded-2xl border border-border bg-card">
          {[
            { q: "Is SA Learn free to use?", a: "Yes. Browsing courses, funding and guides is free. Accounts are only needed to save results." },
            { q: "Is the information verified?", a: "This is a prototype. Live deployment shows each page's Last Verified Date and source." },
            { q: "I didn't pass matric. Can I still study?", a: "Yes. We show bridging routes, rewrites, learnerships and short courses that don't need matric." },
            { q: "How do I apply for NSFAS?", a: "Visit our Funding page for NSFAS eligibility, coverage and the official application link." },
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
          <Link to="/match" className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Check My Options <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
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
          {eyebrow && <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>}
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{title}</h2>
        </div>
        {link && (
          <Link to={link.to} className="hidden items-center gap-1 text-sm font-medium text-foreground hover:underline md:inline-flex">
            {link.label} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function Chip({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "info" | "success" | "warning" }) {
  const map = {
    default: "bg-muted text-muted-foreground",
    info: "bg-info-soft text-info",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning-foreground",
  } as const;
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${map[tone]}`}>{children}</span>;
}
