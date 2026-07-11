import { createClient } from "@supabase/supabase-js";
import { PUBLIC_UNIVERSITY_SEEDS, TVET_COLLEGE_SEEDS } from "../src/lib/data";

type InstitutionSeed = (typeof PUBLIC_UNIVERSITY_SEEDS)[number];

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Refusing to seed with a browser publishable key.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const UNIVERSITY_SOURCE = "https://www.usaf.ac.za/";
const TVET_SOURCE = "https://www.dhet.gov.za/SitePages/TVETColleges.aspx";

function toRow(seed: InstitutionSeed) {
  const isTvet = seed.type === "TVET College";
  const sourceUrl = isTvet ? TVET_SOURCE : UNIVERSITY_SOURCE;

  return {
    slug: seed.slug,
    name: seed.name,
    type: seed.type,
    province: seed.province,
    website: seed.website,
    funding_notes: isTvet
      ? "NSFAS supported at public TVET colleges"
      : "NSFAS supported at public universities",
    accreditation_status: isTvet
      ? "Public TVET college - registration and programme details require official confirmation"
      : "Public university - registration and programme details require official confirmation",
    campuses: seed.campuses,
    register_links: [
      { label: "Official website", url: `https://${seed.website}/` },
      { label: isTvet ? "DHET TVET colleges" : "Universities South Africa", url: sourceUrl },
    ],
    application_windows: [
      {
        label: isTvet ? "NC(V) / Report 191 applications" : "Undergraduate applications",
        period: "Confirm current intake with the institution",
        status: "Needs confirmation",
      },
      {
        label: isTvet ? "Trimester / semester intake" : "Faculty or programme selection",
        period: "Programme dependent",
        status: "Needs confirmation",
      },
    ],
    source_name: isTvet ? "DHET TVET branch reference" : "Universities South Africa member reference",
    source_url: sourceUrl,
    last_verified_at: null,
    verification_status: "provisional",
    moderation_state: "approved",
    stale_after_days: 180,
  };
}

const rows = [...PUBLIC_UNIVERSITY_SEEDS, ...TVET_COLLEGE_SEEDS].map(toRow);

const { error } = await supabase.from("institutions").upsert(rows, { onConflict: "slug" });

if (error) {
  throw error;
}

console.log(`Seeded ${rows.length} public institutions into Supabase.`);
