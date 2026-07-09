import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { getProdReadinessGate } from "@/lib/gate.functions";

export const Route = createFileRoute("/prod-readiness")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Production Readiness - SA Learn" },
      { name: "description", content: "Internal SA Learn roadmap. Restricted access." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  loader: () => getProdReadinessGate(),
  component: ProdReadinessPage,
});

type Feature = { label: string; done: boolean };
type Group = { route: string; title: string; features: Feature[] };
type FeatureMeta = { owner: string; priority: "P0" | "P1" | "P2"; status: string };

const GROUPS: Group[] = [
  {
    route: "/",
    title: "Landing",
    features: [
      { label: "Static hero with tagline 'Gain Skills. Get Qualifications. Get Hired.'", done: true },
      { label: "Mission section and FAQ", done: true },
      { label: "Global site header and footer with SA flag branding", done: true },
      { label: "Dynamic dark mode (light / dark / system) with anti-flash script", done: true },
      { label: "Personalised dashboard when signed in", done: true },
      { label: "Live application deadlines feed (approved rows fallback to static)", done: true },
      { label: "Testimonials from real learners", done: false },
    ],
  },
  {
    route: "/match",
    title: "Match - What do I qualify for?",
    features: [
      { label: "4-step flow: Subjects, Marks, Interests, Results", done: true },
      { label: "Client-side APS calculator (best 6 excluding LO)", done: true },
      { label: "Grouped results: Qualify, Almost, Do not qualify, Alternatives", done: true },
      { label: "Explanations for every result (why / why not)", done: true },
      { label: "Non-matric qualification and NQF career guidance path", done: true },
      { label: "Server-side rules engine per institution and faculty (real rules, not prototype)", done: false },
      { label: "Saved learner profiles with subjects and marks (write UI)", done: true },
      { label: "Downloadable PDF match report", done: true },
      { label: "NBT flags and additional-test awareness (real dataset)", done: false },
    ],
  },
  {
    route: "/courses",
    title: "Courses catalogue",
    features: [
      { label: "Filterable static course list", done: true },
      { label: "Search by keyword", done: true },
      { label: "Category filters (TVET, University, Short course)", done: true },
      { label: "Live catalogue loader with static fallback", done: true },
      { label: "Per-course detail pages with SEO metadata", done: true },
      { label: "'Last verified' badges with source URL", done: true },
      { label: "Filter by NQF level, cost, city, delivery mode", done: true },
      { label: "JSON-LD Course structured data", done: true },
      { label: "Seeded verified catalogue rows (approved & sourced)", done: false },
    ],
  },
  {
    route: "/careers",
    title: "Careers explorer",
    features: [
      { label: "Static career cards", done: true },
      { label: "Mapping careers to required subjects and study routes", done: true },
      { label: "O*NET-style detail pages", done: true },
      { label: "Salary bands per experience level", done: true },
      { label: "Demand and growth-outlook signals (prototype copy)", done: true },
      { label: "Links from career to matching courses and skills", done: true },
      { label: "Sourced salary/demand data with citations", done: false },
    ],
  },
  {
    route: "/institutions",
    title: "Institutions",
    features: [
      { label: "Static institution list", done: true },
      { label: "Institution self-serve portal shell (gated by role)", done: true },
      { label: "Admin moderation workflow (moderation_state schema)", done: true },
      { label: "Verified institution profiles with sourced data", done: false },
      { label: "Accreditation status pulled from register", done: false },
      { label: "Application windows sourced from official calendars", done: false },
    ],
  },
  {
    route: "/funding",
    title: "Funding",
    features: [
      { label: "Static funding cards (NSFAS, bursaries, loans)", done: true },
      { label: "NSFAS eligibility wizard (UI only, no persistence)", done: true },
      { label: "Bursary matcher based on profile (UI only)", done: true },
      { label: "Document upload storage bucket with POPIA consent record", done: true },
      { label: "Saved deadline reminder records (email)", done: true },
      { label: "Saved deadline reminder records (WhatsApp)", done: true },
      { label: "Rules-based bursary matcher with saved learner profile", done: true },
    ],
  },
  {
    route: "/skills",
    title: "Skills",
    features: [
      { label: "Static skill list", done: true },
      { label: "Curated learning tracks (static content)", done: true },
      { label: "Skill-to-career mapping", done: true },
      { label: "Progress tracking per learner (schema + RLS)", done: true },
      { label: "Progress tracking UI on skill cards", done: true },
      { label: "Certificates of completion (PDF progress records)", done: true },
    ],
  },
  {
    route: "/opportunities",
    title: "Opportunities",
    features: [
      { label: "Static opportunities list", done: true },
      { label: "Filtering by province, sector and type", done: true },
      { label: "Moderated partner intake pipeline (moderation_state)", done: true },
      { label: "Public API for institution partners to push windows", done: true },
      { label: "Weekly cron to flag stale records (>90 days) scheduled via pg_cron", done: true },
      { label: "Reminders for saved opportunity deadlines", done: true },
    ],
  },
  {
    route: "/guides",
    title: "Guides",
    features: [
      { label: "Static explainer content", done: true },
      { label: "Editorial workflow schema (draft / in_review / published / archived)", done: true },
      { label: "Plain-language glossary", done: true },
      { label: "Structured how-tos with JSON-LD", done: true },
      { label: "Bilingual content (English + isiZulu first) - full page bodies", done: false },
    ],
  },
  {
    route: "Platform",
    title: "Platform, infrastructure and trust",
    features: [
      { label: "TanStack Start SSR routing", done: true },
      { label: "Tailwind v4 design system with semantic tokens", done: true },
      { label: "Route-level SEO metadata on every page", done: true },
      { label: "Dynamic sitemap.xml and robots.txt", done: true },
      { label: "Lovable Cloud backend (Postgres, auth)", done: true },
      { label: "Lovable Cloud storage buckets configured", done: true },
      { label: "User roles (learner, counsellor, institution, admin) via has_role()", done: true },
      { label: "Row Level Security on every user table", done: true },
      { label: "Email magic-link sign-in", done: true },
      { label: "Google sign-in wired and provider enabled", done: true },
      { label: "Apple sign-in wired and provider enabled", done: false },
      { label: "WhatsApp compose entry points (wa.me deep links)", done: true },
      { label: "Multilingual UI shell (header/footer strings translated)", done: true },
      { label: "Full-page multilingual content across routes", done: false },
      { label: "WCAG 2.1 AA compliance audit (documented report)", done: true },
      { label: "POPIA-compliant data handling and consent flows (audited)", done: true },
    ],
  },
];

// Codex: Multi-developer production readiness metadata
// Status: Route checklist now exposes inferred priority, owner, status, and next incomplete item.
function getFeatureMeta(group: Group, feature: Feature): FeatureMeta {
  if (feature.done) {
    return { owner: "Team", priority: "P2", status: "Built" };
  }

  const label = feature.label.toLowerCase();

  if (
    label.includes("source") ||
    label.includes("verified") ||
    label.includes("server-side") ||
    label.includes("popia") ||
    label.includes("row level security") ||
    label.includes("auth") ||
    label.includes("live")
  ) {
    return { owner: "Unassigned", priority: "P0", status: "Blocked by backend/data" };
  }

  if (
    group.route === "/match" ||
    label.includes("detail pages") ||
    label.includes("filters") ||
    label.includes("deadline") ||
    label.includes("cms")
  ) {
    return { owner: "Unassigned", priority: "P1", status: "Ready for implementation" };
  }

  return { owner: "Unassigned", priority: "P2", status: "Planned" };
}

function nextIncomplete(group: Group) {
  return group.features.find((feature) => !feature.done);
}

function ProdReadinessPage() {
  const all = GROUPS.flatMap((g) => g.features);
  const done = all.filter((f) => f.done).length;
  const total = all.length;
  const pct = Math.round((done / total) * 100);

  return (
    <PageShell
      eyebrow="Production readiness"
      title="Road to production"
      description="A live checklist of everything SA Learn needs to graduate from prototype to a production-ready platform, grouped by route. Checked items are built and working today."
    >
      <section className="mb-10 rounded-3xl border border-border bg-card p-6 md:p-8">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Overall progress
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="text-2xl font-semibold text-foreground">{pct}%</span>
              <span className="ml-2">
                {done} of {total} features complete
              </span>
            </p>
          </div>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
            Beta - honest checklist
          </span>
        </div>
        <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-label="Overall production readiness progress"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>100%</span>
        </div>
      </section>

      <div className="space-y-6">
        {GROUPS.map((group) => {
          const gDone = group.features.filter((f) => f.done).length;
          const gTotal = group.features.length;
          const gPct = Math.round((gDone / gTotal) * 100);
          const next = nextIncomplete(group);
          return (
            <section key={group.route} className="rounded-2xl border border-border bg-card">
              <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border px-6 py-4">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{group.route}</p>
                  <h2 className="mt-0.5 text-lg font-semibold tracking-tight text-foreground">
                    {group.title}
                  </h2>
                  {next && (
                    <p className="mt-2 max-w-2xl text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Next:</span> {next.label}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    {gDone} / {gTotal}
                  </span>
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${gPct}%` }} />
                  </div>
                </div>
              </header>
              <ul className="divide-y divide-border">
                {group.features.map((f) => {
                  const meta = getFeatureMeta(group, f);

                  return (
                    <li
                      key={f.label}
                      className="flex flex-col gap-3 px-6 py-3 sm:flex-row sm:items-start"
                    >
                      <div className="flex flex-1 items-start gap-3">
                        <span
                          aria-hidden
                          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                            f.done
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background"
                          }`}
                        >
                          {f.done && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <span
                          className={`text-sm ${f.done ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {f.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-8 text-[11px] sm:justify-end sm:pl-0">
                        <span className="rounded-full bg-muted px-2.5 py-1 font-medium text-foreground">
                          {meta.priority}
                        </span>
                        <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                          {meta.owner}
                        </span>
                        <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                          {meta.status}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}
