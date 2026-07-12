export type DeadlineItem = {
  title: string;
  deadline: string;
  source: string;
  status: string;
  href?: string;
};

type OpportunityRow = {
  title: string | null;
  closing_date: string | null;
  provider: string | null;
  source_name: string | null;
  source_url: string | null;
  verification_status: string | null;
};

type FundingRow = {
  name: string | null;
  deadline: string | null;
  provider: string | null;
  source_name: string | null;
  source_url: string | null;
  verification_status: string | null;
};

export function resolveDeadlineFeed(
  fallback: DeadlineItem[],
  opportunities: OpportunityRow[] | null,
  funding: FundingRow[] | null,
) {
  const liveItems: DeadlineItem[] = [
    ...(opportunities ?? []).map((item) => ({
      title: item.title ?? "Opportunity deadline",
      deadline: item.closing_date ?? "Confirm with source",
      source: item.source_name ?? item.provider ?? "Official source",
      status: item.verification_status ?? "Provisional",
      href: item.source_url ?? undefined,
    })),
    ...(funding ?? []).map((item) => ({
      title: item.name ?? "Funding deadline",
      deadline: item.deadline ?? "Confirm with source",
      source: item.source_name ?? item.provider ?? "Official source",
      status: item.verification_status ?? "Provisional",
      href: item.source_url ?? undefined,
    })),
  ];

  return liveItems.length > 0
    ? { items: liveItems, isLive: true }
    : { items: fallback, isLive: false };
}
