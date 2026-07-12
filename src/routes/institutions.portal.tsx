import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Landmark, Lock, Send } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";
import {
  prepareInstitutionSubmission,
  type InstitutionDraft,
} from "@/lib/institution-submission";

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
const INITIAL_DRAFT: InstitutionDraft = {
  name: "",
  type: "TVET College",
  province: "",
  website: "",
  accreditationStatus: "Submitted for moderation",
  sourceUrl: "",
};

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
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        const user = sessionData.session?.user;
        if (!user) {
          if (alive) setRoleState("signed-out");
          return;
        }

        const { data, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .in("role", ["institution", "admin"]);

        if (roleError) throw roleError;
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
      const submission = prepareInstitutionSubmission(draft);
      if (!submission.ok) {
        setMessage(submission.error);
        return;
      }

      const { error } = await supabase.from("institutions").insert(submission.data);

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
            required
            maxLength={160}
            autoComplete="organization"
          />
          <Field
            label="Institution type"
            value={draft.type}
            onChange={(type) => setDraft({ ...draft, type })}
            maxLength={80}
          />
          <Field
            label="Province"
            value={draft.province}
            onChange={(province) => setDraft({ ...draft, province })}
            autoComplete="address-level1"
            maxLength={80}
          />
          <Field
            label="Website"
            value={draft.website}
            onChange={(website) => setDraft({ ...draft, website })}
            type="url"
            maxLength={2048}
            autoComplete="url"
          />
          <Field
            label="Accreditation note"
            value={draft.accreditationStatus}
            onChange={(accreditationStatus) => setDraft({ ...draft, accreditationStatus })}
            maxLength={240}
          />
          <Field
            label="Official source URL"
            value={draft.sourceUrl}
            onChange={(sourceUrl) => setDraft({ ...draft, sourceUrl })}
            type="url"
            required
            maxLength={2048}
            autoComplete="url"
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
  type = "text",
  required = false,
  maxLength,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "url";
  required?: boolean;
  maxLength?: number;
  autoComplete?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
    </label>
  );
}
