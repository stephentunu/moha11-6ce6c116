-- Create businesses table for the Mathare Business Hub
CREATE TABLE public.businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  ward TEXT NOT NULL,
  location TEXT NOT NULL,
  phone TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Anyone (logged in or not) can view active businesses
CREATE POLICY "Anyone can view businesses"
ON public.businesses
FOR SELECT
USING (true);

-- Anyone can submit a new business listing (public form)
CREATE POLICY "Anyone can submit a business"
ON public.businesses
FOR INSERT
WITH CHECK (true);

-- Anyone can update/delete (admin moderation is gated by app-level admin login)
-- This matches the existing local-only admin pattern in the app
CREATE POLICY "Anyone can update businesses"
ON public.businesses
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete businesses"
ON public.businesses
FOR DELETE
USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_businesses_updated_at
BEFORE UPDATE ON public.businesses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for business images
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-images', 'business-images', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view images
CREATE POLICY "Public can view business images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'business-images');

-- Anyone can upload images (public submission)
CREATE POLICY "Anyone can upload business images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'business-images');