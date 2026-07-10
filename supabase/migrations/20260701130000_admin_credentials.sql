
-- Tambah kolom admin credentials ke company_settings
ALTER TABLE public.company_settings 
  ADD COLUMN IF NOT EXISTS admin_username text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS admin_password_hash text NOT NULL DEFAULT '';
