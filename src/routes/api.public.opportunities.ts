import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import {
  authorizePartnerKey,
  isSamePartnerSubmission,
  MAX_PARTNER_BODY_BYTES,
  parsePartnerOpportunityBody,
  partnerOpportunitySlug,
} from "@/lib/partner-opportunity";

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      ...init?.headers,
    },
  });
}

export const Route = createFileRoute("/api/public/opportunities")({
  server: {
    handlers: {
      GET: async () =>
        jsonResponse({
          ok: true,
          endpoint: "/api/public/opportunities",
          method: "POST",
          moderation:
            "Submissions are provisional and require moderation before public display.",
          required: ["title", "source_url"],
          maximumBodyBytes: MAX_PARTNER_BODY_BYTES,
        }),

      POST: async ({ request }: { request: Request }) => {
        const authorization = authorizePartnerKey(
          request.headers.get("x-sa-learn-partner-key"),
          process.env.SA_LEARN_PARTNER_API_KEY,
        );
        if (!authorization.ok) {
          return jsonResponse(
            { ok: false, error: authorization.error },
            { status: authorization.status },
          );
        }

        const declaredLength = Number(request.headers.get("content-length") ?? 0);
        if (declaredLength > MAX_PARTNER_BODY_BYTES) {
          return jsonResponse({ ok: false, error: "Request body is too large." }, { status: 413 });
        }

        const parsed = parsePartnerOpportunityBody(await request.text());
        if (!parsed.ok) {
          return jsonResponse(
            { ok: false, error: parsed.error, ...("fields" in parsed ? { fields: parsed.fields } : {}) },
            { status: parsed.status },
          );
        }
        const payload = parsed.data;

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const slug = partnerOpportunitySlug(payload);
          const { data: existing, error: lookupError } = await supabaseAdmin
            .from("opportunities")
            .select("id, slug, title, source_url, moderation_state, verification_status")
            .eq("slug", slug)
            .maybeSingle();

          if (lookupError) {
            console.error("[partner-opportunities] Supabase lookup failed", {
              code: lookupError.code,
            });
            return jsonResponse(
              { ok: false, error: "Partner submission could not be checked." },
              { status: 500 },
            );
          }

          if (existing) {
            if (!isSamePartnerSubmission(existing, payload)) {
              return jsonResponse(
                { ok: false, error: "Submission identity conflicts with an existing record." },
                { status: 409 },
              );
            }
            return jsonResponse(
              {
                ok: true,
                duplicate: true,
                opportunity: {
                  id: existing.id,
                  slug: existing.slug,
                  moderation_state: existing.moderation_state,
                  verification_status: existing.verification_status,
                },
              },
              { status: 200 },
            );
          }

          const { data, error } = await supabaseAdmin
            .from("opportunities")
            .insert({
              slug,
              title: payload.title,
              category: payload.category ?? "Partner submission",
              sector: payload.sector ?? "Information unavailable",
              type: payload.type ?? "Opportunity",
              province: payload.province ?? "Nationwide",
              provider: payload.provider ?? payload.source_name ?? "Partner",
              closing_date: payload.closing_date ?? null,
              paid: payload.paid ?? "unknown",
              description: payload.description ?? null,
              source_name: payload.source_name ?? payload.provider ?? "Partner submission",
              source_url: payload.source_url,
              verification_status: "provisional",
              moderation_state: "submitted",
            })
            .select("id, slug, moderation_state, verification_status")
            .single();

          if (error) {
            console.error("[partner-opportunities] Supabase insert failed", {
              code: error.code,
            });
            return jsonResponse(
              { ok: false, error: "Partner submission could not be stored." },
              { status: 500 },
            );
          }

          return jsonResponse({ ok: true, opportunity: data }, { status: 202 });
        } catch (error) {
          console.error("[partner-opportunities] Unexpected submission failure", {
            name: error instanceof Error ? error.name : "UnknownError",
          });
          return jsonResponse(
            { ok: false, error: "Partner submission failed." },
            { status: 500 },
          );
        }
      },
    },
  },
});
