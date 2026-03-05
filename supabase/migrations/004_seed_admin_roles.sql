-- Seed admin roles for known team emails
-- Match via auth.users since profiles table has no email column

UPDATE public.profiles SET role = 'super_admin'
WHERE user_id IN (
  SELECT id FROM auth.users
  WHERE email IN ('ruhalt26@gmail.com', 'hello@mvpgurus.com', 'delivery@mvpgurus.com')
);

UPDATE public.profiles SET role = 'admin'
WHERE user_id IN (
  SELECT id FROM auth.users WHERE email = 'accounts@mvpgurus.com'
);

-- Update the signup trigger to auto-assign roles for known team emails
-- Blog profiles schema: user_id, display_name, role (user_role enum)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  assigned_role user_role := 'user';
BEGIN
  IF new.email IN ('ruhalt26@gmail.com', 'hello@mvpgurus.com', 'delivery@mvpgurus.com') THEN
    assigned_role := 'super_admin';
  ELSIF new.email = 'accounts@mvpgurus.com' THEN
    assigned_role := 'admin';
  END IF;

  INSERT INTO public.profiles (user_id, display_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', assigned_role);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
