import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkAdminSetup, setupAdmin, adminLogin } from "@/lib/admin.functions";
import { toast } from "sonner";

const ADMIN_SESSION_KEY = "kth-admin-session";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login Admin — Kaito Hiro" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

// Password strength checker
function getPasswordStrength(password: string): {
  score: number; // 0-4
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { score: 0, label: "", color: "" },
    { score: 1, label: "Sangat Lemah", color: "bg-red-500" },
    { score: 2, label: "Lemah", color: "bg-orange-500" },
    { score: 3, label: "Sedang", color: "bg-yellow-500" },
    { score: 4, label: "Kuat", color: "bg-green-500" },
    { score: 5, label: "Sangat Kuat", color: "bg-emerald-500" },
  ];
  return levels[Math.min(score, 5)];
}

function PasswordInput({
  value,
  onChange,
  placeholder = "••••••••",
  label,
  showStrength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label: string;
  showStrength?: boolean;
}) {
  const [show, setShow] = useState(false);
  const strength = getPasswordStrength(value);

  return (
    <div>
      <label className="text-sm font-semibold mb-2 block">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          required
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          minLength={8}
          className="w-full h-12 pl-10 pr-10 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {showStrength && value && (
        <div className="mt-2 space-y-1.5">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  strength.score >= i ? strength.color : "bg-muted"
                }`}
              />
            ))}
          </div>
          {strength.label && (
            <p className={`text-xs font-medium ${strength.score < 3 ? "text-destructive" : "text-green-600"}`}>
              {strength.label}
            </p>
          )}
          {value.length < 8 && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Minimal 8 karakter
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"check" | "login" | "setup">("check");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Cek apakah setup sudah dilakukan
  useEffect(() => {
    checkAdminSetup().then(({ setup }) => {
      setMode(setup ? "login" : "setup");
    }).catch(() => {
      // Jika tidak bisa cek (belum ada DB), default ke setup
      setMode("setup");
    });
  }, []);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true);
    try {
      const { ok } = await adminLogin({ data: { username: username.trim(), password } });
      if (ok) {
        // Sync localStorage agar guard di admin.tsx terbaca
        localStorage.setItem(ADMIN_SESSION_KEY, "1");
        toast.success("Berhasil masuk");
        navigate({ to: "/admin" });
      } else {
        toast.error("Username atau password salah");
      }
    } catch {
      toast.error("Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  const onSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) { toast.error("Username wajib diisi"); return; }
    if (password.length < 8) { toast.error("Password minimal 8 karakter"); return; }
    if (password !== confirmPassword) { toast.error("Konfirmasi password tidak cocok"); return; }

    setLoading(true);
    try {
      const { ok } = await setupAdmin({ data: { username: username.trim(), password } });
      if (ok) {
        toast.success("Akun admin berhasil dibuat! Silakan login.");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
      } else {
        toast.error("Setup gagal — akun mungkin sudah ada");
      }
    } catch (e) {
      toast.error("Gagal: " + (e instanceof Error ? e.message : "error"));
    } finally {
      setLoading(false);
    }
  };

  if (mode === "check") {
    return (
      <section className="min-h-[80dvh] grid place-items-center container-px py-16">
        <div className="text-center text-muted-foreground">Memeriksa sistem...</div>
      </section>
    );
  }

  return (
    <section className="min-h-[80dvh] grid place-items-center container-px py-16 bg-gradient-to-br from-primary/5 via-background to-accent-orange/5">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-border bg-card shadow-elegant p-8 md:p-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className={`grid h-14 w-14 place-items-center rounded-2xl shadow-soft mb-4 ${mode === "setup" ? "bg-accent-orange text-white" : "bg-primary text-primary-foreground"}`}>
              {mode === "setup" ? <ShieldCheck className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
            </div>
            <h1 className="font-display font-bold text-2xl">
              {mode === "setup" ? "Buat Akun Admin" : "Admin Panel"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "setup"
                ? "Buat username dan password untuk pertama kali."
                : "Masuk untuk mengelola konten website KTH."}
            </p>
          </div>

          {/* SETUP FORM */}
          {mode === "setup" && (
            <form onSubmit={onSetup} className="space-y-4">
              <div className="rounded-xl bg-accent-orange/10 border border-accent-orange/30 p-4 text-sm text-foreground/80">
                <p className="font-semibold text-accent-orange mb-1">⚠️ Setup Pertama Kali</p>
                <p>Buat username dan password untuk admin panel. Password minimal 8 karakter.</p>
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm"
                  />
                </div>
              </div>
              <PasswordInput label="Password" value={password} onChange={setPassword} showStrength />
              <PasswordInput label="Konfirmasi Password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Ulangi password" />
              <Button type="submit" disabled={loading || password.length < 8} className="w-full h-12 rounded-xl font-bold">
                {loading ? "Memproses..." : "Buat Akun Admin"}
              </Button>
            </form>
          )}

          {/* LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={onLogin} className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm"
                  />
                </div>
              </div>
              <PasswordInput label="Password" value={password} onChange={setPassword} />
              <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl font-bold">
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">← Kembali ke beranda</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
