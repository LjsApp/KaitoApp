import { createServerFn } from "@tanstack/react-start";

export const adminLogin = createServerFn({ method: "POST" })
  .validator((d: { username: string; password: string }) => d)
  .handler(async ({ data }) => {
    const { loginAdmin } = await import("./admin-session.server");
    const ok = await loginAdmin(data.username, data.password);
    return { ok };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { logoutAdmin } = await import("./admin-session.server");
  await logoutAdmin();
  return { ok: true };
});

export const adminMe = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdmin } = await import("./admin-session.server");
  return await getAdmin();
});

/** Cek apakah admin credentials sudah di-setup di DB */
export const checkAdminSetup = createServerFn({ method: "GET" }).handler(async () => {
  const { isAdminSetup } = await import("./admin-session.server");
  const setup = await isAdminSetup();
  return { setup };
});

/** Setup pertama kali — hanya bisa dijalankan jika belum ada credentials */
export const setupAdmin = createServerFn({ method: "POST" })
  .validator((d: { username: string; password: string }) => d)
  .handler(async ({ data }) => {
    const { setupAdminCredentials } = await import("./admin-session.server");
    const ok = await setupAdminCredentials(data.username, data.password);
    return { ok };
  });

/** Update credentials — memerlukan password saat ini yang benar */
export const updateAdminCredentials = createServerFn({ method: "POST" })
  .validator((d: { currentPassword: string; newUsername: string; newPassword: string }) => d)
  .handler(async ({ data }) => {
    const { updateAdminCredentials: update } = await import("./admin-session.server");
    return await update(data.currentPassword, data.newUsername, data.newPassword);
  });
