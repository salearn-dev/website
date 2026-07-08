-- Codex: Real learner testimonial pipeline
-- Stores signed-in learner feedback for moderation before public display.

CREATE TABLE IF NOT EXISTS public.learner_testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  province text,
  quote text NOT NULL CHECK (char_length(quote) BETWEEN 20 AND 700),
  language text NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'zu', 'af', 'xh', 'st')),
  consent_to_publish boolean NOT NULL DEFAULT false,
  moderation_state public.moderation_state NOT NULL DEFAULT 'submitted',
  source_note text NOT NULL DEFAULT 'Submitted by signed-in learner through SA Learn',
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.learner_testimonials TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.learner_testimonials TO authenticated;
GRANT ALL ON public.learner_testimonials TO service_role;
ALTER TABLE public.learner_testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read approved learner testimonials"
  ON public.learner_testimonials FOR SELECT
  USING (moderation_state = 'approved' AND consent_to_publish = true);

CREATE POLICY "Users can submit their own learner testimonials"
  ON public.learner_testimonials FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND moderation_state = 'submitted'
    AND consent_to_publish = true
  );

CREATE POLICY "Users can view their own learner testimonials"
  ON public.learner_testimonials FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage learner testimonials"
  ON public.learner_testimonials FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS trg_learner_testimonials_updated_at ON public.learner_testimonials;
CREATE TRIGGER trg_learner_testimonials_updated_at
  BEFORE UPDATE ON public.learner_testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_learner_testimonials_moderation
  ON public.learner_testimonials(moderation_state, created_at DESC);
