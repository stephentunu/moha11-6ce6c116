
ALTER TABLE public.bursary_applications
  ADD COLUMN IF NOT EXISTS father_name text,
  ADD COLUMN IF NOT EXISTS father_phone text,
  ADD COLUMN IF NOT EXISTS father_occupation text,
  ADD COLUMN IF NOT EXISTS father_national_id text,
  ADD COLUMN IF NOT EXISTS mother_name text,
  ADD COLUMN IF NOT EXISTS mother_phone text,
  ADD COLUMN IF NOT EXISTS mother_occupation text,
  ADD COLUMN IF NOT EXISTS mother_national_id text;

ALTER TABLE public.bursary_applications
  ALTER COLUMN reference SET DEFAULT (
    'BUR-' || to_char(now(), 'YYYYMM') || '-' || upper(substr(replace((gen_random_uuid())::text, '-', ''), 1, 6))
  );
