import { useSession } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import { createHash, timingSafeEqual } from "node:crypto";

export type GateSession = { unlocked?: boolean };

const DEV_SESSION_SECRET = "sa-learn-local-dev-session-secret-for-prod-readiness-gate";
const DEV_SITE_PASSWORD = "local-dev";

function isProduction() {
  return import.meta.env.PROD;
}

export function getSitePassword() {
  const password = process.env.SITE_PASSWORD;
  if (!password && isProduction()) {
    throw new Error("SITE_PASSWORD is not set");
  }
  return password ?? DEV_SITE_PASSWORD;
}

function sessionConfig() {
  const password = process.env.SESSION_SECRET ?? (!isProduction() ? DEV_SESSION_SECRET : undefined);
  if (!password) {
    throw new Error("SESSION_SECRET is not set");
  }
  return {
    password,
    name: "sa-learn-gate",
    maxAge: 60 * 60 * 24 * 30,
    cookie: {
      httpOnly: true,
      // Codex: Local prod-readiness gate support
      // Status: Dev mode keeps the unlock cookie usable on http://localhost; production stays HTTPS-only.
      secure: isProduction(),
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

export function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export async function getGateSession() {
  // eslint-disable-next-line react-hooks/rules-of-hooks -- TanStack Start exposes useSession as a server helper here.
  return useSession<GateSession>(sessionConfig());
}

export async function requireUnlockedSession() {
  const session = await getGateSession();
  if (!session.data.unlocked) {
    throw redirect({ to: "/unlock" });
  }
  return session;
}
