CREATE TABLE IF NOT EXISTS public.pricing_tiers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), key text UNIQUE NOT NULL, name text NOT NULL, badge text, duration text, price_cents integer NOT NULL DEFAULT 0, display_price text NOT NULL, stripe_price_id text, features jsonb NOT NULL DEFAULT '[]', recommended boolean DEFAULT false, sort_order integer DEFAULT 0, active boolean DEFAULT true, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now());

INSERT INTO public.pricing_tiers (key, name, badge, duration, price_cents, display_price, features, recommended, sort_order) VALUES ('questionnaire', 'Questionnaire', 'Get started', '60-90 minutes', 0, 'FREE', '["Detailed requirements gathering at your own pace","Comprehensive context"]'::jsonb, false, 1);

INSERT INTO public.pricing_tiers (key, name, badge, duration, price_cents, display_price, features, recommended, sort_order) VALUES ('ai-workshop', 'AI Workshop', 'Recommended for you', '8-10 minutes', 4900, '$49', '["Detailed requirements gathering at a rapid pace","Comprehensive context","AI driven insights","Immediate product roadmap"]'::jsonb, true, 2);

INSERT INTO public.pricing_tiers (key, name, badge, duration, price_cents, display_price, features, recommended, sort_order) VALUES ('comprehensive-workshop', 'Comprehensive Product Workshop', NULL, '4-5 hours', 119900, '$1,199', '["Deducted from MVP build","Complete stakeholder alignment","Comprehensive tech architecture","Detailed sprint planning"]'::jsonb, false, 3);

ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active pricing tiers" ON public.pricing_tiers FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage pricing tiers" ON public.pricing_tiers FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin', 'super_admin')));
