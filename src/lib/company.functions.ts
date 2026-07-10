import { createServerFn } from "@tanstack/react-start";

export type CompanySettings = {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  address: string;
  map_embed: string;
  shopee_url: string;
  tokopedia_url: string;
  working_hours: string;
};

const COMPANY_PUBLIC_COLUMNS = "id,name,phone,whatsapp,email,instagram,facebook,youtube,tiktok,address,map_embed,shopee_url,tokopedia_url,working_hours,updated_at";

export const getCompany = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // Hanya pilih kolom publik — JANGAN ambil admin_username / admin_password_hash
  const { data, error } = await supabaseAdmin
    .from("company_settings" as never)
    .select(COMPANY_PUBLIC_COLUMNS as never)
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return (data ?? {}) as unknown as CompanySettings;
});


export const updateCompany = createServerFn({ method: "POST" })
  .validator((d: Partial<CompanySettings>) => d)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("company_settings" as never).update({ ...data, updated_at: new Date().toISOString() } as never).eq("id", 1);
    if (error) throw error;
    return { ok: true };
  });
