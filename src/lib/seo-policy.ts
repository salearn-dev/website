export type SeoRoutePolicy = "index" | "noindex-private" | "blocked-system";

export const STATIC_PUBLIC_ROUTES = [
  "/",
  "/ask",
  "/careers",
  "/courses",
  "/funding",
  "/guides",
  "/institutions",
  "/match",
  "/opportunities",
  "/skills",
  "/whatsapp",
] as const;

export const PRIVATE_ROUTE_PREFIXES = [
  "/account",
  "/admin",
  "/institutions/portal",
  "/prod-readiness",
  "/unlock",
] as const;

export const BLOCKED_SYSTEM_PREFIXES = [
  "/api",
  "/internal",
  "/preview",
  "/test",
] as const;

export function getSeoRoutePolicy(pathname: string): SeoRoutePolicy {
  if (BLOCKED_SYSTEM_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return "blocked-system";
  }

  if (PRIVATE_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return "noindex-private";
  }

  return "index";
}

export function getRobotsDirective(pathname: string) {
  return getSeoRoutePolicy(pathname) === "index"
    ? "index, follow"
    : "noindex, nofollow, noarchive";
}
