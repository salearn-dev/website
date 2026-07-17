import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required; never expose the service role key to Vite.");
}

const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
const verifiedAt = "2026-07-17T00:00:00.000+02:00";

// Codex: Curated verified catalogue seed
// Status: Idempotent and intentionally small; every row has a first-party source and review date.
const institutionRows = [
  {
    slug: "up",
    name: "University of Pretoria",
    type: "Public University",
    province: "Gauteng",
    website: "https://www.up.ac.za/",
    source_name: "DHET public university directory",
    source_url: "https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx",
    last_verified_at: verifiedAt,
    verification_status: "verified",
  },
  {
    slug: "false-bay-tvet",
    name: "False Bay TVET College",
    type: "TVET College",
    province: "Western Cape",
    website: "https://www.falsebaycollege.co.za/",
    source_name: "DHET public TVET directory",
    source_url: "https://www.dhet.gov.za/RegionalOffices/educational-institutions/technical-vocational-education-and-training-colleges-tvet-colleges.html",
    last_verified_at: verifiedAt,
    verification_status: "verified",
  },
] as const;

const { data: institutions, error: institutionError } = await supabase
  .from("institutions")
  .upsert(institutionRows, { onConflict: "slug" })
  .select("id,slug");
if (institutionError) throw institutionError;

const ids = new Map(institutions.map((institution) => [institution.slug, institution.id]));
const courseRows = [
  {
    slug: "bsc-biotechnology-up-2026",
    title: "BSc Biotechnology",
    institution_id: ids.get("up"),
    qualification_type: "Degree",
    nqf_level: 7,
    duration: "3 years",
    delivery_mode: "contact",
    city: "Pretoria",
    province: "Gauteng",
    official_page_url: "https://www.up.ac.za/yearbooks/2026/SCI-faculty/UD-programmes/view/02133403",
    category: "universities",
    source_name: "University of Pretoria 2026 Yearbook",
    source_url: "https://www.up.ac.za/yearbooks/2026/SCI-faculty/UD-programmes/view/02133403",
    last_verified_at: verifiedAt,
    verification_status: "verified",
  },
  {
    slug: "occupational-certificate-electrician-false-bay-2026",
    title: "Occupational Certificate: Electrician",
    institution_id: ids.get("false-bay-tvet"),
    qualification_type: "Occupational Certificate",
    nqf_level: 4,
    delivery_mode: "contact",
    city: "Cape Town",
    province: "Western Cape",
    category: "tvet",
    source_name: "DHET occupational programmes at public TVET colleges 2026",
    source_url: "https://www.dhet.gov.za/Technical%20and%20Vocational%20Education%20and%20Training%20Co/List%20of%20Occupational%20Programmes%20updated%20for%202026%20for%20website.pdf",
    last_verified_at: verifiedAt,
    verification_status: "verified",
  },
] as const;

const { error: courseError } = await supabase.from("courses").upsert(courseRows, { onConflict: "slug" });
if (courseError) throw courseError;
console.log(`Seeded ${institutionRows.length} institutions and ${courseRows.length} verified courses.`);
