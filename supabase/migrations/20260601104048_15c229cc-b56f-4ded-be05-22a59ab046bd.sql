-- Extend businesses with directory fields
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS image_urls text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS street text,
  ADD COLUMN IF NOT EXISTS contacts text,
  ADD COLUMN IF NOT EXISTS payment_methods text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS till_paybill_number text,
  ADD COLUMN IF NOT EXISTS nearest_transport text,
  ADD COLUMN IF NOT EXISTS delivery_available boolean NOT NULL DEFAULT false;

-- Bursary applications table
CREATE TABLE IF NOT EXISTS public.bursary_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE DEFAULT ('BUR-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  student_name text NOT NULL,
  dob date,
  gender text,
  id_or_birth_cert_number text,
  phone text,
  school_name text NOT NULL,
  current_grade text NOT NULL,
  kcse_year text,
  guardian_name text NOT NULL,
  guardian_phone text NOT NULL,
  ward text,
  residence_estate text,
  household_income_band text,
  siblings_in_school integer DEFAULT 0,
  amount_requested numeric DEFAULT 0,
  reason text,
  supporting_doc_url text,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  sms_last_sent_at timestamptz,
  sms_last_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.bursary_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bursary_applications TO authenticated;
GRANT ALL ON public.bursary_applications TO service_role;

ALTER TABLE public.bursary_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit bursary applications"
ON public.bursary_applications FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Anyone can view bursary applications"
ON public.bursary_applications FOR SELECT TO public USING (true);

CREATE POLICY "Anyone can update bursary applications"
ON public.bursary_applications FOR UPDATE TO public USING (true);

CREATE POLICY "Anyone can delete bursary applications"
ON public.bursary_applications FOR DELETE TO public USING (true);

CREATE TRIGGER update_bursary_applications_updated_at
BEFORE UPDATE ON public.bursary_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Service ratings (polling) table for aggregating Best/Fairly/Worst votes
CREATE TABLE IF NOT EXISTS public.service_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text NOT NULL,
  rating text NOT NULL,
  ward text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.service_ratings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_ratings TO authenticated;
GRANT ALL ON public.service_ratings TO service_role;

ALTER TABLE public.service_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert service ratings"
ON public.service_ratings FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Anyone can view service ratings"
ON public.service_ratings FOR SELECT TO public USING (true);