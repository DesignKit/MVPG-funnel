-- RPC function for admin users table: joins profiles with auth.users (email)
-- and determines funnel progress from registrations/bookings/chat_sessions.
-- Runs as SECURITY DEFINER to access auth.users.

CREATE OR REPLACE FUNCTION get_admin_users(
  search_term text DEFAULT '',
  page_offset int DEFAULT 0,
  page_limit int DEFAULT 20
)
RETURNS TABLE (
  user_id uuid,
  display_name text,
  email text,
  role text,
  progress text,
  created_at timestamptz,
  total_count bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH user_progress AS (
    SELECT
      p.user_id,
      CASE
        WHEN EXISTS (SELECT 1 FROM chat_sessions cs WHERE cs.user_id = p.user_id AND cs.status = 'completed') THEN 'completed'
        WHEN EXISTS (SELECT 1 FROM bookings b WHERE b.user_id = p.user_id) THEN 'booked'
        WHEN EXISTS (SELECT 1 FROM registrations r WHERE r.user_id = p.user_id) THEN 'registered'
        ELSE NULL
      END AS progress
    FROM profiles p
  ),
  filtered AS (
    SELECT
      p.user_id,
      p.display_name,
      au.email,
      p.role::text,
      up.progress,
      p.created_at,
      COUNT(*) OVER () AS total_count
    FROM profiles p
    JOIN auth.users au ON au.id = p.user_id
    LEFT JOIN user_progress up ON up.user_id = p.user_id
    WHERE
      search_term = ''
      OR p.display_name ILIKE '%' || search_term || '%'
      OR au.email ILIKE '%' || search_term || '%'
    ORDER BY p.created_at DESC
    OFFSET page_offset
    LIMIT page_limit
  )
  SELECT * FROM filtered;
$$;
