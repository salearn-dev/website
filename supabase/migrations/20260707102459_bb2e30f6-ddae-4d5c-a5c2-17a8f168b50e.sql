
-- Phase 2: Verified catalogue tables
CREATE TYPE public.verification_status AS ENUM ('unverified', 'provisional', 'verified', 'stale');
CREATE TYPE public.moderation_state AS ENUM ('draft', 'submitted', 'approved', 'rejected');

-- Institutions
CREATE TABLE public.institutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT,
  province TEXT,
  website TEXT,
  funding_notes TEXT,
  accreditation_status TEXT,
  campuses JSONB DEFAULT '[]'::jsonb,
  register_links JSONB DEFAULT '[]'::jsonb,
  application_windows JSONB DEFAULT '[]'::jsonb,
  source_name TEXT,
  source_url TEXT,
  last_verified_at TIMESTAMPTZ,
  verification_status public.verification_status NOT NULL DEFAULT 'unverified',
  stale_after_days INTEGER NOT NULL DEFAULT 180,
  moderation_state public.moderation_state NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.institutions TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.institutions TO authenticated;
GRANT ALL ON public.institutions TO service_role;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read approved institutions" ON public.institutions
  FOR SELECT USING (moderation_state = 'approved' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage institutions" ON public.institutions
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Institution role can insert own institutions" ON public.institutions
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'institution'));

-- Qualifications (NQF level reference)
CREATE TABLE public.qualifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  nqf_level INTEGER,
  description TEXT,
  source_url TEXT,
  last_verified_at TIMESTAMPTZ,
  verification_status public.verification_status NOT NULL DEFAULT 'unverified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.qualifications TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.qualifications TO authenticated;
GRANT ALL ON public.qualifications TO service_role;
ALTER TABLE public.qualifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read qualifications" ON public.qualifications FOR SELECT USING (true);
CREATE POLICY "Admins manage qualifications" ON public.qualifications
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Courses
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
  institution_name TEXT,
  qualification_id UUID REFERENCES public.qualifications(id) ON DELETE SET NULL,
  qualification TEXT,
  nqf INTEGER,
  duration TEXT,
  cost TEXT,
  funding TEXT,
  careers TEXT[] DEFAULT '{}',
  province TEXT,
  city TEXT,
  delivery_mode TEXT,
  category TEXT,
  accreditation TEXT,
  source_name TEXT,
  source_url TEXT,
  last_verified_at TIMESTAMPTZ,
  verification_status public.verification_status NOT NULL DEFAULT 'unverified',
  stale_after_days INTEGER NOT NULL DEFAULT 180,
  moderation_state public.moderation_state NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read approved courses" ON public.courses
  FOR SELECT USING (moderation_state = 'approved' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage courses" ON public.courses
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Institution role can insert courses" ON public.courses
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'institution'));

-- Opportunities
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  category TEXT,
  sector TEXT,
  type TEXT,
  province TEXT,
  provider TEXT,
  closing_date DATE,
  paid TEXT,
  description TEXT,
  source_name TEXT,
  source_url TEXT,
  last_verified_at TIMESTAMPTZ,
  verification_status public.verification_status NOT NULL DEFAULT 'unverified',
  stale_after_days INTEGER NOT NULL DEFAULT 30,
  moderation_state public.moderation_state NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.opportunities TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.opportunities TO authenticated;
GRANT ALL ON public.opportunities TO service_role;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read approved opportunities" ON public.opportunities
  FOR SELECT USING (moderation_state = 'approved' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage opportunities" ON public.opportunities
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Funding windows
CREATE TABLE public.funding_windows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  provider TEXT,
  short TEXT,
  eligibility TEXT,
  coverage TEXT,
  best_for TEXT,
  deadline DATE,
  source_name TEXT,
  source_url TEXT,
  last_verified_at TIMESTAMPTZ,
  verification_status public.verification_status NOT NULL DEFAULT 'unverified',
  stale_after_days INTEGER NOT NULL DEFAULT 90,
  moderation_state public.moderation_state NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.funding_windows TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.funding_windows TO authenticated;
GRANT ALL ON public.funding_windows TO service_role;
ALTER TABLE public.funding_windows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read approved funding windows" ON public.funding_windows
  FOR SELECT USING (moderation_state = 'approved' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage funding windows" ON public.funding_windows
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at triggers
CREATE TRIGGER trg_institutions_updated_at BEFORE UPDATE ON public.institutions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_qualifications_updated_at BEFORE UPDATE ON public.qualifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_opportunities_updated_at BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_funding_windows_updated_at BEFORE UPDATE ON public.funding_windows FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helpful indexes
CREATE INDEX idx_courses_institution ON public.courses(institution_id);
CREATE INDEX idx_courses_category ON public.courses(category);
CREATE INDEX idx_opportunities_closing ON public.opportunities(closing_date);
CREATE INDEX idx_funding_windows_deadline ON public.funding_windows(deadline);
