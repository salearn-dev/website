import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Landmark, Lock, Send } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/institutions/portal")({
  head: () => ({
    meta: [
      { title: "Institution Portal - SA Learn" },
      {
        name: "description",
        content:
          "Role-gated institution self-serve portal for submitting provisional SA Learn catalogue updates.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: InstitutionPortalPage,
});

type RoleState = "checking" | "signed-out" | "not-institution" | "ready";
type InstitutionDraft = {
  name: string;
  type: string;
  province: string;
  website: string;
  accreditationStatus: string;
  sourceUrl: string;
};

type CatalogueClient = {
  from: (table: "institutions") => {
    insert: (payload: Record<string, unknown>) => Promise<{ error: Error | null }>;
  };
};

const INITIAL_DRAFT: InstitutionDraft = {
  name: "",
  type: "TVET College",
  province: "",
  website: "",
  accreditationStatus: "Submitted for moderation",
  sourceUrl: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Codex: Institution self-serve portal
// Status: Institution-role users can submit provisional records; admin approval remains in /admin/data.
function InstitutionPortalPage() {
  const [roleState, setRoleState] = useState<RoleState>("checking");
  const [draft, setDraft] = useState<InstitutionDraft>(INITIAL_DRAFT);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let alive = true;

    async function checkRole() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData.session?.user;
        if (!user) {
          if (alive) setRoleState("signed-out");
          return;
        }

        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .in("role", ["institution", "admin"]);

        if (!alive) return;
        setRoleState(data && data.length > 0 ? "ready" : "not-institution");
      } catch {
        if (alive) setRoleState("not-institution");
      }
    }

    checkRole();
    return () => {
      alive = false;
    };
  }, []);

  async function submitDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const slug = slugify(draft.name);
      if (!slug) {
        setMessage("Institution name is required.");
        return;
      }

      const catalogueClient = supabase as unknown as CatalogueClient;
      const { error } = await catalogueClient.from("institutions").insert({
        slug,
        name: draft.name,
        type: draft.type,
        province: draft.province || null,
        website: draft.website || null,
        accreditation_status: draft.accreditationStatus,
        source_url: draft.sourceUrl || draft.website || null,
        source_name: draft.name,
        verification_status: "provisional",
        status: "under_review",
      });

      if (error) throw error;

      setDraft(INITIAL_DRAFT);
      setMessage("Submitted for admin moderation.");
    } catch {
      setMessage("Submission could not be saved. Confirm your role and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (roleState !== "ready") {
    return (
      <PageShell
        eyebrow="Institution access"
        title="Institution portal"
        description="Submit catalogue updates once your account has an institution or admin role."
      >
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {roleState === "checking" ? "Checking access..." : "Role-gated access"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {roleState === "signed-out"
                  ? "Sign in first, then return here after your institution role is assigned."
                  : "This portal is limited to institution and admin users so public catalogue changes remain moderated."}
              </p>
              <Link
                to="/account"
                className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Open account
              </Link>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Institution self-serve"
      title="Submit institution updates"
      description="Institution-role users can submit provisional catalogue updates for admin moderation before public trust badges change."
    >
      <form onSubmit={submitDraft} className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-muted text-foreground">
            <Landmark className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Provisional institution record
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Submissions are saved as under review and must be moderated before they become
              trusted.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field
            label="Institution name"
            value={draft.name}
            onChange={(name) => setDraft({ ...draft, name })}
          />
          <Field
            label="Institution type"
            value={draft.type}
            onChange={(type) => setDraft({ ...draft, type })}
          />
          <Field
            label="Province"
            value={draft.province}
            onChange={(province) => setDraft({ ...draft, province })}
          />
          <Field
            label="Website"
            value={draft.website}
            onChange={(website) => setDraft({ ...draft, website })}
          />
          <Field
            label="Accreditation note"
            value={draft.accreditationStatus}
            onChange={(accreditationStatus) => setDraft({ ...draft, accreditationStatus })}
          />
          <Field
            label="Official source URL"
            value={draft.sourceUrl}
            onChange={(sourceUrl) => setDraft({ ...draft, sourceUrl })}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {message || "Only submit information that can be checked against an official source."}
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {message.startsWith("Submitted") ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {submitting ? "Submitting..." : "Submit for review"}
          </button>
        </div>
      </form>
    </PageShell>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
    </label>
  );
}
