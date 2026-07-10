-- ============================================================
-- SQL SCRIPT UNTUK MENAMBAHKAN JAM OPERASIONAL
-- Jalankan kode ini di Supabase SQL Editor
-- ============================================================

-- 1. Tambahkan kolom working_hours jika belum ada
ALTER TABLE public.company_settings 
ADD COLUMN IF NOT EXISTS working_hours text DEFAULT 'Senin–Sabtu, 08.00–17.00 WIB';

-- 2. Perbarui hak akses (GRANT) untuk anonymous users agar bisa membaca kolom baru ini
-- (Kita perlu DROP SELECT privileges dulu agar bisa di set ulang dengan list kolom terbaru)
REVOKE SELECT ON public.company_settings FROM anon, authenticated;
GRANT SELECT (
  id, name, phone, whatsapp, email,
  instagram, facebook, youtube, tiktok,
  address, map_embed, shopee_url, tokopedia_url, working_hours, updated_at
) ON public.company_settings TO anon, authenticated;

-- Pastikan service_role memiliki akses penuh
GRANT ALL ON public.company_settings TO service_role;
