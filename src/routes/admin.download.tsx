import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Trash2, Pencil, Download as DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { qkDownloads } from "@/lib/queries";
import { upsertDownload, deleteDownload, type DownloadInput } from "@/lib/catalog.functions";
import { Modal, Input } from "./admin.produk";
import { DocumentUpload } from "@/components/ui/DocumentUpload";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/download")({ component: AdminDownloadPage });

type DownForm = {
  id?: string;
  title: string;
  type: string;
  file_url: string; // Will store "url|||size" during edit
  size: string;
};

const EMPTY: DownForm = { title: "", type: "Brosur", file_url: "", size: "" };
const DOC_TYPES = ["Brosur", "Manual Book", "Katalog", "Datasheet", "Sertifikat"];

function DownloadModal({ initial, onClose }: { initial: DownForm; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<DownForm>(initial);
  const [loading, setLoading] = useState(false);
  const isNew = !initial.id;

  const set = <K extends keyof DownForm>(k: K, v: DownForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Judul wajib diisi");
      return;
    }

    // Parse value if it comes directly from upload
    let finalUrl = form.file_url;
    let finalSize = form.size;
    if (form.file_url.includes("|||")) {
      const parts = form.file_url.split("|||");
      finalUrl = parts[0];
      finalSize = parts[1];
    }

    if (!finalUrl.trim()) {
      toast.error("File wajib diupload");
      return;
    }

    setLoading(true);
    try {
      const payload: DownloadInput = {
        id: form.id,
        title: form.title,
        type: form.type,
        file_url: finalUrl,
        size: finalSize,
      };
      await upsertDownload({ data: payload });
      await qc.invalidateQueries({ queryKey: ["downloads"] });
      toast.success(isNew ? "Dokumen ditambahkan" : "Dokumen diperbarui");
      onClose();
    } catch (e) {
      toast.error("Gagal: " + (e instanceof Error ? e.message : "error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={isNew ? "Tambah Dokumen" : `Edit: ${form.title}`} onClose={onClose}>
      <div className="space-y-4">
        <Input
          label="Judul Dokumen"
          value={form.title}
          onChange={(v) => set("title", v)}
          required
        />

        <div>
          <label className="text-xs font-semibold mb-1.5 block">Kategori</label>
          <select
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
            className="w-full h-11 px-3 rounded-lg bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/40 text-sm"
          >
            {DOC_TYPES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <DocumentUpload
          label="File Dokumen (Max 2MB)"
          value={form.file_url}
          onChange={(v) => set("file_url", v)}
          folder="downloads"
        />
      </div>

      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
        <Button variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button onClick={save} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Dokumen"}
        </Button>
      </div>
    </Modal>
  );
}

function AdminDownloadPage() {
  const qc = useQueryClient();
  const { data: downloads = [], isLoading } = useQuery(qkDownloads());
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<DownForm | null>(null);

  const filtered = downloads.filter((d) => {
    const q = query.toLowerCase();
    return !q || d.title.toLowerCase().includes(q) || d.type.toLowerCase().includes(q);
  });

  const openNew = () => setEditing({ ...EMPTY });
  const openEdit = (d: (typeof downloads)[number]) =>
    setEditing({
      id: d.id,
      title: d.title || "",
      type: d.type || "Brosur",
      file_url: d.file_url || "",
      size: d.size || "",
    });

  const remove = async (id: string) => {
    if (!confirm("Hapus dokumen ini?")) return;
    try {
      await deleteDownload({ data: { id } });
      await qc.invalidateQueries({ queryKey: ["downloads"] });
      toast.success("Dokumen dihapus");
    } catch (e) {
      toast.error("Gagal: " + (e instanceof Error ? e.message : "error"));
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-3xl">Download Center</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {downloads.length} dokumen terdaftar.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" /> Tambah Dokumen
        </Button>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari judul dokumen atau kategori..."
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Judul Dokumen</th>
              <th className="text-left px-4 py-3">Kategori</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Ukuran</th>
              <th className="text-right px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="text-center py-10 text-muted-foreground">
                  Memuat...
                </td>
              </tr>
            )}
            {!isLoading &&
              filtered.map((d) => (
                <tr key={d.id} className="border-t border-border hover:bg-accent/40">
                  <td className="px-4 py-3 font-semibold max-w-xs truncate">{d.title}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {d.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    {d.size || "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <a href={d.file_url} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="ghost" title="Download">
                          <DownloadIcon className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(d)} title="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => remove(d.id)}
                        className="text-destructive hover:text-destructive"
                        title="Hapus"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-10 text-muted-foreground">
                  Tidak ada dokumen ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && <DownloadModal initial={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
