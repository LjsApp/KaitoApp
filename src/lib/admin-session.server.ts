// Server-only helper: admin session utilities (encrypted cookie) + DB-based credentials.
import { useSession } from "@tanstack/react-start/server";
import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

type AdminSession = { admin?: boolean; username?: string };

function config() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  // Di production WAJIB set ADMIN_SESSION_SECRET — jika tidak, session bisa dipalsukan.
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("[FATAL] ADMIN_SESSION_SECRET env var harus diset di production!");
  }
  const password = secret || "kth-admin-fallback-secret-dev-only";
  return {
    password,
    name: "kth-admin",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

// ── Password utilities ─────────────────────────────────────────────────────────

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 100_000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const testHash = pbkdf2Sync(password, salt, 100_000, 64, "sha512");
    const storedHash = Buffer.from(hash, "hex");
    if (testHash.length !== storedHash.length) return false;
    return timingSafeEqual(testHash, storedHash);
  } catch {
    return false;
  }
}

// ── DB credential helpers ──────────────────────────────────────────────────────

async function getAdminCredentials(): Promise<{ username: string; password_hash: string } | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("company_settings" as never)
    .select("admin_username, admin_password_hash")
    .eq("id", 1)
    .maybeSingle();
  if (!data) return null;
  const row = data as { admin_username: string; admin_password_hash: string };
  if (!row.admin_username || !row.admin_password_hash) return null;
  return { username: row.admin_username, password_hash: row.admin_password_hash };
}

/** Returns true if admin credentials have been configured in DB */
export async function isAdminSetup(): Promise<boolean> {
  const creds = await getAdminCredentials();
  return !!creds;
}

/** First-time setup: only works if no credentials exist yet */
export async function setupAdminCredentials(username: string, password: string): Promise<boolean> {
  const existing = await getAdminCredentials();
  if (existing) return false; // already set up

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const hash = hashPassword(password);

  // Ensure row id=1 exists
  await supabaseAdmin
    .from("company_settings" as never)
    .upsert({ id: 1, admin_username: username, admin_password_hash: hash } as never);

  return true;
}

/** Update credentials — requires correct current password */
export async function updateAdminCredentials(
  currentPassword: string,
  newUsername: string,
  newPassword: string
): Promise<{ ok: boolean; error?: string }> {
  const creds = await getAdminCredentials();
  if (!creds) return { ok: false, error: "Belum ada akun yang dibuat" };
  if (!verifyPassword(currentPassword, creds.password_hash)) {
    return { ok: false, error: "Password saat ini salah" };
  }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const hash = hashPassword(newPassword);
  const { error } = await supabaseAdmin
    .from("company_settings" as never)
    .update({ admin_username: newUsername, admin_password_hash: hash } as never)
    .eq("id", 1);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ── Session functions ──────────────────────────────────────────────────────────

export async function loginAdmin(username: string, password: string): Promise<boolean> {
  const creds = await getAdminCredentials();
  if (!creds) return false;
  if (username !== creds.username) return false;
  if (!verifyPassword(password, creds.password_hash)) return false;

  const session = await useSession<AdminSession>(config());
  await session.update({ admin: true, username });
  return true;
}

export async function logoutAdmin() {
  const session = await useSession<AdminSession>(config());
  await session.clear();
}

export async function getAdmin(): Promise<{ username: string } | null> {
  const session = await useSession<AdminSession>(config());
  return session.data.admin ? { username: session.data.username || "admin" } : null;
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}
