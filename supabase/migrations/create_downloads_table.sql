-- ============================================================
-- CREATE TABLE: downloads
-- ============================================================
CREATE TABLE IF NOT EXISTS public.downloads (
  id           uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text         NOT NULL,
  type         text         NOT NULL, -- e.g., 'Brosur', 'Manual Book', 'Katalog'
  file_url     text         NOT NULL,
  size         text         DEFAULT '', -- Stored as string like '1.2 MB'
  created_at   timestamptz  NOT NULL DEFAULT now(),
  updated_at   timestamptz  NOT NULL DEFAULT now()
);

-- Row Level Security
GRANT SELECT ON public.downloads TO anon, authenticated;
GRANT ALL    ON public.downloads TO service_role;
REVOKE INSERT, UPDATE, DELETE ON public.downloads FROM anon, authenticated;

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "downloads public read" ON public.downloads;
CREATE POLICY "downloads public read" ON public.downloads FOR SELECT USING (true);

DROP TRIGGER IF EXISTS downloads_updated_at ON public.downloads;
CREATE TRIGGER downloads_updated_at
  BEFORE UPDATE ON public.downloads
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Insert data dummy awal (optional)
INSERT INTO public.downloads (title, type, file_url, size) VALUES
('Katalog Pompa Air KTH 2026', 'Katalog', 'https://esnshphonvfpzelvbjmv.supabase.co/storage/v1/object/public/public/downloads/dummy.pdf', '1.5 MB')
ON CONFLICT DO NOTHING;
