
CREATE TABLE public.supporters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL UNIQUE,
  id_number text NOT NULL,
  ward text,
  notes text DEFAULT '',
  opted_out boolean NOT NULL DEFAULT false,
  opt_out_token text NOT NULL DEFAULT replace(gen_random_uuid()::text, '-', ''),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.supporters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view supporters" ON public.supporters FOR SELECT USING (true);
CREATE POLICY "Anyone can insert supporters" ON public.supporters FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update supporters" ON public.supporters FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete supporters" ON public.supporters FOR DELETE USING (true);

CREATE TRIGGER update_supporters_updated_at
BEFORE UPDATE ON public.supporters
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.bulk_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  audience_ward text,
  total_recipients int NOT NULL DEFAULT 0,
  sent_count int NOT NULL DEFAULT 0,
  failed_count int NOT NULL DEFAULT 0,
  skipped_count int NOT NULL DEFAULT 0,
  provider text NOT NULL DEFAULT 'africastalking',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bulk_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view bulk_messages" ON public.bulk_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can insert bulk_messages" ON public.bulk_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update bulk_messages" ON public.bulk_messages FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete bulk_messages" ON public.bulk_messages FOR DELETE USING (true);

CREATE TABLE public.bulk_message_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bulk_message_id uuid NOT NULL REFERENCES public.bulk_messages(id) ON DELETE CASCADE,
  supporter_id uuid REFERENCES public.supporters(id) ON DELETE SET NULL,
  phone text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  provider_response text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bulk_message_recipients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view bulk_message_recipients" ON public.bulk_message_recipients FOR SELECT USING (true);
CREATE POLICY "Anyone can insert bulk_message_recipients" ON public.bulk_message_recipients FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update bulk_message_recipients" ON public.bulk_message_recipients FOR UPDATE USING (true);

CREATE INDEX idx_bmr_bulk ON public.bulk_message_recipients(bulk_message_id);
CREATE INDEX idx_supporters_ward ON public.supporters(ward);
CREATE INDEX idx_supporters_opted_out ON public.supporters(opted_out);
