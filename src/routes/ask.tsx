import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  Landmark,
  ListChecks,
  Search,
  ShieldCheck,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { TrustMetadata } from "@/components/trust-metadata";
import {
  CAREERS,
  COURSES,
  FUNDING,
  GLOSSARY_TERMS,
  GUIDES,
  INSTITUTIONS,
  OPPORTUNITIES,
  SKILLS,
  type TrustMeta,
} from "@/lib/data";
import { buildSeoHead } from "@/lib/seo";
import {
  askTokens,
  detectAskIntent,
  hasAskQuerySignal,
  type AskIntent,
} from "@/lib/ask-intent";

export const Route = createFileRoute("/ask")({
  head: () =>
    buildSeoHead({
      title: "Ask SA Learn - SA Learn",
      description:
        "Ask a study, funding, career or application question and get grounded SA Learn cards instead of unsupported guesses.",
      path: "/ask",
      ogType: "website",
    }),
  component: AskPage,
});

type AskKind =
  | "Course"
  | "Career"
  | "Funding"
  | "Opportunity"
  | "Guide"
  | "Skill"
  | "Institution"
  | "Workflow";

type AskResult = {
  id: string;
  kind: AskKind;
  title: string;
  description: string;
  href: string;
  meta: string[];
  trust?: TrustMeta;
};

type AskAnswer = {
  intent: AskIntent;
  summary: string;
  nextStep: string;
  results: AskResult[];
};

const SUGGESTIONS = [
  "What can I do with a diploma in business?",
  "Find funding for nursing",
  "Careers for NQF 6 technology",
  "How do I avoid fake colleges?",
  "Courses I can study online",
  "What can I apply for now?",
];

function AskPage() {
  const [query, setQuery] = useState("What can I study online with NSFAS or bursary support?");
  const answer = useMemo(() => buildAnswer(query), [query]);

  return (
    <PageShell
      eyebrow="Ask SA Learn"
      title="Ask with cards, not guesses"
      description="Type a study, funding, career or application question. SA Learn will point you to matching records already inside the site."
    >
      <section aria-labelledby="ask-search-heading" className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] md:p-6">
        <h2 id="ask-search-heading" className="text-lg font-semibold tracking-tight text-foreground">
          Ask a question
        </h2>
        <label htmlFor="ask-query" className="mt-4 block text-sm font-medium text-foreground">
          Your question
        </label>
        <div className="mt-2 flex flex-col gap-3 md:flex-row">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-input bg-background px-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              id="ask-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="Example: funding for engineering, NQF 6 careers, fake colleges..."
            />
          </div>
          <a
            href={primaryHref(answer)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Open best path <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" aria-label="Suggested questions">
          {SUGGESTIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setQuery(item)}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section aria-live="polite" className="mb-8 rounded-2xl border border-border bg-muted/35 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">Grounded answer</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{answer.summary}</p>
            <p className="mt-3 text-sm leading-relaxed text-foreground">{answer.nextStep}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="ask-results-heading">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="ask-results-heading" className="text-lg font-semibold tracking-tight text-foreground">
            Matching SA Learn cards
          </h2>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {answer.results.length} results
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {answer.results.map((result) => (
            <article key={result.id} className="flex flex-col rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  <ResultIcon kind={result.kind} />
                  {result.kind}
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">{result.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{result.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {result.meta.map((item) => (
                  <span key={item} className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    {item}
                  </span>
                ))}
              </div>
              {result.trust && <TrustMetadata trust={result.trust} />}
              <a
                href={result.href}
                className="mt-5 inline-flex items-center gap-1 self-start text-sm font-medium text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                View on SA Learn <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

// Codex: Data-first Ask SA Learn guidance
// Status: Deterministic local matching renders SA Learn cards; Groq summaries can attach after grounding.
function buildAnswer(rawQuery: string): AskAnswer {
  const query = rawQuery.trim();
  const intent = detectAskIntent(query);
  const results = hasAskQuerySignal(query) ? selectResults(intent, query) : [];
  const label = intentLabel(intent);

  return {
    intent,
    summary:
      results.length > 0
        ? `I matched your question to ${results.length} ${label} result${results.length === 1 ? "" : "s"} from SA Learn's current records.`
        : "I could not find a strong card match yet, so the safest path is to use the guided matcher.",
    nextStep:
      intent === "match"
        ? "Use Match for subject marks, APS, qualification level and interest checks. This page keeps the answer grounded and sends you to the workflow when rules matter."
        : "Confirm requirements, deadlines, accreditation and funding rules with the official source links before applying or paying.",
    results: results.length > 0 ? results : workflowResults(),
  };
}

function selectResults(intent: AskIntent, query: string): AskResult[] {
  const pools: AskResult[] =
    intent === "match"
      ? workflowResults()
      : intent === "courses"
      ? courseResults(query)
      : intent === "careers"
        ? careerResults(query)
        : intent === "funding"
          ? fundingResults(query)
          : intent === "opportunities"
            ? opportunityResults(query)
            : intent === "guides"
              ? guideResults(query)
              : intent === "skills"
                ? skillResults(query)
                : intent === "institutions"
                  ? institutionResults(query)
                  : mixedResults(query);

  return rankResults(pools, query).slice(0, 6);
}

function courseResults(query: string): AskResult[] {
  const nqf = query.match(/nqf\s*(\d+)/i)?.[1];
  return COURSES.filter((course) => !nqf || String(course.nqf) === nqf).map((course) => ({
    id: `course-${course.slug}`,
    kind: "Course",
    title: course.title,
    description: `${course.qualification} at ${course.institution}.`,
    href: `/courses/${course.slug}`,
    meta: [`NQF ${course.nqf || "not rated"}`, course.city, course.deliveryMode, course.funding],
    trust: course.trust,
  }));
}

function careerResults(query: string): AskResult[] {
  const nqfHint = query.match(/nqf\s*(\d+)/i)?.[1];
  return CAREERS.map((career) => ({
    id: `career-${career.slug}`,
    kind: "Career",
    title: career.title,
    description: career.short,
    href: `/careers/${career.slug}`,
    meta: [career.demand, career.salary, ...(nqfHint ? [`NQF hint ${nqfHint}`] : career.skills.slice(0, 1))],
  }));
}

function fundingResults(query: string): AskResult[] {
  return FUNDING.map((funding) => ({
    id: `funding-${funding.slug}`,
    kind: "Funding",
    title: funding.name,
    description: funding.eligibility,
    href: "/funding",
    meta: [funding.short, funding.coverage, `Deadline: ${funding.deadline}`],
    trust: funding.trust,
  }));
}

function opportunityResults(query: string): AskResult[] {
  return OPPORTUNITIES.map((opportunity) => ({
    id: `opportunity-${opportunity.id}`,
    kind: "Opportunity",
    title: opportunity.title,
    description: `${opportunity.category} in ${opportunity.province}.`,
    href: "/opportunities",
    meta: [opportunity.type, opportunity.sector, `Closes: ${opportunity.closes}`],
    trust: opportunity.trust,
  }));
}

function guideResults(query: string): AskResult[] {
  const glossaryCards = GLOSSARY_TERMS.map((term) => ({
    id: `glossary-${term.term}`,
    kind: "Guide" as const,
    title: term.term,
    description: term.meaning,
    href: `/guides/${term.guideSlug}`,
    meta: ["Glossary", "Plain language"],
  }));

  const guideCards = GUIDES.map((guide) => ({
    id: `guide-${guide.slug}`,
    kind: "Guide" as const,
    title: guide.title,
    description: guide.summary,
    href: `/guides/${guide.slug}`,
    meta: [guide.category, guide.steps ? "How-to" : "Explainer"],
  }));

  return [...guideCards, ...glossaryCards].filter((result) => scoreResult(result, query) > 0);
}

function skillResults(query: string): AskResult[] {
  return SKILLS.map((skill) => ({
    id: `skill-${skill.slug}`,
    kind: "Skill",
    title: skill.name,
    description: skill.practice,
    href: "/skills",
    meta: [skill.diff, skill.time, ...skill.careers.slice(0, 2)],
  }));
}

function institutionResults(query: string): AskResult[] {
  return INSTITUTIONS.map((institution) => ({
    id: `institution-${institution.slug}`,
    kind: "Institution",
    title: institution.name,
    description: institution.accreditationStatus,
    href: `/institutions/${institution.slug}`,
    meta: [institution.type, institution.province, institution.funding],
    trust: institution.trust,
  }));
}

function mixedResults(query: string): AskResult[] {
  return [
    ...courseResults(query).slice(0, 3),
    ...careerResults(query).slice(0, 3),
    ...fundingResults(query).slice(0, 2),
    ...guideResults(query).slice(0, 2),
    ...opportunityResults(query).slice(0, 2),
    ...workflowResults(),
  ];
}

function workflowResults(): AskResult[] {
  return [
    {
      id: "workflow-match",
      kind: "Workflow",
      title: "Check your options",
      description: "Use the guided matcher when APS, subjects, NQF level or qualification fit decides the answer.",
      href: "/match",
      meta: ["Subjects", "APS", "Qualifications"],
    },
  ];
}

function rankResults(results: AskResult[], query: string) {
  return [...results].sort((a, b) => scoreResult(b, query) - scoreResult(a, query));
}

function scoreResult(result: AskResult, query: string) {
  const haystack = `${result.title} ${result.description} ${result.meta.join(" ")}`.toLowerCase();
  return askTokens(query).reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
}

function intentLabel(intent: AskIntent) {
  const labels: Record<AskIntent, string> = {
    courses: "course",
    careers: "career",
    funding: "funding",
    opportunities: "opportunity",
    guides: "guide",
    skills: "skill",
    institutions: "institution",
    match: "workflow",
    general: "mixed",
  };

  return labels[intent];
}

function primaryHref(answer: AskAnswer) {
  return answer.results[0]?.href ?? "/match";
}

function ResultIcon({ kind }: { kind: AskKind }) {
  const className = "h-3.5 w-3.5";

  if (kind === "Course") return <GraduationCap className={className} aria-hidden="true" />;
  if (kind === "Career") return <BriefcaseBusiness className={className} aria-hidden="true" />;
  if (kind === "Funding") return <Landmark className={className} aria-hidden="true" />;
  if (kind === "Guide") return <BookOpen className={className} aria-hidden="true" />;
  return <ListChecks className={className} aria-hidden="true" />;
}
