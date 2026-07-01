
CREATE TABLE public.campaign_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL UNIQUE,
  media_type text NOT NULL CHECK (media_type IN ('image','video')),
  mime_type text,
  title text,
  caption text,
  size_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.campaign_media TO anon, authenticated;
GRANT ALL ON public.campaign_media TO service_role;

ALTER TABLE public.campaign_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read campaign media" ON public.campaign_media
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "anyone insert campaign media" ON public.campaign_media
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "anyone delete campaign media" ON public.campaign_media
  FOR DELETE TO anon, authenticated USING (true);

CREATE POLICY "read campaign-media objects" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'campaign-media');

CREATE POLICY "upload campaign-media objects" ON storage.objects
  FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'campaign-media');

CREATE POLICY "delete campaign-media objects" ON storage.objects
  FOR DELETE TO anon, authenticated USING (bucket_id = 'campaign-media');
