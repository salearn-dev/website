import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Lock } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { unlockSite } from "@/lib/gate.functions";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/unlock")({
  head: () =>
    buildSeoHead({
      title: "Restricted - SA Learn",
      description: "Restricted internal area.",
      path: "/unlock",
      robots: "noindex",
    }),
  component: UnlockPage,
});

function UnlockPage() {
  const router = useRouter();
  const unlock = useServerFn(unlockSite);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(false);
    try {
      const res = await unlock({ data: { password } });
      if (res.ok) {
        await router.navigate({ to: "/prod-readiness" });
      } else {
        setError(true);
        setPending(false);
      }
    } catch {
      setError(true);
      setPending(false);
    }
  }

  return (
    <PageShell
      eyebrow="Restricted"
      title="Enter access key"
      description="This area is for the SA Learn team. Paste the access key to continue. Your session will be trusted on this device."
    >
      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6"
      >
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Access key
        </label>
        <div className="mt-2 flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            aria-invalid={error}
            aria-describedby={error ? "unlock-error" : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Paste key"
          />
        </div>
        {error && (
          <p id="unlock-error" role="alert" className="mt-3 text-sm text-destructive">Incorrect key. Try again.</p>
        )}
        <p role="status" aria-live="polite" className="sr-only">{pending ? "Checking access key." : ""}</p>
        <Button type="submit" className="mt-5 w-full" disabled={pending || !password}>
          {pending ? "Checking..." : "Unlock"}
        </Button>
      </form>
    </PageShell>
  );
}
