
-- 1. pg_cron: weekly stale-record sweep
CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'salearn-mark-stale-catalogue') THEN
    PERFORM cron.unschedule('salearn-mark-stale-catalogue');
  END IF;
  PERFORM cron.schedule(
    'salearn-mark-stale-catalogue',
    '15 3 * * 1',
    $cmd$SELECT public.mark_stale_catalogue_records();$cmd$
  );
END $$;

-- 2. Storage RLS for learner-documents (private bucket)
CREATE POLICY "Learners read own documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'learner-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Learners upload to own folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'learner-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Learners update own documents"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'learner-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Learners delete own documents"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'learner-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 3. POPIA consent log
CREATE TABLE public.consent_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type text NOT NULL,
  consent_version text NOT NULL DEFAULT 'v1',
  granted boolean NOT NULL DEFAULT true,
  context jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.consent_records TO authenticated;
GRANT ALL ON public.consent_records TO service_role;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Learners read own consent" ON public.consent_records
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Learners write own consent" ON public.consent_records
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 4. Skills progress
CREATE TABLE public.skill_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_slug text NOT NULL,
  completed_steps int NOT NULL DEFAULT 0,
  total_steps int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'in_progress',
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, skill_slug)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skill_progress TO authenticated;
GRANT ALL ON public.skill_progress TO service_role;
ALTER TABLE public.skill_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Learners manage own progress" ON public.skill_progress
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_skill_progress_updated_at BEFORE UPDATE ON public.skill_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Deadline reminders (opportunities + funding)
CREATE TABLE public.deadline_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_slug text NOT NULL,
  channel text NOT NULL DEFAULT 'email',
  remind_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_type, item_slug, channel)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.deadline_reminders TO authenticated;
GRANT ALL ON public.deadline_reminders TO service_role;
ALTER TABLE public.deadline_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Learners manage own reminders" ON public.deadline_reminders
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_deadline_reminders_updated_at BEFORE UPDATE ON public.deadline_reminders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Testimonials
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_name text NOT NULL,
  quote text NOT NULL,
  role_or_school text,
  province text,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved testimonials are public" ON public.testimonials
  FOR SELECT TO anon, authenticated USING (approved = true);
CREATE POLICY "Admins manage testimonials" ON public.testimonials
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_testimonials_updated_at BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
