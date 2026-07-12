import { describe, expect, test } from "bun:test";

const url = process.env.SUPABASE_TEST_URL;
const key = process.env.SUPABASE_TEST_PUBLISHABLE_KEY;
const userAToken = process.env.SUPABASE_TEST_USER_A_TOKEN;
const userBToken = process.env.SUPABASE_TEST_USER_B_TOKEN;
const userAId = process.env.SUPABASE_TEST_USER_A_ID;
const userBId = process.env.SUPABASE_TEST_USER_B_ID;
const adminToken = process.env.SUPABASE_TEST_ADMIN_TOKEN;
const institutionToken = process.env.SUPABASE_TEST_INSTITUTION_TOKEN;
const requireRlsTests = process.env.REQUIRE_RLS_TESTS === "1";
const requiredEnvironment = {
  SUPABASE_TEST_URL: url,
  SUPABASE_TEST_PUBLISHABLE_KEY: key,
  SUPABASE_TEST_USER_A_TOKEN: userAToken,
  SUPABASE_TEST_USER_B_TOKEN: userBToken,
  SUPABASE_TEST_USER_A_ID: userAId,
  SUPABASE_TEST_USER_B_ID: userBId,
  SUPABASE_TEST_ADMIN_TOKEN: adminToken,
  SUPABASE_TEST_INSTITUTION_TOKEN: institutionToken,
};
const missingEnvironment = Object.entries(requiredEnvironment)
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (requireRlsTests && missingEnvironment.length > 0) {
  throw new Error(`RLS integration tests require: ${missingEnvironment.join(", ")}`);
}

const hasBase = Boolean(url && key);
const hasUsers = Boolean(hasBase && userAToken && userBToken && userAId && userBId);
const hasAdmin = Boolean(hasBase && adminToken);
const hasInstitution = Boolean(hasBase && institutionToken);
const baseTest = hasBase ? test : test.skip;
const userTest = hasUsers ? test : test.skip;
const adminTest = hasAdmin ? test : test.skip;
const institutionTest = hasInstitution ? test : test.skip;

async function rest(path: string, token?: string, init?: RequestInit) {
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key ?? "",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...init?.headers,
    },
  });
}

async function storage(path: string, token: string, init?: RequestInit) {
  return fetch(`${url}/storage/v1/${path}`, {
    ...init,
    headers: {
      apikey: key ?? "",
      authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });
}

describe("Supabase RLS integration", () => {
  baseTest("anonymous users can read approved public institutions", async () => {
    const response = await rest("institutions?select=id,slug&limit=1");
    expect(response.status).toBe(200);
    expect(Array.isArray(await response.json())).toBe(true);
  });

  baseTest("anonymous users cannot read learner details", async () => {
    const response = await rest("learner_details?select=user_id&limit=1");
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([]);
  });

  userTest("a learner can read their own private learner row", async () => {
    const response = await rest(
      `learner_details?user_id=eq.${userAId}&select=user_id`,
      userAToken,
    );
    expect(response.status).toBe(200);
    const rows = await response.json();
    expect(rows.every((row: { user_id: string }) => row.user_id === userAId)).toBe(true);
  });

  userTest("a learner cannot read another learner's private row", async () => {
    const response = await rest(
      `learner_details?user_id=eq.${userBId}&select=user_id`,
      userAToken,
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([]);
  });

  userTest("learner document objects are owner scoped", async () => {
    if (!userAToken || !userBToken || !userAId) throw new Error("Test learners are unavailable.");
    const objectPath = `${userAId}/integration/${crypto.randomUUID()}.pdf`;
    const upload = await storage(
      `object/learner-documents/${objectPath}`,
      userAToken,
      {
        method: "POST",
        headers: {
          "content-type": "application/pdf",
          "x-upsert": "false",
        },
        body: "%PDF-1.4\n%%EOF",
      },
    );
    expect([200, 201]).toContain(upload.status);

    try {
      const ownerRead = await storage(
        `object/authenticated/learner-documents/${objectPath}`,
        userAToken,
      );
      expect(ownerRead.status).toBe(200);

      const otherRead = await storage(
        `object/authenticated/learner-documents/${objectPath}`,
        userBToken,
      );
      expect([400, 401, 403, 404]).toContain(otherRead.status);
    } finally {
      const cleanup = await storage("object/learner-documents", userAToken, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prefixes: [objectPath] }),
      });
      expect(cleanup.status).toBe(200);
    }
  });

  userTest("a learner cannot assign themselves an admin role", async () => {
    const response = await rest("user_roles", userAToken, {
      method: "POST",
      headers: { prefer: "return=representation" },
      body: JSON.stringify({ user_id: userAId, role: "admin" }),
    });
    expect([401, 403]).toContain(response.status);
  });

  institutionTest("an institution role can inspect its moderation queue surface", async () => {
    const response = await rest(
      "institutions?select=id,moderation_state&limit=1",
      institutionToken,
    );
    expect(response.status).toBe(200);
  });

  userTest("a learner cannot invoke the catalogue staleness function", async () => {
    const response = await rest("rpc/mark_stale_catalogue_records", userAToken, {
      method: "POST",
      body: "{}",
    });
    expect([401, 403, 404]).toContain(response.status);
  });

  adminTest("testimonial submission stays unapproved until admin moderation", async () => {
    if (!userAToken || !userAId || !adminToken) throw new Error("Test identities are unavailable.");
    const marker = `rls-${crypto.randomUUID()}`;
    const create = await rest("learner_testimonials", userAToken, {
      method: "POST",
      headers: { prefer: "return=representation" },
      body: JSON.stringify({
        user_id: userAId,
        display_name: "RLS test learner",
        province: "Gauteng",
        quote: `Automated moderation proof ${marker}`,
        language: "en",
        consent_to_publish: true,
        moderation_state: "submitted",
      }),
    });
    expect(create.status).toBe(201);
    const rows = await create.json();
    const row = rows[0] as { id: string; moderation_state: string };
    expect(row.moderation_state).toBe("submitted");

    const anonymousRead = await rest(
      `learner_testimonials?id=eq.${row.id}&select=id,moderation_state`,
    );
    expect(anonymousRead.status).toBe(200);
    expect(await anonymousRead.json()).toEqual([]);

    try {
      const moderate = await rest(`learner_testimonials?id=eq.${row.id}`, adminToken, {
        method: "PATCH",
        headers: { prefer: "return=representation" },
        body: JSON.stringify({ moderation_state: "approved", reviewed_at: new Date().toISOString() }),
      });
      expect(moderate.status).toBe(200);
      const moderatedRows = await moderate.json();
      expect(moderatedRows[0]?.moderation_state).toBe("approved");

      const publishedRead = await rest(
        `learner_testimonials?id=eq.${row.id}&select=id,moderation_state`,
      );
      expect(publishedRead.status).toBe(200);
      const publishedRows = await publishedRead.json();
      expect(publishedRows[0]?.moderation_state).toBe("approved");
    } finally {
      await rest(`learner_testimonials?id=eq.${row.id}`, adminToken, { method: "DELETE" });
    }
  });

  adminTest("an administrator can invoke catalogue staleness maintenance", async () => {
    const response = await rest("rpc/mark_stale_catalogue_records", adminToken, {
      method: "POST",
      body: "{}",
    });
    expect(response.status).toBe(200);
  });

  adminTest("an administrator can inspect moderation rows", async () => {
    const response = await rest(
      "institutions?moderation_state=eq.submitted&select=id,moderation_state&limit=1",
      adminToken,
    );
    expect(response.status).toBe(200);
  });
});
