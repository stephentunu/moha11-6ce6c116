-- Deduplicate any existing rows by phone, keeping the oldest
DELETE FROM public.supporters a
USING public.supporters b
WHERE a.phone = b.phone
  AND a.created_at > b.created_at;

ALTER TABLE public.supporters
  ADD CONSTRAINT supporters_phone_unique UNIQUE (phone);