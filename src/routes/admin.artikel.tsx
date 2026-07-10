import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { qkArticles } from "@/lib/queries";
import { upsertArticle, deleteArticle, type ArticleInput } from "@/lib/catalog.functions";
import { Modal, Input, Textarea } from "./admin.produk";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/artikel")({ component: AdminArticlesPage });

type ArtForm = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_url: string;
  content: string;
  published_at: string;
};

const EMPTY: ArtForm = {
  slug: "",
  title: "",
  excerpt: "",
  category: "Panduan",
  cover_url: "",
  content: "",
  published_at: new Date().toISOString().slice(0, 10),
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const ARTICLE_CATS = ["Panduan", "Tips", "Edukasi", "Garansi", "Berita"];

function ArticleModal({ initial, onClose }: { initial: ArtForm; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<ArtForm>(initial);
  const [loading, setLoading] = useState(false);
  const isNew = !initial.id;

  const set = <K extends keyof ArtForm>(k: K, v: ArtForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  const updateTitle = (v: string) => {
    set("title", v);
    // Auto-generate slug jika: baru (isNew) ATAU slug masih kosong
    if (isNew || !form.slug.trim()) set("slug", slugify(v));
  };

  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Judul wajib diisi");
      return;
    }
    const slug = form.slug.trim() ? slugify(form.slug) : slugify(form.title);
    setLoading(true);
    try {
      const payload: ArticleInput = {
        ...form,
        slug,
        published_at: form.published_at ? new Date(form.published_at).toISOString() : undefined,
      };
      await upsertArticle({ data: payload });
      await qc.invalidateQueries({ queryKey: ["articles"] });
      toast.success(isNew ? "Artikel ditambahkan" : "Artikel diperbarui");
      onClose();
    } catch (e) {
      toast.error("Gagal: " + (e instanceof Error ? e.message : "error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={isNew ? "Tambah Artikel" : `Edit: ${form.title}`} onClose={onClose} wide>
      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Judul Artikel"
            value={form.title}
            onChange={updateTitle}
            required
            className="sm:col-span-2"
          />
          <Input
            label="Slug (URL)"
            value={form.slug}
            onChange={(v) => set("slug", v)}
            placeholder="otomatis dari judul"
          />
          <div>
            <label className="text-xs font-semibold mb-1.5 block">Kategori</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full h-11 px-3 rounded-lg bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/40 text-sm"
            >
              {ARTICLE_CATS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Tanggal Publish"
            type="date"
            value={form.published_at}
            onChange={(v) => set("published_at", v)}
          />
          <Textarea
            label="Ringkasan (Excerpt)"
            value={form.excerpt}
            onChange={(v) => set("excerpt", v)}
            className="sm:col-span-2"
            rows={3}
          />
        </div>

        <ImageUpload
          label="Foto Cover Artikel"
          value={form.cover_url}
          onChange={(v) => set("cover_url", v)}
          folder="articles"
          maxSizeMB={1}
        />

        <RichTextEditor
          label="Isi Artikel"
          value={form.content}
          onChange={(v) => set("content", v)}
        />
      </div>

      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
        <Button variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button onClick={save} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Artikel"}
        </Button>
      </div>
    </Modal>
  );
}

function AdminArticlesPage() {
  const qc = useQueryClient();
  const { data: articles = [], isLoading } = useQuery(qkArticles());
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<ArtForm | null>(null);

  const filtered = articles.filter((a) => {
    const q = query.toLowerCase();
    return !q || a.title.toLowerCase().includes(q);
  });

  const openNew = () => setEditing({ ...EMPTY });
  const openEdit = (a: (typeof articles)[number]) =>
    setEditing({
      id: a.id,
      slug: a.slug || "",
      title: a.title || "",
      excerpt: a.excerpt || "",
      category: a.category || "Panduan",
      cover_url: a.cover_url || "",
      content: a.content || "",
      published_at: a.published_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    });

  const remove = async (id: string) => {
    if (!confirm("Hapus artikel ini?")) return;
    try {
      await deleteArticle({ data: { id } });
      await qc.invalidateQueries({ queryKey: ["articles"] });
      toast.success("Artikel dihapus");
    } catch (e) {
      toast.error("Gagal: " + (e instanceof Error ? e.message : "error"));
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-3xl">Artikel</h1>
          <p className="text-muted-foreground text-sm mt-1">{articles.length} artikel terdaftar.</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" /> Tambah Artikel
        </Button>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari judul..."
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 w-16">Foto</th>
              <th className="text-left px-4 py-3">Judul</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Kategori</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Tanggal</th>
              <th className="text-right px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-muted-foreground">
                  Memuat...
                </td>
              </tr>
            )}
            {!isLoading &&
              filtered.map((a) => (
                <tr key={a.id} className="border-t border-border hover:bg-accent/40">
                  <td className="px-4 py-3">
                    {a.cover_url ? (
                      <img
                        src={a.cover_url}
                        alt={a.title}
                        className="h-10 w-14 object-cover rounded-lg border border-border"
                      />
                    ) : (
                      <div className="h-10 w-14 rounded-lg border border-border bg-muted grid place-items-center text-[10px] text-muted-foreground">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold max-w-xs truncate">{a.title}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{a.category}</td>
                  <td className="px-4 py-3 hidden md:table-cell tabular-nums text-muted-foreground">
                    {new Date(a.published_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(a)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => remove(a.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-muted-foreground">
                  Tidak ada artikel.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && <ArticleModal initial={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
