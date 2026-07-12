import { ExternalLink, ShieldAlert } from "lucide-react";
import type { TrustMeta } from "@/lib/data";

// Codex: Visible trust metadata
// Status: Static prototype records now expose source, verification status, and last-verified state.
export function TrustMetadata({ trust }: { trust: TrustMeta }) {
  const hasExternalSource =
    trust.sourceName !== "Source unavailable" && trust.sourceUrl !== "https://salearn.online";

  return (
    <div className="mt-4 rounded-xl border border-border bg-muted/35 p-3 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
          <ShieldAlert className="h-3.5 w-3.5 text-warning-foreground" />
          {trust.verificationStatus}
        </span>
        <span className="text-muted-foreground">Last verified: {trust.lastVerifiedAt}</span>
      </div>
      {hasExternalSource ? (
        <a
          href={trust.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          Source: {trust.sourceName} <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span className="mt-2 inline-flex text-muted-foreground">Source unavailable</span>
      )}
    </div>
  );
}
