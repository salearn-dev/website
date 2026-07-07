import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  Mail,
  MessageCircle,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { TrustMetadata } from "@/components/trust-metadata";
import { FUNDING } from "@/lib/data";
import { loadApprovedFunding } from "@/lib/live-catalogue";
import { buildSeoHead } from "@/lib/seo";

type FundingItem = (typeof FUNDING)[number];

export const Route = createFileRoute("/funding")({
  head: () =>
    buildSeoHead({
      title: "Funding - SA Learn",
      description:
        "NSFAS, bursaries, scholarships and learnership funding - eligibility, coverage and deadlines in one place.",
      path: "/funding",
      ogType: "website",
    }),
  component: FundingPage,
});

function FundingPage() {
  const [fundingItems, setFundingItems] = useState<FundingItem[]>(FUNDING);
  const [catalogueSource, setCatalogueSource] = useState<"live" | "static">("static");

  useEffect(() => {
    let alive = true;

    // Codex: Live approved funding-window bridge
    // Status: Reads Lovable Phase 2 approved funding windows and falls back to static prototype data.
    loadApprovedFunding().then((result) => {
      if (!alive) return;
      setFundingItems(result.items);
      setCatalogueSource(result.source);
    });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <PageShell
      eyebrow="How will I pay?"
      title="Funding your studies"
      description="Clear, calm information about NSFAS, bursaries, scholarships and learnership funding - so cost is never the reason you don't apply."
    >
      <NsfasWizard />
      <BursaryMatcher fundingItems={fundingItems} />
      <DeadlineReminderHelper fundingItems={fundingItems} catalogueSource={catalogueSource} />

      <div className="grid gap-4 md:grid-cols-2">
        {fundingItems.map((f) => (
          <article
            key={f.slug}
            className="flex flex-col rounded-2xl border border-border bg-card p-6"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {f.short}
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{f.name}</h3>

            <dl className="mt-5 space-y-3 text-sm">
              <Item label="Eligibility" value={f.eligibility} />
              <Item label="Covers" value={f.coverage} />
              <Item label="Best for" value={f.best} />
            </dl>

            <TrustMetadata trust={f.trust} />

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarClock className="h-3.5 w-3.5" /> {f.deadline}
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

function DeadlineReminderHelper({
  fundingItems,
  catalogueSource,
}: {
  fundingItems: FundingItem[];
  catalogueSource: "live" | "static";
}) {
  // Codex: Funding deadline reminder helper
  // Status: Public email/WhatsApp reminder drafts only; automated delivery remains backend-owned.
  return (
    <section className="mb-8 rounded-2xl border border-border bg-card p-6 md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Deadline reminders
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            Create a reminder draft
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Pick a funding source and open a ready-made email or WhatsApp reminder message. SA Learn
            does not send, store or schedule reminders from this surface.
          </p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
          {catalogueSource === "live" ? "Approved live windows" : "Static fallback"}
        </span>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {fundingItems.map((funding) => {
          const reminderText = `SA Learn reminder: Check ${funding.name} funding deadline (${funding.deadline}). Confirm eligibility and documents on the official source before applying.`;
          const emailHref = `mailto:?subject=${encodeURIComponent(`Reminder: ${funding.name} deadline`)}&body=${encodeURIComponent(reminderText)}`;
          const whatsappHref = `https://wa.me/?text=${encodeURIComponent(reminderText)}`;

          return (
            <article
              key={funding.slug}
              className="rounded-xl border border-border bg-background p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{funding.name}</h3>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                    {funding.deadline}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={emailHref}
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    Email
                  </a>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

const STUDY_AREAS = ["Any", "Teaching", "Engineering", "Science", "Business", "Trades"];
const FUNDING_NEEDS = ["Full funding", "Tuition help", "Stipend / earn while learning"];
const MATCH_INSTITUTION_TYPES = [
  "Any",
  "Public university",
  "Public TVET college",
  "Private provider",
  "Workplace route",
];

function BursaryMatcher({ fundingItems }: { fundingItems: FundingItem[] }) {
  const [studyArea, setStudyArea] = useState("Any");
  const [fundingNeed, setFundingNeed] = useState("Full funding");
  const [institutionType, setInstitutionType] = useState("Any");

  // Codex: Bursary matcher
  // Status: Public client-side matching over prototype funding cards; saved profiles remain backend/POPIA-owned.
  const matches = useMemo(
    () =>
      fundingItems.map((funding) => ({
        funding,
        reasons: getFundingMatchReasons(funding.slug, studyArea, fundingNeed, institutionType),
      }))
        .filter((match) => match.reasons.length > 0)
        .sort((a, b) => b.reasons.length - a.reasons.length),
    [fundingItems, studyArea, fundingNeed, institutionType],
  );

  return (
    <section className="mb-8 rounded-2xl border border-border bg-card p-6 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Public matcher
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            Bursary and funding matcher
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Choose broad study and funding needs to see which prototype funding cards may be worth
            checking. This is a public guide and does not store your profile.
          </p>

          <div className="mt-6 grid gap-3">
            <WizardSelect
              label="Study area"
              value={studyArea}
              onChange={setStudyArea}
              options={STUDY_AREAS}
            />
            <WizardSelect
              label="Funding need"
              value={fundingNeed}
              onChange={setFundingNeed}
              options={FUNDING_NEEDS}
            />
            <WizardSelect
              label="Institution type"
              value={institutionType}
              onChange={setInstitutionType}
              options={MATCH_INSTITUTION_TYPES}
            />
          </div>
        </div>

        <div className="space-y-3">
          {matches.map(({ funding, reasons }) => (
            <article
              key={funding.slug}
              className="rounded-xl border border-border bg-background p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {funding.short}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-foreground">{funding.name}</h3>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                  {reasons.length} match{reasons.length === 1 ? "" : "es"}
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {reasons.map((reason) => (
                  <li key={reason} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Confirm eligibility, deadline and documents on the official source before applying.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function getFundingMatchReasons(
  slug: string,
  studyArea: string,
  fundingNeed: string,
  institutionType: string,
) {
  const reasons: string[] = [];

  if (slug === "nsfas") {
    if (institutionType === "Any" || institutionType.includes("Public")) {
      reasons.push("Fits public university or TVET study routes.");
    }
    if (fundingNeed === "Full funding" || fundingNeed === "Tuition help") {
      reasons.push("May cover tuition and allowances for eligible public study.");
    }
  }

  if (slug === "funza-lushaka") {
    if (studyArea === "Any" || studyArea === "Teaching") {
      reasons.push("Matches teaching-focused study plans.");
    }
    if (institutionType === "Any" || institutionType === "Public university") {
      reasons.push("Usually linked to approved teacher education routes.");
    }
  }

  if (slug === "sasol" || slug === "eskom") {
    if (studyArea === "Any" || studyArea === "Engineering" || studyArea === "Science") {
      reasons.push("Matches engineering or science-focused study interests.");
    }
    if (fundingNeed === "Full funding" || fundingNeed === "Tuition help") {
      reasons.push("May be worth checking for tuition-heavy STEM study costs.");
    }
  }

  if (slug === "seta-learnership") {
    if (studyArea === "Any" || studyArea === "Trades") {
      reasons.push("Matches learnership or practical workplace routes.");
    }
    if (fundingNeed === "Stipend / earn while learning" || institutionType === "Workplace route") {
      reasons.push("Useful when stipend or workplace learning matters.");
    }
  }

  if (slug === "employer") {
    if (institutionType === "Any" || institutionType === "Private provider") {
      reasons.push("May help when public funding is not the right fit.");
    }
    if (studyArea === "Any" || studyArea === "Business" || studyArea === "Engineering") {
      reasons.push("Employer funding can depend on field and company needs.");
    }
  }

  return reasons;
}

function NsfasWizard() {
  const [citizenship, setCitizenship] = useState("South African citizen");
  const [institutionType, setInstitutionType] = useState("Public university");
  const [householdIncome, setHouseholdIncome] = useState("Under R350,000");
  const [qualification, setQualification] = useState("Undergraduate qualification");

  // Codex: NSFAS eligibility wizard
  // Status: Public client-side guidance only; saved profiles and document checks remain backend/POPIA-owned.
  const result = useMemo(() => {
    const isCitizen = citizenship === "South African citizen";
    const isPublic =
      institutionType === "Public university" || institutionType === "Public TVET college";
    const incomeLikely =
      householdIncome === "Under R350,000" || householdIncome === "Disability band under R600,000";
    const isFundableLevel = qualification !== "Private provider course";

    if (isCitizen && isPublic && incomeLikely && isFundableLevel) {
      return {
        tone: "success" as const,
        title: "Likely worth checking NSFAS",
        body: "Your answers fit the broad public NSFAS pathway. This is not approval - confirm the current official rules and apply through NSFAS only.",
        checks: [
          "Public institution route selected.",
          "Income band appears within the prototype NSFAS threshold.",
          "No information is saved by this prototype wizard.",
        ],
      };
    }

    return {
      tone: "warning" as const,
      title: "Needs careful confirmation",
      body: "One or more answers may fall outside the broad NSFAS route. You may still have other funding options, but confirm official NSFAS rules before deciding.",
      checks: [
        isCitizen
          ? "Citizenship answer does not block this prototype check."
          : "NSFAS usually focuses on South African citizens.",
        isPublic
          ? "Institution type appears public."
          : "NSFAS usually funds public universities and TVET colleges.",
        incomeLikely
          ? "Income band may fit the broad threshold."
          : "Income band may be above the broad prototype threshold.",
        isFundableLevel
          ? "Qualification answer may be fundable."
          : "Private provider routes usually need different funding checks.",
      ],
    };
  }, [citizenship, institutionType, householdIncome, qualification]);

  const iconClass =
    result.tone === "success"
      ? "bg-success-soft text-success"
      : "bg-warning-soft text-warning-foreground";
  const Icon = result.tone === "success" ? CheckCircle2 : ShieldAlert;

  return (
    <section className="mb-8 rounded-2xl border border-border bg-card p-6 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Quick public check
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            NSFAS eligibility guide
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Answer broad questions to understand whether NSFAS is worth checking. This does not save
            personal information, request documents or replace official NSFAS decisions.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <WizardSelect
              label="Citizenship"
              value={citizenship}
              onChange={setCitizenship}
              options={["South African citizen", "Permanent resident / other"]}
            />
            <WizardSelect
              label="Institution type"
              value={institutionType}
              onChange={setInstitutionType}
              options={[
                "Public university",
                "Public TVET college",
                "Private provider",
                "Not sure yet",
              ]}
            />
            <WizardSelect
              label="Household income"
              value={householdIncome}
              onChange={setHouseholdIncome}
              options={[
                "Under R350,000",
                "Disability band under R600,000",
                "Above threshold",
                "Not sure",
              ]}
            />
            <WizardSelect
              label="Study route"
              value={qualification}
              onChange={setQualification}
              options={[
                "Undergraduate qualification",
                "TVET programme",
                "Private provider course",
                "Not sure",
              ]}
            />
          </div>
        </div>

        <aside className="rounded-xl border border-border bg-background p-5">
          <span
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${iconClass}`}
          >
            <Icon className="h-4 w-4" />
          </span>
          <h3 className="mt-4 text-base font-semibold text-foreground">{result.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{result.body}</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {result.checks.map((check) => (
              <li key={check} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{check}</span>
              </li>
            ))}
          </ul>
          <a
            href="https://www.nsfas.org.za/"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Check official NSFAS <ArrowRight className="h-4 w-4" />
          </a>
        </aside>
      </div>
    </section>
  );
}

function WizardSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block text-xs">
      <span className="mb-1.5 block font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-foreground">{value}</dd>
    </div>
  );
}
