import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  Mail,
  MessageCircle,
  UploadCloud,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { TrustMetadata } from "@/components/trust-metadata";
import { supabase } from "@/integrations/supabase/client";
import { FUNDING } from "@/lib/data";
import { loadApprovedFunding } from "@/lib/live-catalogue";
import { evaluateNsfasAnswers, getFundingMatchReasons } from "@/lib/funding-guidance";
import { buildSeoHead } from "@/lib/seo";
import { useI18n } from "@/lib/i18n";
import { learnerDocumentPath, validateLearnerDocument } from "@/lib/learner-document";

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
  const { t } = useI18n();
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
      eyebrow={t("route.funding.eyebrow")}
      title={t("route.funding.title")}
      description={t("route.funding.description")}
    >
      <NsfasWizard />
      <BursaryMatcher fundingItems={fundingItems} />
      <DeadlineReminderHelper fundingItems={fundingItems} catalogueSource={catalogueSource} />
      <DocumentUploadConsent />

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

function DocumentUploadConsent() {
  const [documentType, setDocumentType] = useState("transcript");
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "uploading" | "uploaded" | "error">("idle");
  const [message, setMessage] = useState("");

  // Codex: POPIA-aware learner document upload
  // Status: Uploads to a private owner-scoped Supabase bucket and records consent metadata.
  async function uploadDocument() {
    setMessage("");

    if (!file || !consent) {
      setState("error");
      setMessage("Choose a document and confirm consent before uploading.");
      return;
    }

    const validation = validateLearnerDocument(file);
    if (!validation.ok) {
      setState("error");
      setMessage(validation.error);
      return;
    }

    setState("uploading");
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        setState("error");
        setMessage("Sign in from Account before uploading sensitive documents.");
        return;
      }

      const path = learnerDocumentPath(
        user.id,
        documentType,
        validation.safeName,
        Date.now(),
      );
      const { error: uploadError } = await supabase.storage
        .from("learner-documents")
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { error: consentError } = await supabase.from("consent_records").insert({
        user_id: user.id,
        consent_type: "learner_document_storage",
        consent_version: "2026-07-07",
        granted: true,
        context: {
          document_type: documentType,
          file_path: path,
          mime_type: file.type,
          size_bytes: file.size,
        },
      });

      if (consentError) throw consentError;

      setState("uploaded");
      setMessage("Document uploaded to your private learner document vault.");
      setFile(null);
    } catch {
      setState("error");
      setMessage("Document upload failed. Please try again later.");
    }
  }

  return (
    <section className="mb-8 rounded-2xl border border-border bg-card p-6 md:p-8">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            POPIA consent
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            Upload funding documents safely
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Signed-in learners can upload a transcript, ID copy or supporting document to a private
            owner-scoped storage bucket. SA Learn records consent before the file is accepted.
          </p>
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-background p-4">
          <WizardSelect
            label="Document type"
            value={documentType}
            onChange={setDocumentType}
            options={["transcript", "id", "proof_of_residence", "other"]}
          />
          <label className="block text-xs">
            <span className="mb-1.5 block font-medium text-muted-foreground">Document file</span>
            <input
              type="file"
              accept=".pdf,image/png,image/jpeg,image/webp"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-input"
            />
            <span>
              I consent to SA Learn storing this document privately for funding/application support.
              I understand uploads are not sent to NSFAS or any institution automatically.
            </span>
          </label>
          <button
            type="button"
            onClick={uploadDocument}
            disabled={state === "uploading" || !file || !consent}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            <UploadCloud className="h-4 w-4" aria-hidden="true" />
            {state === "uploading" ? "Uploading..." : "Upload document"}
          </button>
          {message && (
            <p
              className={`text-sm ${state === "uploaded" ? "text-success" : "text-muted-foreground"}`}
              aria-live="polite"
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function DeadlineReminderHelper({
  fundingItems,
  catalogueSource,
}: {
  fundingItems: FundingItem[];
  catalogueSource: "live" | "static";
}) {
  const [saved, setSaved] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Codex: Funding deadline reminder helper
  // Status: Saves pending email/WhatsApp reminder records; delivery workers remain backend-owned.
  async function saveFundingReminder(funding: FundingItem, channel: "email" | "whatsapp") {
    const key = `${funding.slug}-${channel}`;
    setSavingKey(key);
    setMessage("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        setMessage("Sign in from Account to save funding deadline reminders.");
        return;
      }

      const remindAt = fundingReminderDateFromDeadline(funding.deadline);
      const { error } = await supabase.from("deadline_reminders").upsert(
        {
          user_id: user.id,
          item_type: "funding",
          item_slug: funding.slug,
          channel,
          remind_at: remindAt.toISOString(),
          status: "pending",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,item_type,item_slug,channel" },
      );
      if (error) throw error;

      setSaved((current) => ({
        ...current,
        [key]: `${channel} reminder saved for ${remindAt.toLocaleDateString("en-ZA")}`,
      }));
      setMessage(`Saved ${channel} reminder for ${funding.name}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Reminder could not be saved.");
    } finally {
      setSavingKey(null);
    }
  }

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
            Pick a funding source to save a pending email or WhatsApp reminder record. You can also
            open a ready-made message immediately while delivery workers are being hardened.
          </p>
          {message && (
            <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
              {message}
            </p>
          )}
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
                  <button
                    type="button"
                    onClick={() => saveFundingReminder(funding, "email")}
                    disabled={savingKey === `${funding.slug}-email`}
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    {saved[`${funding.slug}-email`] ? "Email saved" : "Save email"}
                  </button>
                  <button
                    type="button"
                    onClick={() => saveFundingReminder(funding, "whatsapp")}
                    disabled={savingKey === `${funding.slug}-whatsapp`}
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    {saved[`${funding.slug}-whatsapp`] ? "WhatsApp saved" : "Save WhatsApp"}
                  </button>
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

function fundingReminderDateFromDeadline(deadline: string) {
  const parsed = Date.parse(deadline);
  if (Number.isNaN(parsed)) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 30);
    return fallback;
  }

  const date = new Date(parsed);
  date.setDate(date.getDate() - 7);
  return date;
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
  const [profileState, setProfileState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [profileMessage, setProfileMessage] = useState("");

  // Codex: Bursary matcher
  // Status: Rules-based matching can save broad funding preferences to learner_details under RLS.
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

  async function saveMatcherProfile() {
    setProfileState("saving");
    setProfileMessage("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        setProfileState("error");
        setProfileMessage("Sign in from Account to save this funding profile.");
        return;
      }

      const budgetMaxPerYear =
        fundingNeed === "Full funding" ? 0 : fundingNeed === "Tuition help" ? 45_000 : 20_000;
      const { error } = await supabase.from("learner_details").upsert(
        {
          user_id: user.id,
          interests: studyArea === "Any" ? [] : [studyArea],
          budget_max_per_year: budgetMaxPerYear,
          preferred_study_mode: institutionType,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      if (error) throw error;
      setProfileState("saved");
      setProfileMessage("Saved broad funding preferences to your learner profile.");
    } catch (error) {
      setProfileState("error");
      setProfileMessage(error instanceof Error ? error.message : "Funding profile could not be saved.");
    }
  }

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
            Choose broad study and funding needs to see which funding options may be worth
            checking. Signed-in learners can save these broad preferences to their learner profile.
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
          <button
            type="button"
            onClick={saveMatcherProfile}
            disabled={profileState === "saving"}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {profileState === "saving" ? "Saving..." : "Save matcher profile"}
          </button>
          {profileMessage && (
            <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
              {profileMessage}
            </p>
          )}
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

function NsfasWizard() {
  const [citizenship, setCitizenship] = useState("South African citizen");
  const [institutionType, setInstitutionType] = useState("Public university");
  const [householdIncome, setHouseholdIncome] = useState("Under R350,000");
  const [qualification, setQualification] = useState("Undergraduate qualification");

  const result = useMemo(
    () =>
      evaluateNsfasAnswers({
        citizenship,
        institutionType,
        householdIncome,
        qualification,
      }),
    [citizenship, institutionType, householdIncome, qualification],
  );

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
