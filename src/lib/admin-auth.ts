const KEY = "kth-admin-session";

/** @deprecated Gunakan adminLogin() server function dari admin.functions.ts */
export function login(_username: string, _password: string): boolean {
  // Hardcoded credentials telah dihapus — gunakan server-side auth.
  return false;
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) === "1";
}
