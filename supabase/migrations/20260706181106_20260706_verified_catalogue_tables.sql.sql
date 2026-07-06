/*
# Verified Catalogue Tables for SA Learn

This migration creates the verified catalogue tables that power SA Learn's core discovery features. These tables store institutions, courses, qualifications, opportunities, and funding windows with proper source tracking and verification status.

## Purpose

SA Learn's prototype currently uses static data in `src/lib/data.ts`. This migration creates the live database tables that will eventually replace that prototype data. Each table follows the "data before AI" principle - every record carries its source and verification metadata so learners know what they can trust.

## New Tables

1. `verification_status` enum
   - Tracks the verification state of every catalogue record
   - Values: unverified, provisional, verified, stale
   - Used by `TrustMetadata` component in frontend

2. `institutions`
   - Verified institution profiles (universities, TVET colleges, private providers)
   - Links to official DHET/SAQA registers
   - Stores application windows for admissions planning
   - Field names match `models/frontend-data-contract.md`

3. `courses`
   - Study programmes linked to institutions
   - NQF levels, SAQA qualification IDs, costs, funding notes
   - Delivery modes and locations
   - Application deadlines

4. `qualifications`
   - SAQA-registered qualifications (shared reference data)
   - NQF level and field of study
   - Sourced directly from SAQA NLRD

5. `opportunities`
   - Open applications, learnerships, internships, bursaries
   - Closing dates and requirements
   - Paid/unpaid status
   - Will integrate with stale-record cleanup

6. `funding_windows`
   - NSFAS, bursaries, scholarships, SETA funding
   - Eligibility rules stored as JSONB for flexibility
   - Deadline tracking

## Security

- RLS enabled on all tables
- SELECT policies: `TO anon, authenticated` - public catalogue data is intentionally readable by everyone
- INSERT/UPDATE/DELETE policies: `TO authenticated` with role check - only admins and institution users can modify catalogue data
- This allows public browsing (no login required) while protecting write access

## Important Notes

1. All tables use `slug` as the public identifier to match frontend routes (`/courses/:slug`)
2. `last_verified_at` timestamps will drive stale-record detection (>90 days = stale)
3. Field names intentionally mirror `models/frontend-data-contract.md` so Codex's frontend can swap loaders mechanically
4. The `saved_items` table from Phase 1 already has polymorphic enum for course/career/institution/opportunity/funding links
5. JSONB columns (`eligibility_rules`) allow flexible rule storage without schema migrations for each funding provider

## Future Work

- Add indexes for common query patterns
- Create `source_records` table for tracking data import jobs
- Add `programme_requirements` table for match engine rules
- Admin UI for verification workflow
*/

-- Verification status enum
DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('unverified', 'provisional', 'verified', 'stale');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Opportunity type enum
DO $$ BEGIN
  CREATE TYPE opportunity_type AS ENUM ('application', 'bursary', 'learnership', 'internship', 'apprenticeship', 'job', 'graduate_programme');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Delivery mode enum
DO $$ BEGIN
  CREATE TYPE delivery_mode AS ENUM ('contact', 'online', 'blended', 'workplace');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- INSTITUTIONS
-- ============================================

CREATE TABLE IF NOT EXISTS institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  type text NOT NULL, -- 'Public University', 'University of Technology', 'TVET College', 'Private College', etc.
  province text,
  website text,
  campuses text[] DEFAULT '{}',
  courses_count integer DEFAULT 0,
  funding_notes text,
  accreditation_status text,
  register_links jsonb DEFAULT '[]'::jsonb, -- Array of {label, url}
  application_windows jsonb DEFAULT '[]'::jsonb, -- Array of {label, period, status}
  source_url text,
  source_name text,
  last_verified_at timestamptz,
  verification_status verification_status DEFAULT 'unverified',
  status text DEFAULT 'active', -- active, closed, under_review
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

-- Public read for catalogue browsing
DROP POLICY IF EXISTS "anon_read_institutions" ON institutions;
CREATE POLICY "anon_read_institutions" ON institutions FOR SELECT
  TO anon, authenticated USING (true);

-- Admin/institution users can write
DROP POLICY IF EXISTS "admin_write_institutions" ON institutions;
CREATE POLICY "admin_write_institutions" ON institutions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'institution')
    )
  );

DROP POLICY IF EXISTS "admin_update_institutions" ON institutions;
CREATE POLICY "admin_update_institutions" ON institutions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'institution')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'institution')
    )
  );

DROP POLICY IF EXISTS "admin_delete_institutions" ON institutions;
CREATE POLICY "admin_delete_institutions" ON institutions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- ============================================
-- QUALIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS qualifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  saqa_id text UNIQUE,
  title text NOT NULL,
  nqf_level integer,
  field_of_study text,
  source_url text,
  last_verified_at timestamptz,
  verification_status verification_status DEFAULT 'unverified',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE qualifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_qualifications" ON qualifications;
CREATE POLICY "anon_read_qualifications" ON qualifications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_qualifications" ON qualifications;
CREATE POLICY "admin_write_qualifications" ON qualifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "admin_update_qualifications" ON qualifications;
CREATE POLICY "admin_update_qualifications" ON qualifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "admin_delete_qualifications" ON qualifications;
CREATE POLICY "admin_delete_qualifications" ON qualifications FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- ============================================
-- COURSES
-- ============================================

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  institution_id uuid REFERENCES institutions(id) ON DELETE SET NULL,
  qualification_id uuid REFERENCES qualifications(id) ON DELETE SET NULL,
  qualification_type text, -- 'Degree', 'Diploma', 'Higher Certificate', etc.
  nqf_level integer,
  duration text,
  delivery_mode delivery_mode,
  city text,
  province text,
  cost_estimate text,
  funding_notes text,
  application_deadline date,
  official_page_url text,
  careers text[] DEFAULT '{}',
  accreditation_notes text,
  category text, -- 'universities', 'tvet', 'private-colleges', 'short-courses', etc.
  source_url text,
  source_name text,
  last_verified_at timestamptz,
  verification_status verification_status DEFAULT 'unverified',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_courses" ON courses;
CREATE POLICY "anon_read_courses" ON courses FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_courses" ON courses;
CREATE POLICY "admin_write_courses" ON courses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'institution')
    )
  );

DROP POLICY IF EXISTS "admin_update_courses" ON courses;
CREATE POLICY "admin_update_courses" ON courses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'institution')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'institution')
    )
  );

DROP POLICY IF EXISTS "admin_delete_courses" ON courses;
CREATE POLICY "admin_delete_courses" ON courses FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- ============================================
-- OPPORTUNITIES
-- ============================================

CREATE TABLE IF NOT EXISTS opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  title text NOT NULL,
  provider text,
  type opportunity_type NOT NULL,
  sector text,
  province text,
  requirements text,
  closing_date date,
  application_url text,
  paid boolean DEFAULT false,
  source_url text,
  source_name text,
  last_verified_at timestamptz,
  verification_status verification_status DEFAULT 'unverified',
  status text DEFAULT 'open', -- open, closed, expired
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_opportunities" ON opportunities;
CREATE POLICY "anon_read_opportunities" ON opportunities FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_opportunities" ON opportunities;
CREATE POLICY "admin_write_opportunities" ON opportunities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "admin_update_opportunities" ON opportunities;
CREATE POLICY "admin_update_opportunities" ON opportunities FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "admin_delete_opportunities" ON opportunities;
CREATE POLICY "admin_delete_opportunities" ON opportunities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- ============================================
-- FUNDING WINDOWS
-- ============================================

CREATE TABLE IF NOT EXISTS funding_windows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  provider text,
  short_description text,
  eligibility_rules jsonb DEFAULT '{}'::jsonb,
  coverage text,
  required_documents text[] DEFAULT '{}',
  deadline text,
  official_url text,
  linked_fields text[] DEFAULT '{}',
  linked_institution_types text[] DEFAULT '{}',
  source_url text,
  source_name text,
  last_verified_at timestamptz,
  verification_status verification_status DEFAULT 'unverified',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE funding_windows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_funding_windows" ON funding_windows;
CREATE POLICY "anon_read_funding_windows" ON funding_windows FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_funding_windows" ON funding_windows;
CREATE POLICY "admin_write_funding_windows" ON funding_windows FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "admin_update_funding_windows" ON funding_windows;
CREATE POLICY "admin_update_funding_windows" ON funding_windows FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "admin_delete_funding_windows" ON funding_windows;
CREATE POLICY "admin_delete_funding_windows" ON funding_windows FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- ============================================
-- CAREERS
-- ============================================

CREATE TABLE IF NOT EXISTS careers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  short_description text,
  demand text, -- 'High', 'Growing', 'Stable'
  salary_range text,
  salary_bands jsonb DEFAULT '{}'::jsonb, -- {entry, mid, senior}
  outlook text,
  personality_fit text[] DEFAULT '{}',
  helpful_subjects text[] DEFAULT '{}',
  study_routes text[] DEFAULT '{}',
  skills text[] DEFAULT '{}',
  daily_work text[] DEFAULT '{}',
  entry_roles text[] DEFAULT '{}',
  timeline text[] DEFAULT '{}',
  related_course_slugs text[] DEFAULT '{}',
  related_skill_slugs text[] DEFAULT '{}',
  source_url text,
  source_name text,
  last_verified_at timestamptz,
  verification_status verification_status DEFAULT 'unverified',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE careers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_careers" ON careers;
CREATE POLICY "anon_read_careers" ON careers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_careers" ON careers;
CREATE POLICY "admin_write_careers" ON careers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "admin_update_careers" ON careers;
CREATE POLICY "admin_update_careers" ON careers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "admin_delete_careers" ON careers;
CREATE POLICY "admin_delete_careers" ON careers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- ============================================
-- SKILLS
-- ============================================

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  difficulty text, -- 'Beginner', 'Intermediate', 'Advanced'
  estimated_time text,
  related_career_slugs text[] DEFAULT '{}',
  learning_track text[] DEFAULT '{}',
  practice_task text,
  source_url text,
  source_name text,
  last_verified_at timestamptz,
  verification_status verification_status DEFAULT 'unverified',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_skills" ON skills;
CREATE POLICY "anon_read_skills" ON skills FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_skills" ON skills;
CREATE POLICY "admin_write_skills" ON skills FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "admin_update_skills" ON skills;
CREATE POLICY "admin_update_skills" ON skills FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "admin_delete_skills" ON skills;
CREATE POLICY "admin_delete_skills" ON skills FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- ============================================
-- GUIDES
-- ============================================

CREATE TABLE IF NOT EXISTS guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  summary text,
  category text, -- 'Glossary', 'How-to', 'Comparison', 'Planning'
  plain_language text,
  key_points text[] DEFAULT '{}',
  steps text[] DEFAULT '{}',
  related_terms text[] DEFAULT '{}',
  source_url text,
  source_name text,
  last_verified_at timestamptz,
  verification_status verification_status DEFAULT 'unverified',
  publish_status text DEFAULT 'draft', -- draft, review, published
  reviewed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE guides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_published_guides" ON guides;
CREATE POLICY "anon_read_published_guides" ON guides FOR SELECT
  TO anon, authenticated
  USING (publish_status = 'published');

DROP POLICY IF EXISTS "admin_write_guides" ON guides;
CREATE POLICY "admin_write_guides" ON guides FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "admin_update_guides" ON guides;
CREATE POLICY "admin_update_guides" ON guides FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "admin_delete_guides" ON guides;
CREATE POLICY "admin_delete_guides" ON guides FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- ============================================
-- INDEXES FOR COMMON QUERIES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_institutions_slug ON institutions(slug);
CREATE INDEX IF NOT EXISTS idx_institutions_type ON institutions(type);
CREATE INDEX IF NOT EXISTS idx_institutions_province ON institutions(province);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_institution ON courses(institution_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_nqf_level ON courses(nqf_level);
CREATE INDEX IF NOT EXISTS idx_courses_province ON courses(province);
CREATE INDEX IF NOT EXISTS idx_courses_delivery_mode ON courses(delivery_mode);

CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_sector ON opportunities(sector);
CREATE INDEX IF NOT EXISTS idx_opportunities_province ON opportunities(province);
CREATE INDEX IF NOT EXISTS idx_opportunities_closing_date ON opportunities(closing_date);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);

CREATE INDEX IF NOT EXISTS idx_funding_windows_slug ON funding_windows(slug);

CREATE INDEX IF NOT EXISTS idx_careers_slug ON careers(slug);

CREATE INDEX IF NOT EXISTS idx_skills_slug ON skills(slug);

CREATE INDEX IF NOT EXISTS idx_guides_slug ON guides(slug);
CREATE INDEX IF NOT EXISTS idx_guides_publish_status ON guides(publish_status);

-- ============================================
-- UPDATED AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all catalogue tables
DO $$ BEGIN
  DROP TRIGGER IF EXISTS update_institutions_updated_at ON institutions;
  CREATE TRIGGER update_institutions_updated_at BEFORE UPDATE ON institutions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN others THEN null;
END $$;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
  CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN others THEN null;
END $$;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS update_qualifications_updated_at ON qualifications;
  CREATE TRIGGER update_qualifications_updated_at BEFORE UPDATE ON qualifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN others THEN null;
END $$;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS update_opportunities_updated_at ON opportunities;
  CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN others THEN null;
END $$;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS update_funding_windows_updated_at ON funding_windows;
  CREATE TRIGGER update_funding_windows_updated_at BEFORE UPDATE ON funding_windows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN others THEN null;
END $$;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS update_careers_updated_at ON careers;
  CREATE TRIGGER update_careers_updated_at BEFORE UPDATE ON careers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN others THEN null;
END $$;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
  CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN others THEN null;
END $$;

DO $$ BEGIN
  DROP TRIGGER IF EXISTS update_guides_updated_at ON guides;
  CREATE TRIGGER update_guides_updated_at BEFORE UPDATE ON guides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN others THEN null;
END $$;
