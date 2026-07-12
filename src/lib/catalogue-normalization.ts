import type { Course } from "./data";

const DELIVERY_MODES = new Set<Course["deliveryMode"]>([
  "Contact",
  "Online",
  "Blended",
  "Workplace",
]);

export function normaliseDeliveryMode(value: string | null): Course["deliveryMode"] {
  return value && DELIVERY_MODES.has(value as Course["deliveryMode"])
    ? (value as Course["deliveryMode"])
    : "Contact";
}

export function isPaidOpportunity(value: string | null) {
  return ["yes", "paid", "true"].includes(value?.trim().toLowerCase() ?? "");
}


export function normaliseCatalogueTrust(row: {
  source_name: string | null;
  source_url: string | null;
  last_verified_at: string | null;
  verification_status: "unverified" | "provisional" | "verified" | "stale";
}) {
  const timestamp = row.last_verified_at ? Date.parse(row.last_verified_at) : Number.NaN;
  const hasValidDate = Number.isFinite(timestamp);
  let hasHttpsSource = false;
  try {
    hasHttpsSource = Boolean(row.source_url && new URL(row.source_url).protocol === "https:");
  } catch {
    hasHttpsSource = false;
  }
  const verified =
    row.verification_status === "verified" && hasValidDate && hasHttpsSource;

  return {
    sourceName: row.source_name?.trim() || "Source unavailable",
    sourceUrl: hasHttpsSource ? row.source_url! : "https://salearn.online",
    lastVerifiedAt: hasValidDate
      ? new Date(timestamp).toLocaleDateString("en-ZA", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Awaiting verification date",
    verificationStatus: verified ? "Verified" as const : "Needs confirmation" as const,
  };
}
