ALTER TABLE public.campaign_media ADD COLUMN IF NOT EXISTS topic text;
CREATE INDEX IF NOT EXISTS campaign_media_topic_idx ON public.campaign_media (topic);