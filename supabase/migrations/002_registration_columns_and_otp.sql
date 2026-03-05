-- Add name/email to registrations (server action already sends these but columns don't exist)
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS email text;
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);
