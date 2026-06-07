
ALTER TABLE public.bursary_applications
  ADD COLUMN IF NOT EXISTS total_fee_payable numeric,
  ADD COLUMN IF NOT EXISTS fee_arrears numeric,
  ADD COLUMN IF NOT EXISTS monthly_budget numeric,
  ADD COLUMN IF NOT EXISTS received_bursary_before boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS previous_bursary_source text,
  ADD COLUMN IF NOT EXISTS previous_bursary_amount numeric;
