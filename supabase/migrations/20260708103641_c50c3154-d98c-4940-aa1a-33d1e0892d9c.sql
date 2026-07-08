-- Phase 2b: Reconcile catalogue chain + add careers/skills/guides.

DO $$ BEGIN
  CREATE TYPE public.verification_status AS ENUM ('unverified', 'provisional', 'verified', 'stale');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.moderation_state AS ENUM ('draft', 'submitted', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='institutions') THEN
    ALTER TABLE public.institutions ADD COLUMN IF NOT EXISTS moderation_state public.moderation_state NOT NULL DEFAULT 'approved';
    ALTER TABLE public.institutions ADD COLUMN IF NOT EXISTS stale_after_days integer NOT NULL DEFAULT 180;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='courses') THEN
    ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS moderation_state public.moderation_state NOT NULL DEFAULT 'approved';
    ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS stale_after_days integer NOT NULL DEFAULT 180;
    ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS institution_name text;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='opportunities') THEN
    ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS moderation_state public.moderation_state NOT NULL DEFAULT 'approved';
    ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS stale_after_days integer NOT NULL DEFAULT 30;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='funding_windows') THEN
    ALTER TABLE public.funding_windows ADD COLUMN IF NOT EXISTS moderation_state public.moderation_state NOT NULL DEFAULT 'approved';
    ALTER TABLE public.funding_windows ADD COLUMN IF NOT EXISTS stale_after_days integer NOT NULL DEFAULT 90;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.careers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text,
  sector text,
  demand_outlook text,
  salary_band_min integer,
  salary_band_max integer,
  salary_currency text NOT NULL DEFAULT 'ZAR',
  typical_work jsonb NOT NULL DEFAULT '[]'::jsonb,
  timeline_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  entry_roles jsonb NOT NULL DEFAULT '[]'::jsonb,
  related_course_slugs text[] NOT NULL DEFAULT '{}',
  related_skill_slugs text[] NOT NULL DEFAULT '{}',
  source_name text,
  source_url text,
  last_verified_at timestamptz,
  verification_status public.verification_status NOT NULL DEFAULT 'unverified',
  stale_after_days integer NOT NULL DEFAULT 180,
  moderation_state public.moderation_state NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.careers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.careers TO authenticated;
GRANT ALL ON public.careers TO service_role;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read approved careers" ON public.careers;
CREATE POLICY "Public can read approved careers" ON public.careers
  FOR SELECT USING (moderation_state = 'approved' OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins manage careers" ON public.careers;
CREATE POLICY "Admins manage careers" ON public.careers
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text,
  difficulty text,
  time_estimate text,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  practice_tasks jsonb NOT NULL DEFAULT '[]'::jsonb,
  related_career_slugs text[] NOT NULL DEFAULT '{}',
  related_course_slugs text[] NOT NULL DEFAULT '{}',
  source_name text,
  source_url text,
  last_verified_at timestamptz,
  verification_status public.verification_status NOT NULL DEFAULT 'unverified',
  stale_after_days integer NOT NULL DEFAULT 365,
  moderation_state public.moderation_state NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.skills TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.skills TO authenticated;
GRANT ALL ON public.skills TO service_role;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read approved skills" ON public.skills;
CREATE POLICY "Public can read approved skills" ON public.skills
  FOR SELECT USING (moderation_state = 'approved' OR public.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins manage skills" ON public.skills;
CREATE POLICY "Admins manage skills" ON public.skills
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DO $$ BEGIN
  CREATE TYPE public.editorial_state AS ENUM ('draft', 'in_review', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text,
  category text,
  body_markdown text,
  key_points jsonb NOT NULL DEFAULT '[]'::jsonb,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  related_terms jsonb NOT NULL DEFAULT '[]'::jsonb,
  glossary jsonb NOT NULL DEFAULT '{}'::jsonb,
  editorial_state public.editorial_state NOT NULL DEFAULT 'draft',
  source_name text,
  source_url text,
  last_verified_at timestamptz,
  verification_status public.verification_status NOT NULL DEFAULT 'unverified',
  stale_after_days integer NOT NULL DEFAULT 365,
  moderation_state public.moderation_state NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.guides TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.guides TO authenticated;
GRANT ALL ON public.guides TO service_role;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read published guides" ON public.guides;
CREATE POLICY "Public can read published guides" ON public.guides
  FOR SELECT USING (
    (editorial_state = 'published' AND moderation_state = 'approved')
    OR public.has_role(auth.uid(), 'admin')
  );
DROP POLICY IF EXISTS "Admins manage guides" ON public.guides;
CREATE POLICY "Admins manage guides" ON public.guides
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS trg_careers_updated_at ON public.careers;
CREATE TRIGGER trg_careers_updated_at BEFORE UPDATE ON public.careers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS trg_skills_updated_at ON public.skills;
CREATE TRIGGER trg_skills_updated_at BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS trg_guides_updated_at ON public.guides;
CREATE TRIGGER trg_guides_updated_at BEFORE UPDATE ON public.guides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.mark_stale_catalogue_records()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  courses_count integer := 0;
  institutions_count integer := 0;
  opportunities_count integer := 0;
  funding_count integer := 0;
  careers_count integer := 0;
  skills_count integer := 0;
  guides_count integer := 0;
BEGIN
  UPDATE public.courses SET verification_status='stale', updated_at=now()
    WHERE verification_status <> 'stale'
      AND COALESCE(last_verified_at, created_at) < now() - (stale_after_days || ' days')::interval;
  GET DIAGNOSTICS courses_count = ROW_COUNT;
  UPDATE public.institutions SET verification_status='stale', updated_at=now()
    WHERE verification_status <> 'stale'
      AND COALESCE(last_verified_at, created_at) < now() - (stale_after_days || ' days')::interval;
  GET DIAGNOSTICS institutions_count = ROW_COUNT;
  UPDATE public.opportunities SET verification_status='stale', updated_at=now()
    WHERE verification_status <> 'stale'
      AND COALESCE(last_verified_at, created_at) < now() - (stale_after_days || ' days')::interval;
  GET DIAGNOSTICS opportunities_count = ROW_COUNT;
  UPDATE public.funding_windows SET verification_status='stale', updated_at=now()
    WHERE verification_status <> 'stale'
      AND COALESCE(last_verified_at, created_at) < now() - (stale_after_days || ' days')::interval;
  GET DIAGNOSTICS funding_count = ROW_COUNT;
  UPDATE public.careers SET verification_status='stale', updated_at=now()
    WHERE verification_status <> 'stale'
      AND COALESCE(last_verified_at, created_at) < now() - (stale_after_days || ' days')::interval;
  GET DIAGNOSTICS careers_count = ROW_COUNT;
  UPDATE public.skills SET verification_status='stale', updated_at=now()
    WHERE verification_status <> 'stale'
      AND COALESCE(last_verified_at, created_at) < now() - (stale_after_days || ' days')::interval;
  GET DIAGNOSTICS skills_count = ROW_COUNT;
  UPDATE public.guides SET verification_status='stale', updated_at=now()
    WHERE verification_status <> 'stale'
      AND COALESCE(last_verified_at, created_at) < now() - (stale_after_days || ' days')::interval;
  GET DIAGNOSTICS guides_count = ROW_COUNT;
  RETURN jsonb_build_object(
    'courses', courses_count,
    'institutions', institutions_count,
    'opportunities', opportunities_count,
    'funding_windows', funding_count,
    'careers', careers_count,
    'skills', skills_count,
    'guides', guides_count
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.mark_stale_catalogue_records() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mark_stale_catalogue_records() TO service_role;