import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Database,
  ExternalLink,
  Lock,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Table,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";
import {
  canMarkVerified,
  CATALOGUE_TABLES,
  moderationSelectColumns,
  type CatalogueTable,
} from "@/lib/catalogue-moderation";

type TableStats = {
  name: string;
  rowCount: number;
  verified: number;
  provisional: number;
  unverified: number;
  stale: number;
};

type SecretsStatus = {
  url: string | null;
  projectId: string | null;
  configured: boolean;
};

type AccessState = "checking" | "signed-out" | "forbidden" | "admin";
type ModerationRow = {
  id: string;
  label: string;
  sourceUrl: string | null;
  verificationStatus: string;
};
type RawModerationRow = {
  id: string | number;
  name?: string | null;
  title?: string | null;
  source_url?: string | null;
  verification_status?: string | null;
};
type QueryResult<T> = {
  data: T[] | null;
  count: number | null;
  error: Error | null;
};
type CatalogueSelectBuilder<T> = PromiseLike<QueryResult<T>> & {
  eq: (column: string, value: string) => CatalogueSelectBuilder<T>;
  in: (column: string, values: string[]) => CatalogueSelectBuilder<T>;
  limit: (count: number) => Promise<QueryResult<T>>;
};
type CatalogueUpdateBuilder = {
  eq: (column: string, value: string) => Promise<{ error: Error | null }>;
};
type CatalogueTableClient = {
  select: <T = Record<string, unknown>>(
    columns: string,
    options?: { count?: "exact"; head?: boolean },
  ) => CatalogueSelectBuilder<T>;
  update: (payload: Record<string, unknown>) => CatalogueUpdateBuilder;
};
type CatalogueClient = {
  from: (table: CatalogueTable) => CatalogueTableClient;
};

export const Route = createFileRoute("/admin/data")({
  head: () => ({
    meta: [
      { title: "Data Manager - SA Learn Admin" },
      {
        name: "description",
        content: "Admin interface for SA Learn verified catalogue data management.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DataManagerPage,
});

function DataManagerPage() {
  const [secrets, setSecrets] = useState<SecretsStatus>({
    url: null,
    projectId: null,
    configured: false,
  });
  const [tables, setTables] = useState<TableStats[]>([]);
  const [accessState, setAccessState] = useState<AccessState>("checking");
  const [selectedTable, setSelectedTable] = useState<CatalogueTable>("institutions");
  const [moderationRows, setModerationRows] = useState<ModerationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [moderationLoading, setModerationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moderationMessage, setModerationMessage] = useState("");
  const catalogueClient = supabase as unknown as CatalogueClient;

  useEffect(() => {
    checkAccessAndLoad();
    // Admin access should be checked once on mount; refresh button handles later reloads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (accessState === "admin") loadModerationRows(selectedTable);
    // Moderation rows should reload only when the selected table or access state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessState, selectedTable]);

  async function checkAccessAndLoad() {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const user = sessionData.session?.user;
      if (!user) {
        setAccessState("signed-out");
        setLoading(false);
        return;
      }

      const { data: roles, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");

      if (roleError) throw roleError;
      if (!roles || roles.length === 0) {
        setAccessState("forbidden");
        setLoading(false);
        return;
      }

      setAccessState("admin");
      await loadData();
    } catch {
      setAccessState("forbidden");
      setLoading(false);
    }
  }

  async function loadData() {
    setLoading(true);
    setError(null);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;

    setSecrets({
      url: supabaseUrl || null,
      projectId: projectId || null,
      configured: !!supabaseUrl,
    });

    try {
      const stats = await Promise.all(CATALOGUE_TABLES.map((table) => fetchTableStats(table)));
      setTables(stats);
    } catch {
      setError("Table statistics could not be loaded. Please retry.");
    }

    setLoading(false);
  }

  async function fetchTableStats(tableName: string): Promise<TableStats> {
    const table = tableName as CatalogueTable;
    const { count: rowCount, error: countError } = await catalogueClient
      .from(table)
      .select("*", { count: "exact", head: true });

    if (countError) {
      return { name: tableName, rowCount: 0, verified: 0, provisional: 0, unverified: 0, stale: 0 };
    }

    const { count: verified } = await catalogueClient
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "verified");

    const { count: provisional } = await catalogueClient
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "provisional");

    const { count: unverified } = await catalogueClient
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "unverified");

    const { count: stale } = await catalogueClient
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "stale");

    return {
      name: tableName,
      rowCount: rowCount || 0,
      verified: verified || 0,
      provisional: provisional || 0,
      unverified: unverified || 0,
      stale: stale || 0,
    };
  }

  // Codex: Admin moderation workflow
  // Status: Admin-role users can review catalogue records and update verification status through Phase 2 RLS.
  async function loadModerationRows(tableName: CatalogueTable) {
    setModerationLoading(true);
    setModerationMessage("");

    try {
      const { data, error: loadError } = await catalogueClient
        .from(tableName)
        .select<RawModerationRow>(
          moderationSelectColumns(tableName),
        )
        .in("verification_status", ["unverified", "provisional", "stale"])
        .limit(8);

      if (loadError) throw loadError;

      setModerationRows(
        (data ?? []).map((row) => ({
          id: String(row.id),
          label: String(row.name ?? row.title ?? "Untitled record"),
          sourceUrl: row.source_url ? String(row.source_url) : null,
          verificationStatus: String(row.verification_status ?? "unverified"),
        })),
      );
    } catch {
      setModerationRows([]);
      setModerationMessage("Moderation queue could not load for this table.");
    } finally {
      setModerationLoading(false);
    }
  }

  async function updateVerificationStatus(row: ModerationRow, status: "verified" | "stale") {
    setModerationMessage("");

    if (status === "verified" && !canMarkVerified(row.sourceUrl)) {
      setModerationMessage("Add a valid HTTPS source URL before marking this record verified.");
      return;
    }

    try {
      const { error: updateError } = await catalogueClient
        .from(selectedTable)
        .update({
          verification_status: status,
          ...(status === "verified" ? { last_verified_at: new Date().toISOString() } : {}),
        })
        .eq("id", row.id);

      if (updateError) throw updateError;

      setModerationRows((current) => current.filter((item) => item.id !== row.id));
      setModerationMessage(`${row.label} marked ${status}.`);
      loadData();
    } catch {
      setModerationMessage("Status update failed. Confirm admin role and RLS policy.");
    }
  }

  const totalRecords = tables.reduce((sum, t) => sum + t.rowCount, 0);
  const totalVerified = tables.reduce((sum, t) => sum + t.verified, 0);
  const totalProvisional = tables.reduce((sum, t) => sum + t.provisional, 0);
  const totalUnverified = tables.reduce((sum, t) => sum + t.unverified, 0);
  const totalStale = tables.reduce((sum, t) => sum + t.stale, 0);

  if (accessState !== "admin") {
    return (
      <PageShell
        eyebrow="Admin / Data Manager"
        title="Verified catalogue data"
        description="Admin-only catalogue statistics and moderation tools."
      >
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {accessState === "checking" ? "Checking admin access..." : "Admin access required"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                This surface shows catalogue statistics and moderation actions, so it is gated by
                the `admin` role in `user_roles`.
              </p>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Admin / Data Manager"
      title="Verified catalogue data"
      description="Database connection settings and table statistics for the SA Learn verified catalogue."
    >
      {error && (
        <div className="mb-6 rounded-2xl border border-warning/30 bg-warning-soft p-4 text-sm text-warning-foreground">
          <AlertCircle className="mr-2 inline h-4 w-4" aria-hidden="true" />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Supabase Connection</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Environment secrets are pre-configured via Lovable Cloud.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Project ID
              </p>
              <p className="mt-1 font-mono text-sm text-foreground">
                {secrets.projectId || "Not configured"}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Supabase URL
              </p>
              <p className="mt-1 font-mono text-sm text-foreground break-all">
                {secrets.url || "Not configured"}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Environment Variables
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  "VITE_SUPABASE_URL",
                  "VITE_SUPABASE_PUBLISHABLE_KEY",
                  "VITE_SUPABASE_PROJECT_ID",
                ].map((key) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-md bg-success/10 px-2.5 py-1 text-xs font-medium text-success"
                  >
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    {key}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {secrets.projectId && (
            <a
              href={`https://supabase.com/dashboard/project/${secrets.projectId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Open Supabase Dashboard
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </section>

        <section className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <Database className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Catalogue Overview</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {loading
                      ? "Loading..."
                      : `${totalRecords.toLocaleString()} records across ${tables.length} tables`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={loadData}
                disabled={loading}
                aria-label={loading ? "Refreshing data…" : "Refresh table statistics"}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                )}
                Refresh
              </button>
            </div>

            {!loading && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatusCard label="Verified" count={totalVerified} tone="success" />
                <StatusCard label="Provisional" count={totalProvisional} tone="primary" />
                <StatusCard label="Unverified" count={totalUnverified} tone="warning" />
                <StatusCard label="Stale" count={totalStale} tone="muted" />
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card">
            <header className="flex items-center gap-3 border-b border-border px-6 py-4">
              <Table className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-foreground">Table Statistics</h2>
            </header>

            {loading ? (
              <div role="status" className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Loading table statistics...
              </div>
            ) : (
              <div className="divide-y divide-border">
                {tables.map((table) => (
                  <div key={table.name} className="px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-mono text-sm font-medium text-foreground">
                          {table.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {table.rowCount.toLocaleString()} records
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {table.verified > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-1 font-medium text-success">
                            {table.verified} verified
                          </span>
                        )}
                        {table.provisional > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 font-medium text-primary">
                            {table.provisional} provisional
                          </span>
                        )}
                        {table.unverified > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-warning/10 px-2 py-1 font-medium text-warning-foreground">
                            {table.unverified} unverified
                          </span>
                        )}
                        {table.stale > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 font-medium text-muted-foreground">
                            {table.stale} stale
                          </span>
                        )}
                        {table.rowCount === 0 && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-muted-foreground">
                            Empty
                          </span>
                        )}
                      </div>
                    </div>
                    {table.rowCount > 0 && (
                      <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-muted">
                        {table.verified > 0 && (
                          <div
                            className="bg-success"
                            style={{ width: `${(table.verified / table.rowCount) * 100}%` }}
                          />
                        )}
                        {table.provisional > 0 && (
                          <div
                            className="bg-primary"
                            style={{ width: `${(table.provisional / table.rowCount) * 100}%` }}
                          />
                        )}
                        {table.unverified > 0 && (
                          <div
                            className="bg-warning"
                            style={{ width: `${(table.unverified / table.rowCount) * 100}%` }}
                          />
                        )}
                        {table.stale > 0 && (
                          <div
                            className="bg-muted-foreground/30"
                            style={{ width: `${(table.stale / table.rowCount) * 100}%` }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card">
            <header className="flex flex-col gap-3 border-b border-border px-6 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Moderation Queue</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review provisional, unverified and stale catalogue records.
                </p>
              </div>
              <label className="text-xs font-medium text-muted-foreground">
                Table
                <select
                  value={selectedTable}
                  onChange={(event) => setSelectedTable(event.target.value as CatalogueTable)}
                  className="ml-2 h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground"
                >
                  {CATALOGUE_TABLES.map((table) => (
                    <option key={table}>{table}</option>
                  ))}
                </select>
              </label>
            </header>

            <div className="divide-y divide-border">
              {moderationLoading ? (
                <div className="px-6 py-8 text-sm text-muted-foreground">
                  Loading moderation queue...
                </div>
              ) : moderationRows.length > 0 ? (
                moderationRows.map((row) => (
                  <article
                    key={row.id}
                    className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-medium text-foreground">{row.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {row.verificationStatus}{" "}
                        {row.sourceUrl ? `- ${row.sourceUrl}` : "- no source URL"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => updateVerificationStatus(row, "verified")}
                        disabled={!canMarkVerified(row.sourceUrl)}
                        title={!canMarkVerified(row.sourceUrl) ? "A valid HTTPS source URL is required" : undefined}
                        className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Mark verified
                      </button>
                      <button
                        type="button"
                        onClick={() => updateVerificationStatus(row, "stale")}
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground hover:bg-muted"
                      >
                        Mark stale
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="px-6 py-8 text-sm text-muted-foreground">
                  No pending records for this table.
                </div>
              )}
            </div>
            {moderationMessage && (
              <p
                className="border-t border-border px-6 py-4 text-sm text-muted-foreground"
                aria-live="polite"
              >
                {moderationMessage}
              </p>
            )}
          </section>
        </section>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-muted/35 p-5 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Bolt Data Aggregation Model</p>
        <p className="mt-2">
          Verified catalogue tables seeded from curated baseline data in{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">src/lib/data.ts</code>.
          All records include source tracking and verification status. Admin write access gated by{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">user_roles</code>{" "}
          table.
        </p>
      </div>
    </PageShell>
  );
}

function StatusCard({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "success" | "primary" | "warning" | "muted";
}) {
  const toneClasses = {
    success: "text-success",
    primary: "text-primary",
    warning: "text-warning-foreground",
    muted: "text-muted-foreground",
  };

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${toneClasses[tone]}`}>{count.toLocaleString()}</p>
    </div>
  );
}
