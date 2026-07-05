# Lovable Model Log

This log records changes made by the Lovable agent (lead AI dev on SA Learn) so other agents and human developers can see what changed, when, and where to continue.

## Secure /prod-readiness with a shared access key

**Date/Time:** 2026-07-05

**Files Modified:**
- `src/lib/gate.functions.ts` (new)
- `src/routes/unlock.tsx` (new)
- `src/routes/prod-readiness.tsx`
- `src/lib/data.ts` (unrelated type annotation fix so the build passes)
- Secrets: added `SITE_PASSWORD` (user-provided access key) and generated `SESSION_SECRET` (session cookie encryption)

**Short Plain English Description:**
The internal roadmap page at `/prod-readiness` was reachable by anyone and effectively documented which security controls were not yet in place. It is now gated by a shared access key. Visitors are redirected to `/unlock`, paste the key once, and the server sets a signed, HTTP-only, encrypted session cookie that keeps the device trusted for 30 days. Subsequent visits go straight to the page with no prompt.

The gate is enforced server-side inside a `createServerFn`, so unauthenticated visitors never receive the protected page data - a redirect is thrown before the loader returns. The password check uses a timing-safe comparison. The access key itself is stored as the `SITE_PASSWORD` server secret and never ships to the browser. The route is also marked `noindex, nofollow`.

To rotate the key: update the `SITE_PASSWORD` secret. To force everyone to re-enter: rotate `SESSION_SECRET`.
