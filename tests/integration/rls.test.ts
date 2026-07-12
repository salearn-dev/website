import { describe, expect, test } from "bun:test";

const url = process.env.SUPABASE_TEST_URL;
const key = process.env.SUPABASE_TEST_PUBLISHABLE_KEY;
const userAToken = process.env.SUPABASE_TEST_USER_A_TOKEN;
const userBToken = process.env.SUPABASE_TEST_USER_B_TOKEN;
const userAId = process.env.SUPABASE_TEST_USER_A_ID;
const userBId = process.env.SUPABASE_TEST_USER_B_ID;
const adminToken = process.env.SUPABASE_TEST_ADMIN_TOKEN;

const hasBase = Boolean(url && key);
const hasUsers = Boolean(hasBase && userAToken && userBToken && userAId && userBId);
const hasAdmin = Boolean(hasBase && adminToken);
const baseTest = hasBase ? test : test.skip;
const userTest = hasUsers ? test : test.skip;
const adminTest = hasAdmin ? test : test.skip;

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

  userTest("a learner cannot assign themselves an admin role", async () => {
    const response = await rest("user_roles", userAToken, {
      method: "POST",
      headers: { prefer: "return=representation" },
      body: JSON.stringify({ user_id: userAId, role: "admin" }),
    });
    expect([401, 403]).toContain(response.status);
  });

  adminTest("an administrator can inspect moderation rows", async () => {
    const response = await rest(
      "institutions?moderation_state=eq.submitted&select=id,moderation_state&limit=1",
      adminToken,
    );
    expect(response.status).toBe(200);
  });
});
