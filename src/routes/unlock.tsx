import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Lock } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { unlockSite } from "@/lib/gate.functions";

export const Route = createFileRoute("/unlock")({
  head: () => ({
    meta: [
      { title: "Restricted - SA Learn" },
      { name: "description", content: "Restricted internal area." },
      { name: "robots", content: "noindex" },
    ],
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
          <Lock className="h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Paste key"
          />
        </div>
        {error && (
          <p className="mt-3 text-sm text-destructive">Incorrect key. Try again.</p>
        )}
        <Button type="submit" className="mt-5 w-full" disabled={pending || !password}>
          {pending ? "Checking..." : "Unlock"}
        </Button>
      </form>
    </PageShell>
  );
}
