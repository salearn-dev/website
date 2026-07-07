import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

type PartnerOpportunityPayload = {
  title?: string;
  category?: string;
  sector?: string;
  type?: string;
  province?: string;
  provider?: string;
  closing_date?: string;
  paid?: string;
  description?: string;
  source_name?: string;
  source_url?: string;
};

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function assertPartnerKey(request: Request) {
  const expected = process.env.SA_LEARN_PARTNER_API_KEY;
  if (!expected) {
    return jsonResponse(
      { ok: false, error: "Partner API key is not configured yet." },
      { status: 503 },
    );
  }

  if (request.headers.get("x-sa-learn-partner-key") !== expected) {
    return jsonResponse({ ok: false, error: "Invalid partner API key." }, { status: 401 });
  }

  return null;
}

export const Route = createFileRoute("/api/public/opportunities")({
  server: {
    handlers: {
      GET: async () =>
        jsonResponse({
          ok: true,
          endpoint: "/api/public/opportunities",
          method: "POST",
          auth: "Send x-sa-learn-partner-key. Kuzi/Lovable provision the key as a deployment secret.",
          moderation:
            "Submissions are stored as moderation_state=submitted and verification_status=provisional until reviewed.",
          required: ["title", "source_url"],
          optional: [
            "category",
            "sector",
            "type",
            "province",
            "provider",
            "closing_date",
            "paid",
            "description",
            "source_name",
          ],
        }),

      POST: async ({ request }: { request: Request }) => {
        const authError = assertPartnerKey(request);
        if (authError) return authError;

        let payload: PartnerOpportunityPayload;
        try {
          payload = await request.json();
        } catch {
          return jsonResponse({ ok: false, error: "Invalid JSON body." }, { status: 400 });
        }

        if (!payload.title || !payload.source_url) {
          return jsonResponse(
            { ok: false, error: "title and source_url are required." },
            { status: 400 },
          );
        }

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin
            .from("opportunities")
            .insert({
              slug: slugify(`${payload.provider ?? "partner"}-${payload.title}`),
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
            return jsonResponse({ ok: false, error: error.message }, { status: 400 });
          }

          return jsonResponse({ ok: true, opportunity: data }, { status: 202 });
        } catch (error) {
          return jsonResponse(
            {
              ok: false,
              error: error instanceof Error ? error.message : "Partner submission failed.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
