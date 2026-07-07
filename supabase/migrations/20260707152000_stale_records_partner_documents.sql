-- Codex: Production-readiness backend support
-- Adds stale-record automation plus a private learner document consent/upload foundation.

CREATE OR REPLACE FUNCTION public.mark_stale_catalogue_records()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  courses_count integer;
  institutions_count integer;
  opportunities_count integer;
  funding_count integer;
BEGIN
  UPDATE public.courses
  SET verification_status = 'stale', updated_at = now()
  WHERE verification_status <> 'stale'
    AND COALESCE(last_verified_at, created_at) < now() - (stale_after_days || ' days')::interval;
  GET DIAGNOSTICS courses_count = ROW_COUNT;

  UPDATE public.institutions
  SET verification_status = 'stale', updated_at = now()
  WHERE verification_status <> 'stale'
    AND COALESCE(last_verified_at, created_at) < now() - (stale_after_days || ' days')::interval;
  GET DIAGNOSTICS institutions_count = ROW_COUNT;

  UPDATE public.opportunities
  SET verification_status = 'stale', updated_at = now()
  WHERE verification_status <> 'stale'
    AND COALESCE(last_verified_at, created_at) < now() - (stale_after_days || ' days')::interval;
  GET DIAGNOSTICS opportunities_count = ROW_COUNT;

  UPDATE public.funding_windows
  SET verification_status = 'stale', updated_at = now()
  WHERE verification_status <> 'stale'
    AND COALESCE(last_verified_at, created_at) < now() - (stale_after_days || ' days')::interval;
  GET DIAGNOSTICS funding_count = ROW_COUNT;

  RETURN jsonb_build_object(
    'courses', courses_count,
    'institutions', institutions_count,
    'opportunities', opportunities_count,
    'funding_windows', funding_count
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.mark_stale_catalogue_records() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mark_stale_catalogue_records() TO service_role;

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

SELECT cron.schedule(
  'sa-learn-weekly-stale-catalogue-records',
  '15 2 * * 1',
  $$SELECT public.mark_stale_catalogue_records();$$
)
WHERE NOT EXISTS (
  SELECT 1
  FROM cron.job
  WHERE jobname = 'sa-learn-weekly-stale-catalogue-records'
);

CREATE TABLE IF NOT EXISTS public.document_consents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('id', 'transcript', 'proof_of_residence', 'other')),
  file_path text NOT NULL,
  consent_version text NOT NULL DEFAULT '2026-07-07',
  consented_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'deleted', 'review_needed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.document_consents TO authenticated;
GRANT ALL ON public.document_consents TO service_role;
ALTER TABLE public.document_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own document consent records"
  ON public.document_consents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own document consent records"
  ON public.document_consents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can mark their own document consent records"
  ON public.document_consents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view document consent records"
  ON public.document_consents FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'learner-documents',
  'learner-documents',
  false,
  10485760,
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET public = false,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Users can upload their own learner documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'learner-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read their own learner documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'learner-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own learner documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'learner-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
