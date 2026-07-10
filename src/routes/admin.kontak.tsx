import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, Trash2, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { type AdminMessage, listMessagesAdmin } from "@/lib/messages.functions";
import { markMessage, deleteMessage } from "@/lib/catalog.functions";
import { toast } from "sonner";

// Gunakan server function (service_role) — bukan anon client (tidak punya SELECT policy)
const qkAdminMessages = () =>
  queryOptions({
    queryKey: ["admin-messages"],
    queryFn: () => listMessagesAdmin(),
  });

export const Route = createFileRoute("/admin/kontak")({ component: AdminMessagesPage });

function AdminMessagesPage() {
  const qc = useQueryClient();
  const { data: messages = [], isLoading } = useQuery(qkAdminMessages());
  const [open, setOpen] = useState<AdminMessage | null>(null);

  const remove = async (id: string) => {
    if (!confirm("Hapus pesan ini?")) return;
    try {
      await deleteMessage({ data: { id } });
      await qc.invalidateQueries({ queryKey: ["admin-messages"] });
      toast.success("Pesan dihapus");
      if (open?.id === id) setOpen(null);
    } catch (e) {
      toast.error("Gagal: " + (e instanceof Error ? e.message : "error"));
    }
  };

  const toggleRead = async (m: AdminMessage) => {
    try {
      await markMessage({ data: { id: m.id, read: !m.read } });
      await qc.invalidateQueries({ queryKey: ["admin-messages"] });
    } catch (e) {
      toast.error("Gagal: " + (e instanceof Error ? e.message : "error"));
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display font-bold text-3xl">Pesan Kontak</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {messages.length} pesan, {messages.filter((m) => !m.read).length} belum dibaca.
        </p>
      </header>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-muted-foreground text-sm">Memuat pesan...</div>
        ) : messages.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">
            Belum ada pesan yang masuk.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {messages.map((m) => (
              <li
                key={m.id}
                className={`p-4 hover:bg-accent/40 transition-colors ${!m.read ? "bg-primary/5" : ""}`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <button
                    onClick={() => {
                      setOpen(m);
                      if (!m.read) toggleRead(m);
                    }}
                    className="flex-1 min-w-0 text-left"
                  >
                    <div className="flex items-center gap-2">
                      {!m.read && (
                        <span className="h-2 w-2 rounded-full bg-accent-orange shrink-0" />
                      )}
                      <span className="font-display font-bold">{m.name}</span>
                      <span className="text-xs text-muted-foreground">— {m.subject}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {m.message}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {m.email}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {m.phone}
                      </span>
                      <span>{new Date(m.created_at).toLocaleString("id-ID")}</span>
                    </div>
                  </button>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleRead(m)}
                      title={m.read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                    >
                      {m.read ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => remove(m.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] bg-foreground/50 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-card rounded-2xl border border-border shadow-elegant max-w-2xl w-full">
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg">{open.subject}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(open.created_at).toLocaleString("id-ID")}
                </p>
              </div>
              <button
                onClick={() => setOpen(null)}
                className="grid h-8 w-8 place-items-center rounded-lg hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <Field label="Nama" value={open.name} />
                <Field label="Email" value={open.email} />
                <Field label="No. Telepon / WA" value={open.phone} />
                <Field label="Subjek" value={open.subject} />
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                  Pesan
                </div>
                <div className="rounded-xl bg-muted/50 p-4 text-sm whitespace-pre-wrap leading-relaxed">
                  {open.message}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                <a href={`mailto:${open.email}`} className="inline-flex">
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4 mr-2" /> Balas Email
                  </Button>
                </a>
                <a
                  href={`https://wa.me/${open.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-2" /> WhatsApp
                  </Button>
                </a>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => remove(open.id)}
                  className="text-destructive hover:text-destructive ml-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Hapus
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
        {label}
      </div>
      <div className="font-medium mt-0.5 break-words">{value}</div>
    </div>
  );
}
