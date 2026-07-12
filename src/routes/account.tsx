import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookmarkCheck,
  KeyRound,
  Loader2,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { buildSeoHead } from "@/lib/seo";
import {
  accountRedirectUrl,
  enabledAuthProviders,
  type AuthProvider,
} from "@/lib/auth-policy";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type LearnerDetails = Database["public"]["Tables"]["learner_details"]["Row"];
type SavedItem = Database["public"]["Tables"]["saved_items"]["Row"];
type Role = Database["public"]["Tables"]["user_roles"]["Row"];

const AUTH_PROVIDERS = enabledAuthProviders(import.meta.env.VITE_ENABLE_APPLE_AUTH === "true");

export const Route = createFileRoute("/account")({
  head: () =>
    buildSeoHead({
      title: "Account - SA Learn",
      description: "SA Learn account foundation for learner profiles, saved items and role-aware access.",
      path: "/account",
      robots: "noindex, nofollow",
    }),
  component: AccountPage,
});

function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [learnerDetails, setLearnerDetails] = useState<LearnerDetails | null>(null);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Codex: Phase 1 account foundation surface
  // Status: Reads auth/profile/saved contract only; profile writes and catalogue saves wait for Phase 2 verified data.
  useEffect(() => {
    let mounted = true;

    async function initialiseAccount() {
      setLoading(true);
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (!mounted) return;

      if (sessionError) {
        setError("The account session could not be checked. Please refresh and try again.");
        setLoading(false);
        return;
      }

      const user = data.session?.user;
      setUserEmail(user?.email ?? null);
      setUserId(user?.id ?? null);

      if (user) {
        await loadAccountData(user.id);
      }

      if (mounted) setLoading(false);
    }

    initialiseAccount();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setUserEmail(user?.email ?? null);
      setUserId(user?.id ?? null);
      setNotice(null);
      setError(null);

      if (user) {
        loadAccountData(user.id);
      } else {
        setProfile(null);
        setLearnerDetails(null);
        setSavedItems([]);
        setRoles([]);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function loadAccountData(id: string) {
    const [profileResult, learnerResult, savedResult, rolesResult] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
      supabase.from("learner_details").select("*").eq("user_id", id).maybeSingle(),
      supabase
        .from("saved_items")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*").eq("user_id", id),
    ]);

    setProfile(profileResult.data ?? null);
    setLearnerDetails(learnerResult.data ?? null);
    setSavedItems(savedResult.data ?? []);
    setRoles(rolesResult.data ?? []);

    const firstError =
      profileResult.error ?? learnerResult.error ?? savedResult.error ?? rolesResult.error;

    if (firstError) {
      setError("Some account information could not be loaded. Please refresh and try again.");
    }
  }

  async function sendMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthLoading(true);
    setNotice(null);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: accountRedirectUrl(window.location.origin),
      },
    });

    if (signInError) {
      setError("The sign-in link could not be sent. Please try again later.");
    } else {
      setNotice("Check your email for the SA Learn sign-in link.");
    }

    setAuthLoading(false);
  }

  // Codex: OAuth provider entry points
  // Google routes through the Lovable broker (iframe-safe web_message flow).
  async function signInWithProvider(provider: AuthProvider) {
    setAuthLoading(true);
    setNotice(null);
    setError(null);

    if (provider === "google") {
      const { lovable } = await import("@/integrations/lovable");
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result?.error) {
        setError("Google sign-in is unavailable. Please try again later.");
      }
      setAuthLoading(false);
      return;
    }

    const { error: providerError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: accountRedirectUrl(window.location.origin) },
    });

    if (providerError) {
      setError("This sign-in provider is unavailable. Please try again later.");
      setAuthLoading(false);
    }
  }

  async function signOut() {
    setAuthLoading(true);
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError("Sign-out could not be completed. Please try again.");
    }
    setAuthLoading(false);
  }

  const learnerSummary = useMemo(() => {
    if (!learnerDetails) return null;

    return [
      ["APS", learnerDetails.aps ?? "Not saved yet"],
      ["Maths", learnerDetails.maths_mark ?? "Not saved yet"],
      ["English", learnerDetails.english_mark ?? "Not saved yet"],
      ["NBT completed", learnerDetails.nbt_completed ? "Yes" : "No"],
      ["Preferred study mode", learnerDetails.preferred_study_mode ?? "Not saved yet"],
      ["Preferred delivery", learnerDetails.preferred_delivery_mode ?? "Not saved yet"],
    ];
  }, [learnerDetails]);

  return (
    <PageShell
      eyebrow="Phase 1 account foundation"
      title="Your SA Learn account"
      description="Lovable's auth, role, profile and saved-item foundation is live. This page reads the contract safely while catalogue saves and profile editing wait for verified Phase 2 data."
    >
      {notice && <Alert tone="success" message={notice} />}
      {error && <Alert tone="warning" message={error} />}

      {loading ? (
        <div role="status" className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          <Loader2 className="mr-2 inline h-4 w-4 animate-spin" aria-hidden="true" />
          Checking account session...
        </div>
      ) : userId ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Signed in
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                  {profile?.display_name || userEmail || "Learner account"}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Profile and default learner role are auto-provisioned on signup.
                </p>
              </div>
              <button
                type="button"
                onClick={signOut}
                disabled={authLoading}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <InfoCard icon={UserRound} label="Email" value={userEmail ?? "Hidden"} />
              <InfoCard
                icon={ShieldCheck}
                label="Roles"
                value={roles.length ? roles.map((role) => role.role).join(", ") : "learner"}
              />
              <InfoCard
                icon={BookmarkCheck}
                label="Saved items"
                value={`${savedItems.length} saved item${savedItems.length === 1 ? "" : "s"}`}
              />
              <InfoCard icon={Mail} label="Province" value={profile?.province ?? "Not added yet"} />
            </div>

            <div className="mt-6 rounded-xl border border-border bg-background p-4">
              <h3 className="text-sm font-semibold text-foreground">What is live now</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Auth sessions can identify the current learner.</li>
                <li>Profile, learner detail, role and saved-item tables are protected by RLS.</li>
                <li>This page reads those contracts without writing sensitive learner data.</li>
              </ul>
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-base font-semibold text-foreground">Learner detail summary</h2>
              {learnerSummary ? (
                <dl className="mt-4 space-y-3">
                  {learnerSummary.map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 text-sm">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-medium text-foreground">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  No learner detail row has been saved yet. Use Match or Funding to save a learner-owned profile after reviewing the consent notice.
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-base font-semibold text-foreground">Saved items contract</h2>
              {savedItems.length > 0 ? (
                <ul className="mt-4 space-y-2 text-sm">
                  {savedItems.slice(0, 5).map((item) => (
                    <li key={item.id} className="rounded-xl border border-border bg-background p-3">
                      <span className="font-medium text-foreground">{item.item_type}</span>
                      <span className="ml-2 text-muted-foreground">{item.item_slug}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Nothing saved yet. Saved catalogue actions will appear here when you use an available save control.
                </p>
              )}
            </section>
          </aside>
        </div>
      ) : (
        <section className="grid gap-6 rounded-2xl border border-border bg-card p-6 md:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Sign in
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              Use a secure email link
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Phase 1 auth is live. Signing in creates a protected learner profile row and default
              learner role through Lovable's signup trigger.
            </p>
          </div>

          <form onSubmit={sendMagicLink} className="space-y-3" aria-describedby="account-auth-help account-auth-notice account-auth-error">
            <label htmlFor="account-email" className="block text-sm">
              <span className="mb-1.5 block font-medium text-foreground">Email address</span>
              <input
                id="account-email"
                name="email"
                type="email"
                required
                aria-required="true"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            <button
              type="submit"
              disabled={authLoading}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {authLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              Send sign-in link
            </button>
            <p id="account-auth-help" className="text-xs leading-relaxed text-muted-foreground">
              Sign-in links return only to the SA Learn account route. Profile data remains protected by row-level security.
            </p>
            <div className="border-t border-border pt-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Or continue with a configured provider
              </p>
              <div className="flex flex-wrap gap-2">
                {AUTH_PROVIDERS.map((provider) => (
                  <button
                    key={provider}
                    type="button"
                    onClick={() => signInWithProvider(provider)}
                    disabled={authLoading}
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium capitalize text-foreground hover:bg-muted disabled:opacity-60"
                  >
                    <KeyRound className="h-4 w-4" aria-hidden="true" />
                    {provider}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </section>
      )}

      <div className="mt-8 rounded-2xl border border-border bg-muted/35 p-5 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Account safety:</span> authentication returns to this route, private rows remain learner-owned, and catalogue records retain their verification labels.{" "}
        <Link to="/prod-readiness" className="font-medium text-foreground hover:underline">
          View readiness
        </Link>
      </div>
    </PageShell>
  );
}

function Alert({ tone, message }: { tone: "success" | "warning"; message: string }) {
  return (
    <div
      id={tone === "warning" ? "account-auth-error" : "account-auth-notice"}
      role={tone === "warning" ? "alert" : "status"}
      aria-live={tone === "warning" ? "assertive" : "polite"}
      className={`mb-6 rounded-2xl border p-4 text-sm ${
        tone === "success"
          ? "border-success/30 bg-success-soft text-success"
          : "border-warning/30 bg-warning-soft text-warning-foreground"
      }`}
    >
      <AlertCircle className="mr-2 inline h-4 w-4" aria-hidden="true" />
      {message}
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <p className="mt-3 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
