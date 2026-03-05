-- CRM Extensions: Replace HubSpot with Supabase as single source of truth
-- New columns on registrations + lead_activity_log + team_members tables

-- ============================================
-- 1. NEW CRM COLUMNS ON REGISTRATIONS
-- ============================================
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'website_funnel';
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS assigned_to text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS lead_status text NOT NULL DEFAULT 'open';
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS company text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS industry text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS budget text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS how_far_along text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS why_building_mvp text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS next_steps text;

-- External leads from Make.com may not have an idea description
ALTER TABLE public.registrations ALTER COLUMN idea_description DROP NOT NULL;

-- Indexes for common CRM queries
CREATE INDEX IF NOT EXISTS idx_registrations_source ON public.registrations(source);
CREATE INDEX IF NOT EXISTS idx_registrations_lead_status ON public.registrations(lead_status);
CREATE INDEX IF NOT EXISTS idx_registrations_assigned_to ON public.registrations(assigned_to);

-- ============================================
-- 2. LEAD ACTIVITY LOG
-- ============================================
CREATE TABLE IF NOT EXISTS public.lead_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_source text NOT NULL DEFAULT 'admin',
  description text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_activity_log ENABLE ROW LEVEL SECURITY;

-- Admins can read/write activity logs (service role bypasses RLS for webhooks)
CREATE POLICY "Admins can view activity logs"
  ON public.lead_activity_log FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can insert activity logs"
  ON public.lead_activity_log FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE INDEX IF NOT EXISTS idx_activity_log_registration ON public.lead_activity_log(registration_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON public.lead_activity_log(created_at DESC);

-- ============================================
-- 3. TEAM MEMBERS (for assignment dropdown)
-- ============================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  role text DEFAULT 'team',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view team members"
  ON public.team_members FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Seed team members
INSERT INTO public.team_members (name, email) VALUES
  ('Anton', null),
  ('Kole', null),
  ('Rhys', null)
ON CONFLICT DO NOTHING;
