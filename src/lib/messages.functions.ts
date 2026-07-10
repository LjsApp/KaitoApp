// Admin-only server function to list contact messages (RLS blocks anon SELECT).
import { createServerFn } from "@tanstack/react-start";

export type AdminMessage = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
};

export const listMessagesAdmin = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("./admin-session.server");
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("contact_messages" as never)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AdminMessage[];
});
