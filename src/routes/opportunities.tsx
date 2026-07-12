import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, Coins, MapPin, Save } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { TrustMetadata } from "@/components/trust-metadata";
import { supabase } from "@/integrations/supabase/client";
import { OPPORTUNITIES } from "@/lib/data";
import { loadApprovedOpportunities } from "@/lib/live-catalogue";
import { buildSeoHead } from "@/lib/seo";
import { useI18n } from "@/lib/i18n";

type Opportunity = (typeof OPPORTUNITIES)[number];

export const Route = createFileRoute("/opportunities")({
  head: () =>
    buildSeoHead({
      title: "Opportunities - SA Learn",
      description:
        "Real, open opportunities: applications, learnerships, internships, bursaries and entry-level jobs across South Africa.",
      path: "/opportunities",
      ogType: "website",
    }),
  component: OpportunitiesPage,
});

function OpportunitiesPage() {
  const { t } = useI18n();
  const [province, setProvince] = useState("All");
  const [sector, setSector] = useState("All");
  const [type, setType] = useState("All");
  const [savedReminders, setSavedReminders] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [opportunities, setOpportunities] = useState<Opportunity[]>(OPPORTUNITIES);
  const [catalogueSource, setCatalogueSource] = useState<"live" | "static">("static");

  const provinces = useMemo(
    () => ["All", ...unique(opportunities.map((item) => item.province))],
    [opportunities],
  );
  const sectors = useMemo(() => ["All", ...unique(opportunities.map((item) => item.sector))], [opportunities]);
  const types = useMemo(() => ["All", ...unique(opportunities.map((item) => item.type))], [opportunities]);

  // Codex: Opportunity filtering
  // Status: Filters run over approved live rows when available; live ingestion remains backend-owned.
  const filtered = opportunities.filter((item) => {
    const matchesProvince = province === "All" || item.province === province;
    const matchesSector = sector === "All" || item.sector === sector;
    const matchesType = type === "All" || item.type === type;

    return matchesProvince && matchesSector && matchesType;
  });

  function clearFilters() {
    setProvince("All");
    setSector("All");
    setType("All");
  }

  useEffect(() => {
    let alive = true;

    async function loadPageData() {
      try {
        const catalogue = await loadApprovedOpportunities();
        if (!alive) return;
        setOpportunities(catalogue.items);
        setCatalogueSource(catalogue.source);

        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData.session?.user;
        if (!user) return;

        const { data } = await supabase
          .from("deadline_reminders")
          .select("item_slug, channel, remind_at")
          .eq("user_id", user.id)
          .eq("item_type", "opportunity")
          .eq("status", "pending");

        if (!alive) return;
        setSavedReminders(
          Object.fromEntries(
            (data ?? []).map((item) => [
              item.item_slug,
              `${item.channel} reminder set for ${new Date(item.remind_at).toLocaleDateString("en-ZA")}`,
            ]),
          ),
        );
      } catch {
        if (alive) setSaveMessage("Sign in from Account to save opportunity reminders.");
      }
    }

    loadPageData();
    return () => {
      alive = false;
    };
  }, []);

  // Codex: Saved opportunity deadline reminders
  // Status: Creates learner-owned pending records in public.deadline_reminders; delivery workers remain backend-owned.
  async function saveReminder(id: string, title: string, closes: string) {
    setSavingId(id);
    setSaveMessage("");

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        setSaveMessage("Sign in from Account to save opportunity reminders.");
        return;
      }

      const remindAt = reminderDateFromDeadline(closes);
      const { error } = await supabase.from("deadline_reminders").upsert(
        {
          user_id: user.id,
          item_type: "opportunity",
          item_slug: id,
          channel: "email",
          remind_at: remindAt.toISOString(),
          status: "pending",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,item_type,item_slug,channel" },
      );
      if (error) throw error;

      setSavedReminders((current) => ({
        ...current,
        [id]: `email reminder set for ${remindAt.toLocaleDateString("en-ZA")}`,
      }));
      setSaveMessage(`Saved reminder for ${title}.`);
    } catch {
      setSaveMessage("Reminder could not be saved yet. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <PageShell
      eyebrow={t("route.opportunities.eyebrow")}
      title={t("route.opportunities.title")}
      description={t("route.opportunities.description")}
    >
      <div className="mb-8 rounded-2xl border border-border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <FilterSelect
            label="Province"
            value={province}
            onChange={setProvince}
            options={provinces}
          />
          <FilterSelect label="Sector" value={sector} onChange={setSector} options={sectors} />
          <FilterSelect label="Type" value={type} onChange={setType} options={types} />
          <div className="flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Clear filters
            </button>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
          Showing <span className="font-medium text-foreground">{filtered.length}</span> of{" "}
          {opportunities.length} {catalogueSource === "live" ? "approved live" : "curated"} opportunities.{" "}
          {saveMessage || "Signed-in learners can save reminder intent for deadlines."}
        </p>
      </div>

      <div className="divide-y divide-border rounded-2xl border border-border bg-card">
        {filtered.map((o) => (
          <article
            key={o.id}
            className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {o.type} - {o.sector}
              </p>
              <h3 className="mt-1 text-base font-semibold text-foreground">{o.title}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {o.province}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="h-3.5 w-3.5" /> Closes {o.closes}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Coins className="h-3.5 w-3.5" /> {o.paid ? "Paid / stipend" : "No stipend"}
                </span>
              </div>
              <TrustMetadata trust={o.trust} />
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              <button
                type="button"
                onClick={() => saveReminder(o.id, o.title, o.closes)}
                disabled={savingId === o.id}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
              >
                {savedReminders[o.id] ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {savedReminders[o.id] ? "Reminder saved" : "Save reminder"}
              </button>
              <a
                href={o.trust.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Apply
              </a>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="p-6 text-sm text-muted-foreground">
            No opportunities match these filters yet. Clear filters or try a broader
            option.
          </div>
        )}
      </div>
    </PageShell>
  );
}

function reminderDateFromDeadline(deadline: string) {
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

function unique(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function FilterSelect({
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
