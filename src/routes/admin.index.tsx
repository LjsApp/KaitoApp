import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Newspaper, Inbox, ArrowRight, Building2 } from "lucide-react";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { qkProducts, qkArticles } from "@/lib/queries";
import { listMessagesAdmin } from "@/lib/messages.functions";
import { useAdminVersion } from "@/lib/admin-store";

const qkAdminMessages = () => queryOptions({
  queryKey: ["admin-messages"],
  queryFn: () => listMessagesAdmin(),
});

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  useAdminVersion();
  const { data: products = [] } = useQuery(qkProducts());
  const { data: articles = [] } = useQuery(qkArticles());
  const { data: messages = [] } = useQuery(qkAdminMessages());
  const unread = messages.filter((m) => !m.read).length;

  const cards = [
    { to: "/admin/produk", label: "Produk", value: products.length, icon: Package, color: "from-primary to-primary/70" },
    { to: "/admin/artikel", label: "Artikel", value: articles.length, icon: Newspaper, color: "from-accent-orange to-accent-orange/70" },
    { to: "/admin/kontak", label: "Pesan Masuk", value: messages.length, sub: `${unread} belum dibaca`, icon: Inbox, color: "from-emerald-600 to-emerald-400" },
    { to: "/admin/perusahaan", label: "Perusahaan", value: 1, icon: Building2, color: "from-blue-600 to-blue-400" },
  ] as const;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display font-bold text-3xl">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Ringkasan konten dan aktivitas admin panel.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.to}
              to={c.to}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:shadow-elegant transition-all"
            >
              <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${c.color} opacity-10 group-hover:opacity-20 transition`} />
              <div className="flex items-start justify-between relative">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
                  <div className="font-display font-extrabold text-4xl mt-2 tabular-nums">{c.value}</div>
                  {"sub" in c && c.sub && <div className="text-xs text-muted-foreground mt-1">{c.sub}</div>}
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all relative">
                Kelola <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display font-bold text-lg mb-4">Pesan Terbaru</h2>
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada pesan masuk.</p>
        ) : (
          <ul className="divide-y divide-border">
            {messages.slice(0, 5).map((m) => (
              <li key={m.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{m.name} — {m.subject}</div>
                  <div className="text-xs text-muted-foreground truncate">{m.message}</div>
                </div>
                <div className="text-xs text-muted-foreground shrink-0">{new Date(m.created_at).toLocaleDateString("id-ID")}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
