-- Codex: Reconcile public testimonials contract
-- Status: Makes the reviewed public.testimonials table support learner submissions without publishing them.

ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS submitter_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS consent_to_publish boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'en';

DROP POLICY IF EXISTS "Approved testimonials are public" ON public.testimonials;
CREATE POLICY "Approved consented testimonials are public"
  ON public.testimonials
  FOR SELECT TO anon, authenticated
  USING (approved = true AND consent_to_publish = true);

DROP POLICY IF EXISTS "Learners submit unapproved testimonials" ON public.testimonials;
CREATE POLICY "Learners submit unapproved testimonials"
  ON public.testimonials
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = submitter_user_id
    AND approved = false
    AND consent_to_publish = true
  );

CREATE INDEX IF NOT EXISTS idx_testimonials_public_approved
  ON public.testimonials(approved, consent_to_publish, created_at DESC);
