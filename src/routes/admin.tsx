import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Newspaper,
  Inbox,
  LogOut,
  Home,
  Building2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAuthed, logout } from "@/lib/admin-auth";
import { adminLogout, adminMe } from "@/lib/admin.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Panel — Kaito Hiro" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AdminLayout,
});

const ITEMS: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/produk", label: "Produk", icon: Package },
  { to: "/admin/artikel", label: "Artikel", icon: Newspaper },
  { to: "/admin/download", label: "Download", icon: Download },
  { to: "/admin/kontak", label: "Pesan Kontak", icon: Inbox },
  { to: "/admin/perusahaan", label: "Perusahaan", icon: Building2 },
];

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Cek localStorage dulu (cepat), lalu validasi ke server
    if (!isAuthed()) {
      navigate({ to: "/login" });
      return;
    }
    // Validasi sesi ke server
    adminMe()
      .then((admin) => {
        if (!admin) {
          logout();
          navigate({ to: "/login" });
        } else {
          setReady(true);
        }
      })
      .catch(() => {
        // Jika server tidak bisa dicapai, percayai localStorage
        setReady(true);
      });
  }, [navigate]);

  if (!ready) return null;

  return (
    <div className="min-h-[80dvh] bg-muted/30">
      <div className="mx-auto max-w-7xl container-px py-8 grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="lg:sticky lg:top-24 self-start">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="px-2 py-3 border-b border-border mb-3">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Logged in as
              </div>
              <div className="font-display font-bold text-sm">admin</div>
            </div>
            <nav className="flex flex-col gap-1">
              {ITEMS.map((item) => {
                const Icon = item.icon;
                const active = item.exact
                  ? pathname === item.to
                  : pathname === item.to || pathname.startsWith(item.to + "/");
                return (
                  <Link
                    key={item.to}
                    to={item.to as "/admin"}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      active ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
              <Link
                to="/"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary px-3 py-2"
              >
                <Home className="h-3.5 w-3.5" /> Lihat website
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    await adminLogout();
                  } catch {
                    /* ignore */
                  }
                  logout();
                  navigate({ to: "/login" });
                }}
                className="justify-start"
              >
                <LogOut className="h-3.5 w-3.5 mr-2" /> Keluar
              </Button>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
