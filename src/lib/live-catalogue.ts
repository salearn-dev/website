import { supabase } from "@/integrations/supabase/client";
import {
  COURSES,
  FUNDING,
  INSTITUTIONS,
  OPPORTUNITIES,
  type Course,
  type Institution,
  type TrustMeta,
} from "@/lib/data";
import { INSTITUTION_IMAGES } from "@/lib/institution-images";

type Funding = (typeof FUNDING)[number];
type Opportunity = (typeof OPPORTUNITIES)[number];

type CatalogueSource = "live" | "static";

export type CatalogueResult<T> = {
  items: T[];
  source: CatalogueSource;
};

function trustFromCatalogue(row: {
  source_name: string | null;
  source_url: string | null;
  last_verified_at: string | null;
  verification_status: "unverified" | "provisional" | "verified" | "stale";
}): TrustMeta {
  return {
    sourceName: row.source_name ?? "Live catalogue",
    sourceUrl: row.source_url ?? "https://salearn.online",
    lastVerifiedAt: row.last_verified_at
      ? new Date(row.last_verified_at).toLocaleDateString("en-ZA", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Awaiting verification date",
    verificationStatus: row.verification_status === "verified" ? "Verified" : "Needs confirmation",
  };
}

export async function loadApprovedCourses(): Promise<CatalogueResult<Course>> {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("moderation_state", "approved")
      .order("title", { ascending: true });

    if (error || !data?.length) return { items: COURSES, source: "static" };

    return {
      source: "live",
      items: data.map((row) => ({
        slug: row.slug,
        title: row.title,
        institution: row.institution_name ?? "Institution pending",
        qualification: row.qualification ?? "Information unavailable",
        nqf: row.nqf ?? 0,
        duration: row.duration ?? "Information unavailable",
        cost: row.cost ?? "Information unavailable",
        funding: row.funding ?? "Information unavailable",
        careers: row.careers ?? [],
        province: row.province ?? "Information unavailable",
        city: row.city ?? "Information unavailable",
        deliveryMode: (row.delivery_mode ?? "Contact") as Course["deliveryMode"],
        category: row.category ?? "universities",
        accreditation: row.accreditation ?? "Needs confirmation",
        trust: trustFromCatalogue(row),
      })),
    };
  } catch {
    return { items: COURSES, source: "static" };
  }
}

export async function loadApprovedInstitutions(): Promise<CatalogueResult<Institution>> {
  try {
    const { data, error } = await supabase
      .from("institutions")
      .select("*, courses(count)")
      .eq("moderation_state", "approved")
      .order("name", { ascending: true });

    if (error || !data?.length) return { items: INSTITUTIONS, source: "static" };

    return {
      source: "live",
      items: data.map((row) => ({
        slug: row.slug,
        name: row.name,
        type: row.type ?? "Institution",
        province: row.province ?? "Information unavailable",
        courses: Array.isArray(row.courses) ? (row.courses[0]?.count ?? 0) : 0,
        funding: row.funding_notes ?? "Information unavailable",
        website: (row.website ?? row.source_url ?? "salearn.online").replace(/^https?:\/\//, ""),
        campuses: Array.isArray(row.campuses) ? row.campuses.map(String) : [],
        accreditationStatus: row.accreditation_status ?? "Needs confirmation",
        registerLinks: Array.isArray(row.register_links)
          ? row.register_links
              .map((link) =>
                typeof link === "object" && link && "label" in link && "url" in link
                  ? { label: String(link.label), url: String(link.url) }
                  : null,
              )
              .filter((link): link is { label: string; url: string } => Boolean(link))
          : [],
        applicationWindows: Array.isArray(row.application_windows)
          ? row.application_windows
              .map((item) =>
                typeof item === "object" &&
                item &&
                "label" in item &&
                "period" in item &&
                "status" in item
                  ? {
                      label: String(item.label),
                      period: String(item.period),
                      status: String(item.status),
                    }
                  : null,
              )
              .filter(
                (item): item is { label: string; period: string; status: string } => Boolean(item),
              )
          : [],
        heroImage: INSTITUTION_IMAGES[row.slug],
        trust: trustFromCatalogue(row),
      })),
    };
  } catch {
    return { items: INSTITUTIONS, source: "static" };
  }
}

export async function loadApprovedFunding(): Promise<CatalogueResult<Funding>> {
  try {
    const { data, error } = await supabase
      .from("funding_windows")
      .select("*")
      .eq("moderation_state", "approved")
      .order("deadline", { ascending: true });

    if (error || !data?.length) return { items: FUNDING, source: "static" };

    return {
      source: "live",
      items: data.map((row) => ({
        slug: row.slug,
        name: row.name,
        short: row.short ?? row.provider ?? "Funding window",
        eligibility: row.eligibility ?? "Information unavailable",
        coverage: row.coverage ?? "Information unavailable",
        best: row.best_for ?? "Learners who meet the official criteria.",
        deadline: row.deadline ?? "Confirm official deadline",
        trust: trustFromCatalogue(row),
      })),
    };
  } catch {
    return { items: FUNDING, source: "static" };
  }
}

export async function loadApprovedOpportunities(): Promise<CatalogueResult<Opportunity>> {
  try {
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .eq("moderation_state", "approved")
      .order("closing_date", { ascending: true });

    if (error || !data?.length) return { items: OPPORTUNITIES, source: "static" };

    return {
      source: "live",
      items: data.map((row) => ({
        id: row.slug ?? row.id,
        title: row.title,
        category: row.category ?? "Opportunity",
        sector: row.sector ?? "Information unavailable",
        type: row.type ?? "Opportunity",
        province: row.province ?? "Nationwide",
        closes: row.closing_date ?? "Confirm official deadline",
        paid: (row.paid ?? "").toLowerCase().includes("paid"),
        trust: trustFromCatalogue(row),
      })),
    };
  } catch {
    return { items: OPPORTUNITIES, source: "static" };
  }
}
