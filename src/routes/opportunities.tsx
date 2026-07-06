import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarClock, MapPin, Coins } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { TrustMetadata } from "@/components/trust-metadata";
import { OPPORTUNITIES } from "@/lib/data";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunities - SA Learn" },
      {
        name: "description",
        content:
          "Real, open opportunities: applications, learnerships, internships, bursaries and entry-level jobs across South Africa.",
      },
    ],
  }),
  component: OpportunitiesPage,
});

function OpportunitiesPage() {
  const [province, setProvince] = useState("All");
  const [sector, setSector] = useState("All");
  const [type, setType] = useState("All");

  const provinces = useMemo(
    () => ["All", ...unique(OPPORTUNITIES.map((item) => item.province))],
    [],
  );
  const sectors = useMemo(() => ["All", ...unique(OPPORTUNITIES.map((item) => item.sector))], []);
  const types = useMemo(() => ["All", ...unique(OPPORTUNITIES.map((item) => item.type))], []);

  // Codex: Opportunity filtering
  // Status: Client-side prototype filters by province, sector and type; live ingestion remains backend-owned.
  const filtered = OPPORTUNITIES.filter((item) => {
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

  return (
    <PageShell
      eyebrow="What can I apply for right now?"
      title="Open opportunities"
      description="Real listings with real deadlines. Filter by province, sector and opportunity type."
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
          {OPPORTUNITIES.length} prototype opportunities.
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
            <button
              type="button"
              className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Apply
            </button>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="p-6 text-sm text-muted-foreground">
            No prototype opportunities match these filters yet. Clear filters or try a broader
            option.
          </div>
        )}
      </div>
    </PageShell>
  );
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
