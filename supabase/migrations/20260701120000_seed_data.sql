
-- =============================================
-- SEED DATA — Kaito Hiro (KTH)
-- Run this AFTER the main schema migration
-- =============================================

-- Enable insert for service_role (already done in schema, just being explicit)

-- =============================================
-- COMPANY SETTINGS (singleton, id=1)
-- =============================================
INSERT INTO public.company_settings (id, name, phone, whatsapp, email, instagram, facebook, youtube, tiktok, address, map_embed, shopee_url, tokopedia_url)
VALUES (
  1,
  'PT Kaito Hiro Indonesia',
  '+62 812-3456-7890',
  '6281234567890',
  'info@kaitohiro.co.id',
  'https://instagram.com/kaitohiro.id',
  'https://facebook.com/kaitohiro',
  'https://youtube.com/@kaitohiro',
  'https://tiktok.com/@kaitohiro',
  'Jl. Industri Raya No. 88, Kawasan Industri Pulogadung, Jakarta Timur 13920',
  '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322135!2d106.89321841529394!3d-6.195795862386786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sKawasan%20Industri%20Pulogadung!5e0!3m2!1sid!2sid!4v1625000000000!5m2!1sid!2sid" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
  'https://shopee.co.id/kaitohiro',
  'https://tokopedia.com/kaitohiro'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  whatsapp = EXCLUDED.whatsapp,
  email = EXCLUDED.email,
  instagram = EXCLUDED.instagram,
  facebook = EXCLUDED.facebook,
  youtube = EXCLUDED.youtube,
  tiktok = EXCLUDED.tiktok,
  address = EXCLUDED.address,
  map_embed = EXCLUDED.map_embed,
  shopee_url = EXCLUDED.shopee_url,
  tokopedia_url = EXCLUDED.tokopedia_url;

-- =============================================
-- CATEGORIES
-- =============================================
INSERT INTO public.categories (slug, name, description, image_url, sort_order) VALUES
  ('jet-pump',     'Jet Pump',       'Sumur dalam hingga 30 meter',     '', 1),
  ('semi-jet',     'Semi Jet',       'Sumur sedang 9–20 meter',         '', 2),
  ('booster',      'Booster Pump',   'Penguat tekanan air',             '', 3),
  ('submersible',  'Submersible',    'Pompa celup tahan banting',       '', 4),
  ('industrial',   'Industrial',     'Operasi 24 jam non-stop',         '', 5),
  ('accessories',  'Accessories',    'Sparepart & aksesoris asli',      '', 6)
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order  = EXCLUDED.sort_order;

-- =============================================
-- FEATURES (master keunggulan)
-- =============================================
INSERT INTO public.features (name) VALUES
  ('Motor 100% Kawat Tembaga'),
  ('Bergaransi Resmi 1 Tahun'),
  ('Ber-SNI'),
  ('Anti Karat'),
  ('Hemat Energi'),
  ('Low Maintenance'),
  ('Gantungan Pompa 100% Kuningan'),
  ('Impeller Stainless Steel')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- PRODUCTS (sample)
-- =============================================
DO $$
DECLARE
  cat_jet      uuid;
  cat_semi     uuid;
  cat_booster  uuid;
  cat_sub      uuid;
  cat_ind      uuid;
  feat_tembaga uuid;
  feat_garansi uuid;
  feat_sni     uuid;
  feat_hemat   uuid;
  prod_1       uuid;
  prod_2       uuid;
  prod_3       uuid;
BEGIN
  SELECT id INTO cat_jet     FROM public.categories WHERE slug = 'jet-pump';
  SELECT id INTO cat_semi    FROM public.categories WHERE slug = 'semi-jet';
  SELECT id INTO cat_booster FROM public.categories WHERE slug = 'booster';
  SELECT id INTO cat_sub     FROM public.categories WHERE slug = 'submersible';
  SELECT id INTO cat_ind     FROM public.categories WHERE slug = 'industrial';

  SELECT id INTO feat_tembaga FROM public.features WHERE name = 'Motor 100% Kawat Tembaga';
  SELECT id INTO feat_garansi FROM public.features WHERE name = 'Bergaransi Resmi 1 Tahun';
  SELECT id INTO feat_sni     FROM public.features WHERE name = 'Ber-SNI';
  SELECT id INTO feat_hemat   FROM public.features WHERE name = 'Hemat Energi';

  -- Product 1: KTH-JP125
  INSERT INTO public.products (slug, sku, name, category_id, tagline, description, gallery, specs, shopee_url, tokopedia_url, featured)
  VALUES (
    'kth-jp125', 'KTH-JP125', 'Pompa Jet KTH-JP125', cat_jet,
    'Daya hisap hingga 30 meter, hemat listrik',
    'Pompa jet bertenaga tinggi dengan motor 100% kawat tembaga. Mampu menghisap air dari kedalaman hingga 30 meter dengan efisiensi tinggi. Cocok untuk rumah tangga hingga perumahan.',
    '[]'::jsonb,
    '[{"key":"Daya","value":"125 Watt"},{"key":"Total Head","value":"35 Meter"},{"key":"Debit Max","value":"30 L/menit"},{"key":"Daya Hisap","value":"30 Meter"},{"key":"Voltase","value":"220 V / 50 Hz"},{"key":"Berat","value":"8 Kg"}]'::jsonb,
    'https://shopee.co.id/kaitohiro/jp125',
    'https://tokopedia.com/kaitohiro/jp125',
    true
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prod_1;

  IF prod_1 IS NOT NULL THEN
    INSERT INTO public.product_features (product_id, feature_id) VALUES
      (prod_1, feat_tembaga), (prod_1, feat_garansi), (prod_1, feat_sni)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 2: KTH-BP75
  INSERT INTO public.products (slug, sku, name, category_id, tagline, description, gallery, specs, shopee_url, tokopedia_url, featured)
  VALUES (
    'kth-bp75', 'KTH-BP75', 'Booster Pump KTH-BP75', cat_booster,
    'Penguat tekanan air otomatis untuk lantai atas',
    'Booster pump otomatis yang menjaga tekanan air stabil. Dilengkapi pressure switch otomatis, cocok untuk shower, water heater, dan instalasi lantai atas.',
    '[]'::jsonb,
    '[{"key":"Daya","value":"75 Watt"},{"key":"Tekanan Max","value":"3.5 Bar"},{"key":"Debit Max","value":"20 L/menit"},{"key":"Voltase","value":"220 V / 50 Hz"},{"key":"Berat","value":"5 Kg"}]'::jsonb,
    'https://shopee.co.id/kaitohiro/bp75',
    'https://tokopedia.com/kaitohiro/bp75',
    true
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prod_2;

  IF prod_2 IS NOT NULL THEN
    INSERT INTO public.product_features (product_id, feature_id) VALUES
      (prod_2, feat_tembaga), (prod_2, feat_garansi), (prod_2, feat_hemat)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 3: KTH-SJ200
  INSERT INTO public.products (slug, sku, name, category_id, tagline, description, gallery, specs, shopee_url, tokopedia_url, featured)
  VALUES (
    'kth-sj200', 'KTH-SJ200', 'Semi Jet KTH-SJ200', cat_semi,
    'Andal untuk sumur 9–20 meter',
    'Pompa semi jet dengan performa tinggi untuk kebutuhan air rumah tangga. Daya hisap optimal hingga 20 meter dengan konsumsi listrik efisien.',
    '[]'::jsonb,
    '[{"key":"Daya","value":"200 Watt"},{"key":"Total Head","value":"25 Meter"},{"key":"Debit Max","value":"45 L/menit"},{"key":"Daya Hisap","value":"20 Meter"},{"key":"Voltase","value":"220 V / 50 Hz"},{"key":"Berat","value":"9 Kg"}]'::jsonb,
    '',
    '',
    true
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO prod_3;

  IF prod_3 IS NOT NULL THEN
    INSERT INTO public.product_features (product_id, feature_id) VALUES
      (prod_3, feat_tembaga), (prod_3, feat_garansi), (prod_3, feat_sni), (prod_3, feat_hemat)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- =============================================
-- ARTICLES (sample)
-- =============================================
INSERT INTO public.articles (slug, title, excerpt, category, cover_url, content, author, published_at) VALUES
(
  'cara-memilih-pompa-air',
  'Cara Memilih Pompa Air yang Tepat untuk Rumah',
  'Panduan lengkap memilih pompa air berdasarkan kedalaman sumur, kebutuhan air, dan jumlah penghuni.',
  'Panduan',
  '',
  '<h2>Kenali Kedalaman Sumur Anda</h2><p>Memilih pompa air yang tepat dimulai dari mengetahui kedalaman sumur Anda. Untuk sumur kurang dari 9 meter, pompa sumur dangkal sudah cukup. Untuk 9–20 meter, gunakan semi jet. Untuk lebih dari 20 meter, jet pump atau submersible adalah pilihan terbaik.</p><h2>Pertimbangkan Kebutuhan Debit Air</h2><p>Hitung kebutuhan air harian rumah Anda. Rata-rata per orang membutuhkan 120–150 liter per hari. Untuk keluarga 4 orang, minimal pilih pompa dengan debit 20–30 L/menit.</p><h2>Cek Daya Listrik yang Tersedia</h2><p>Pastikan daya listrik PLN di rumah Anda mencukupi untuk pompa yang dipilih. Pompa 125W membutuhkan minimal 450 VA, sementara pompa 200W membutuhkan 900 VA.</p>',
  'Tim KTH',
  '2026-06-12T00:00:00Z'
),
(
  'perawatan-pompa-air',
  '5 Tips Perawatan Pompa Air agar Awet 10 Tahun',
  'Rutinitas sederhana untuk memperpanjang umur pompa air Anda.',
  'Tips',
  '',
  '<h2>1. Bersihkan Filter Secara Berkala</h2><p>Bersihkan filter strainer setiap 3 bulan sekali untuk mencegah penyumbatan yang dapat merusak impeller pompa.</p><h2>2. Periksa Kapasitor</h2><p>Kapasitor yang lemah adalah penyebab utama pompa tidak mau hidup. Periksa setiap 6 bulan dan ganti jika sudah lemah.</p><h2>3. Cek Instalasi Pipa</h2><p>Pastikan tidak ada kebocoran pada instalasi pipa hisap maupun tekan. Kebocoran menyebabkan pompa bekerja lebih keras dan cepat aus.</p><h2>4. Jaga Pompa dari Terendam Air</h2><p>Pastikan pompa (kecuali submersible) tidak terendam air hujan. Letakkan di tempat yang terlindung dan berventilasi baik.</p><h2>5. Service Berkala</h2><p>Lakukan service di bengkel resmi KTH setiap 2 tahun sekali untuk memastikan semua komponen dalam kondisi optimal.</p>',
  'Tim KTH',
  '2026-05-28T00:00:00Z'
),
(
  'perbedaan-jet-vs-submersible',
  'Jet Pump vs Submersible: Mana yang Tepat?',
  'Perbandingan teknis dan biaya antara pompa jet dan pompa celup.',
  'Edukasi',
  '',
  '<h2>Jet Pump</h2><p>Jet pump dipasang di atas permukaan tanah. Perawatan mudah karena bisa diakses langsung. Cocok untuk sumur dalam hingga 30 meter. Harga relatif lebih terjangkau.</p><h2>Submersible</h2><p>Pompa celup terendam di dalam sumur. Lebih hemat energi untuk sumur sangat dalam (>30m). Lebih senyap karena berada di dalam air. Namun perawatan lebih sulit karena harus mengangkat pompa dari sumur.</p><h2>Kesimpulan</h2><p>Untuk sumur 9–30 meter dengan anggaran terbatas: pilih Jet Pump KTH. Untuk sumur >30 meter atau kebutuhan debit besar: pilih Submersible KTH.</p>',
  'Tim KTH',
  '2026-05-10T00:00:00Z'
),
(
  'garansi-resmi-kth',
  'Apa Saja yang Dicover Garansi Resmi KTH?',
  'Penjelasan lengkap mengenai garansi 1 tahun ganti unit baru dari Kaito Hiro.',
  'Garansi',
  '',
  '<h2>Garansi Ganti Unit Baru</h2><p>KTH memberikan garansi resmi 1 tahun ganti unit baru — bukan servis, bukan perbaikan. Jika produk Anda mengalami kerusakan dalam masa garansi akibat cacat produksi, kami ganti dengan unit baru.</p><h2>Yang Dicover</h2><ul><li>Kerusakan motor akibat cacat produksi</li><li>Kerusakan kapasitor bawaan</li><li>Kebocoran rumah pompa akibat cacat material</li></ul><h2>Yang Tidak Dicover</h2><ul><li>Kerusakan akibat instalasi yang salah</li><li>Kerusakan akibat tegangan listrik tidak stabil</li><li>Kerusakan akibat pompa terendam banjir (kecuali tipe submersible)</li></ul><h2>Cara Klaim</h2><p>Hubungi distributor resmi KTH terdekat dengan membawa produk dan bukti pembelian. Proses klaim maksimal 7 hari kerja.</p>',
  'Tim KTH',
  '2026-04-22T00:00:00Z'
)
ON CONFLICT (slug) DO UPDATE SET
  title        = EXCLUDED.title,
  excerpt      = EXCLUDED.excerpt,
  category     = EXCLUDED.category,
  content      = EXCLUDED.content,
  author       = EXCLUDED.author;
