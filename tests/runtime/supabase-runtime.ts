import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are required.");

const client = createClient(url, key, { auth: { persistSession: false } });
const read = await client.from("institutions").select("id,slug").limit(1);
if (read.error) throw new Error(`Anonymous institution read failed: ${read.error.message}`);

// Codex: Anonymous catalogue and RLS runtime probe
// Status: The deployed backend must permit public reads and reject anonymous catalogue writes.
const write = await client.from("institutions").insert({
  slug: `rls-probe-${Date.now()}`,
  name: "RLS probe",
  type: "Test",
});
if (!write.error) throw new Error("Anonymous institution write unexpectedly succeeded.");

console.log(`Runtime proof passed: public read returned ${read.data.length} row(s); anonymous write was rejected.`);
