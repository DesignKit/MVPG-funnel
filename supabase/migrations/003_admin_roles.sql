-- Extend existing user_role enum (blog created profiles with this enum)
-- NOTE: Must run in a separate transaction from INSERTs using new values.
-- If running manually, execute these two lines first, then the rest.
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ============================================
-- Base policy: users can always read their own profile row
-- (required before admin policies — otherwise the self-referencing
--  admin subquery creates an RLS circular dependency)
-- ============================================

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (user_id = auth.uid());

-- ============================================
-- Admin RLS policies: SELECT on all 6 tables
-- (profiles uses user_id as FK to auth.users, not id)
-- ============================================

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can view all chat_sessions"
  ON public.chat_sessions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can view all chat_responses"
  ON public.chat_responses FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can view all registrations"
  ON public.registrations FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can view all project_outlines"
  ON public.project_outlines FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- ============================================
-- Admin RLS policies: UPDATE on data tables
-- ============================================

CREATE POLICY "Admins can update registrations"
  ON public.registrations FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can update bookings"
  ON public.bookings FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins can update project_outlines"
  ON public.project_outlines FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- ============================================
-- Super admin only: can UPDATE profiles.role
-- ============================================

CREATE POLICY "Super admins can update any profile"
  ON public.profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'super_admin')
  );
