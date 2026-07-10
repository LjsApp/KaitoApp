-- ============================================================
-- KAITO HIRO — MASTER SQL (Migration + Security)
-- Jalankan sekali di Supabase SQL Editor → "Run"
-- Aman untuk dijalankan berulang kali (idempotent)
-- Terakhir diperbarui: 2026-07-02
-- ============================================================

-- ============================================================
-- BAGIAN 1: HELPER FUNCTIONS
-- ============================================================

-- Trigger otomatis update kolom updated_at
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
  RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END; $$;


-- ============================================================
-- BAGIAN 2: TABEL — CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text         UNIQUE NOT NULL,
  name        text         NOT NULL,
  description text         DEFAULT '',
  image_url   text         DEFAULT '',
  sort_order  int          NOT NULL DEFAULT 0,
  created_at  timestamptz  NOT NULL DEFAULT now(),
  updated_at  timestamptz  NOT NULL DEFAULT now()
);

-- Hak akses: hanya SELECT untuk publik, semua untuk service_role
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL    ON public.categories TO service_role;
REVOKE INSERT, UPDATE, DELETE ON public.categories FROM anon, authenticated;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "categories public read" ON public.categories;
CREATE POLICY "categories public read" ON public.categories FOR SELECT USING (true);

DROP TRIGGER IF EXISTS categories_updated_at ON public.categories;
CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();


-- ============================================================
-- BAGIAN 3: TABEL — FEATURES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.features (
  id         uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text         UNIQUE NOT NULL,
  created_at timestamptz  NOT NULL DEFAULT now()
);

GRANT SELECT ON public.features TO anon, authenticated;
GRANT ALL    ON public.features TO service_role;
REVOKE INSERT, UPDATE, DELETE ON public.features FROM anon, authenticated;

ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "features public read" ON public.features;
CREATE POLICY "features public read" ON public.features FOR SELECT USING (true);


-- ============================================================
-- BAGIAN 4: TABEL — PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id           uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text         UNIQUE NOT NULL,
  sku          text         NOT NULL,
  name         text         NOT NULL,
  category_id  uuid         REFERENCES public.categories(id) ON DELETE SET NULL,
  tagline      text         DEFAULT '',
  description  text         DEFAULT '',
  gallery      jsonb        NOT NULL DEFAULT '[]'::jsonb,
  specs        jsonb        NOT NULL DEFAULT '[]'::jsonb,
  shopee_url   text         DEFAULT '',
  tokopedia_url text        DEFAULT '',
  document_url  text        DEFAULT '',
  featured     boolean      NOT NULL DEFAULT false,
  created_at   timestamptz  NOT NULL DEFAULT now(),
  updated_at   timestamptz  NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL    ON public.products TO service_role;
REVOKE INSERT, UPDATE, DELETE ON public.products FROM anon, authenticated;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "products public read" ON public.products;
CREATE POLICY "products public read" ON public.products FOR SELECT USING (true);

DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE INDEX IF NOT EXISTS products_category_idx ON public.products(category_id);


-- ============================================================
-- BAGIAN 5: TABEL — PRODUCT_FEATURES (relasi produk-fitur)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.product_features (
  product_id  uuid  REFERENCES public.products(id) ON DELETE CASCADE,
  feature_id  uuid  REFERENCES public.features(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, feature_id)
);

GRANT SELECT ON public.product_features TO anon, authenticated;
GRANT ALL    ON public.product_features TO service_role;
REVOKE INSERT, UPDATE, DELETE ON public.product_features FROM anon, authenticated;

ALTER TABLE public.product_features ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "product_features public read" ON public.product_features;
CREATE POLICY "product_features public read" ON public.product_features FOR SELECT USING (true);


-- ============================================================
-- BAGIAN 6: TABEL — ARTICLES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.articles (
  id           uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text         UNIQUE NOT NULL,
  title        text         NOT NULL,
  excerpt      text         DEFAULT '',
  category     text         DEFAULT '',
  cover_url    text         DEFAULT '',
  content      text         DEFAULT '',
  author       text         DEFAULT 'Tim KTH',
  published_at timestamptz  NOT NULL DEFAULT now(),
  created_at   timestamptz  NOT NULL DEFAULT now(),
  updated_at   timestamptz  NOT NULL DEFAULT now()
);

GRANT SELECT ON public.articles TO anon, authenticated;
GRANT ALL    ON public.articles TO service_role;
REVOKE INSERT, UPDATE, DELETE ON public.articles FROM anon, authenticated;

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "articles public read" ON public.articles;
CREATE POLICY "articles public read" ON public.articles FOR SELECT USING (true);

DROP TRIGGER IF EXISTS articles_updated_at ON public.articles;
CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();


-- ============================================================
-- BAGIAN 7: TABEL — CONTACT_MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text         NOT NULL,
  phone      text         DEFAULT '',
  email      text         DEFAULT '',
  subject    text         DEFAULT '',
  message    text         NOT NULL,
  read       boolean      NOT NULL DEFAULT false,
  created_at timestamptz  NOT NULL DEFAULT now()
);

-- Anon: HANYA bisa INSERT (kirim pesan), TIDAK bisa baca/ubah/hapus
-- service_role: akses penuh (untuk admin panel)
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL    ON public.contact_messages TO service_role;
REVOKE SELECT, UPDATE, DELETE ON public.contact_messages FROM anon, authenticated;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone can send message" ON public.contact_messages;
CREATE POLICY "anyone can send message" ON public.contact_messages
  FOR INSERT WITH CHECK (
    length(name) BETWEEN 1 AND 200 AND
    length(message) BETWEEN 1 AND 5000
  );


-- ============================================================
-- BAGIAN 8: TABEL — COMPANY_SETTINGS (singleton, id=1)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.company_settings (
  id            int          PRIMARY KEY DEFAULT 1,
  name          text         DEFAULT 'Kaito Hiro',
  phone         text         DEFAULT '',
  whatsapp      text         DEFAULT '',
  email         text         DEFAULT '',
  instagram     text         DEFAULT '',
  facebook      text         DEFAULT '',
  youtube       text         DEFAULT '',
  tiktok        text         DEFAULT '',
  address       text         DEFAULT '',
  map_embed     text         DEFAULT '',
  shopee_url    text         DEFAULT '',
  tokopedia_url text         DEFAULT '',
  working_hours text         DEFAULT 'Senin–Sabtu, 08.00–17.00 WIB',
  -- Kolom kredensial admin (SENSITIF — tidak boleh di-SELECT oleh anon)
  admin_username      text   NOT NULL DEFAULT '',
  admin_password_hash text   NOT NULL DEFAULT '',
  updated_at    timestamptz  NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- ⚠️ KEAMANAN: cabut dulu SELECT luas, lalu grant hanya kolom publik
REVOKE SELECT ON public.company_settings FROM anon, authenticated;
GRANT SELECT (
  id, name, phone, whatsapp, email,
  instagram, facebook, youtube, tiktok,
  address, map_embed, shopee_url, tokopedia_url, updated_at
) ON public.company_settings TO anon, authenticated;
-- Anon tidak boleh modifikasi data perusahaan
REVOKE INSERT, UPDATE, DELETE ON public.company_settings FROM anon, authenticated;
-- service_role: akses penuh (untuk server functions)
GRANT ALL ON public.company_settings TO service_role;

ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "company public read" ON public.company_settings;
CREATE POLICY "company public read" ON public.company_settings FOR SELECT USING (true);

DROP TRIGGER IF EXISTS company_updated_at ON public.company_settings;
CREATE TRIGGER company_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();


-- ============================================================
-- BAGIAN 9: STORAGE POLICY (bucket public-media)
-- ============================================================
DROP POLICY IF EXISTS "public-media read" ON storage.objects;
CREATE POLICY "public-media read" ON storage.objects
  FOR SELECT USING (bucket_id = 'public-media');


-- ============================================================
-- BAGIAN 10: DATA AWAL (baris default company_settings)
-- ============================================================
INSERT INTO public.company_settings (id, name)
VALUES (1, 'PT Kaito Hiro Indonesia')
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- SELESAI ✓
-- ============================================================
SELECT 'Master SQL Kaito Hiro berhasil diterapkan!' AS status;
