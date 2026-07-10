import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import {
  Pencil, Plus, Trash2, X, GripVertical, Settings2, Check, Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { qkProducts, qkCategories, qkFeatures } from "@/lib/queries";
import {
  upsertProduct, deleteProduct, upsertCategory, deleteCategory,
  upsertFeature, deleteFeature, type ProductInput,
} from "@/lib/catalog.functions";
import { GalleryUpload } from "@/components/ui/GalleryUpload";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { DocumentUpload } from "@/components/ui/DocumentUpload";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/produk")({ component: AdminProductsPage });

// ── helpers ──────────────────────────────────────────────────────────────────
function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ── shared modal shell ────────────────────────────────────────────────────────
export function Modal({ title, children, onClose, wide }: { title: string; children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[100] bg-foreground/50 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
      <div className={`bg-card rounded-2xl border border-border shadow-elegant ${wide ? "max-w-4xl" : "max-w-3xl"} w-full my-8 max-h-[92vh] overflow-y-auto`}>
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-display font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── shared form primitives ────────────────────────────────────────────────────
export function Input({ label, value, onChange, placeholder, className, type = "text", required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  className?: string; type?: string; required?: boolean;
}) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold mb-1.5 block">{label}{required && <span className="text-destructive ml-0.5">*</span>}</label>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-3 rounded-lg bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/40 text-sm" />
    </div>
  );
}

export function Textarea({ label, value, onChange, className, rows = 4 }: {
  label: string; value: string; onChange: (v: string) => void; className?: string; rows?: number;
}) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold mb-1.5 block">{label}</label>
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/40 text-sm resize-y" />
    </div>
  );
}

// ── MODAL: Kelola Keunggulan ──────────────────────────────────────────────────
function FeaturesModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { data: features = [] } = useQuery(qkFeatures());
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false);

  const add = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await upsertFeature({ data: { name: name.trim() } });
      await qc.invalidateQueries({ queryKey: ["features"] });
      setName("");
      toast.success("Keunggulan ditambahkan");
    } catch (e) { toast.error("Gagal: " + (e instanceof Error ? e.message : "error")); }
    finally { setLoading(false); }
  };

  const save = async (id: string) => {
    if (!editName.trim()) return;
    setLoading(true);
    try {
      await upsertFeature({ data: { id, name: editName.trim() } });
      await qc.invalidateQueries({ queryKey: ["features"] });
      setEditId(null);
      toast.success("Keunggulan diperbarui");
    } catch (e) { toast.error("Gagal: " + (e instanceof Error ? e.message : "error")); }
    finally { setLoading(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus keunggulan ini?")) return;
    try {
      await deleteFeature({ data: { id } });
      await qc.invalidateQueries({ queryKey: ["features"] });
      toast.success("Keunggulan dihapus");
    } catch (e) { toast.error("Gagal: " + (e instanceof Error ? e.message : "error")); }
  };

  return (
    <Modal title="Kelola Keunggulan" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama keunggulan baru..."
            onKeyDown={(e) => e.key === "Enter" && add()}
            className="flex-1 h-10 px-3 rounded-lg bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/40 text-sm" />
          <Button onClick={add} disabled={loading} size="sm"><Plus className="h-4 w-4 mr-1" /> Tambah</Button>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="text-left px-4 py-2">Nama Keunggulan</th><th className="text-right px-4 py-2">Aksi</th></tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f.id} className="border-t border-border">
                  <td className="px-4 py-2">
                    {editId === f.id ? (
                      <input value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus
                        onKeyDown={(e) => { if (e.key === "Enter") save(f.id); if (e.key === "Escape") setEditId(null); }}
                        className="w-full h-8 px-2 rounded-md bg-muted border border-border text-sm outline-none focus:ring-2 focus:ring-primary/40" />
                    ) : (
                      <span>{f.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="inline-flex gap-1">
                      {editId === f.id ? (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => save(f.id)} disabled={loading}><Check className="h-3.5 w-3.5 text-green-500" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditId(null)}><X className="h-3.5 w-3.5" /></Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => { setEditId(f.id); setEditName(f.name); }}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => remove(f.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {features.length === 0 && <tr><td colSpan={2} className="py-6 text-center text-muted-foreground text-xs">Belum ada keunggulan.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}

// ── MODAL: Tambah/Edit Produk ─────────────────────────────────────────────────
type ProdForm = {
  id?: string; slug: string; sku: string; name: string; category_id: string;
  tagline: string; description: string; gallery: string[];
  specs: { key: string; value: string }[];
  shopee_url: string; tokopedia_url: string; featured: boolean;
  feature_ids: string[];
  document_url: string;
};

const EMPTY_PROD: ProdForm = {
  slug: "", sku: "", name: "", category_id: "", tagline: "", description: "",
  gallery: [], specs: [], shopee_url: "", tokopedia_url: "", featured: false, feature_ids: [], document_url: "",
};

function ProductModal({ initial, onClose }: { initial: ProdForm; onClose: () => void }) {
  const qc = useQueryClient();
  const { data: categories = [] } = useQuery(qkCategories());
  const { data: features = [] } = useQuery(qkFeatures());
  const [form, setForm] = useState<ProdForm>(initial);
  const [loading, setLoading] = useState(false);
  const [showFeatMgr, setShowFeatMgr] = useState(false);

  const set = useCallback(<K extends keyof ProdForm>(k: K, v: ProdForm[K]) => setForm((f) => ({ ...f, [k]: v })), []);
  const isNew = !initial.id;

  const updateName = (v: string) => {
    set("name", v);
    if (isNew) set("slug", slugify(v));
  };

  const addSpec = () => set("specs", [...form.specs, { key: "", value: "" }]);
  const removeSpec = (i: number) => set("specs", form.specs.filter((_, j) => j !== i));
  const updateSpec = (i: number, field: "key" | "value", v: string) =>
    set("specs", form.specs.map((s, j) => j === i ? { ...s, [field]: v } : s));

  const toggleFeature = (id: string) =>
    set("feature_ids", form.feature_ids.includes(id) ? form.feature_ids.filter((f) => f !== id) : [...form.feature_ids, id]);

  const save = async () => {
    if (!form.name.trim() || !form.sku.trim()) { toast.error("Nama dan SKU wajib diisi"); return; }
    const slug = form.slug.trim() || slugify(form.name);
    setLoading(true);
    try {
      const payload: ProductInput = { ...form, slug, specs: form.specs.filter((s) => s.key.trim()), category_id: form.category_id || null };
      await upsertProduct({ data: payload });
      await qc.invalidateQueries({ queryKey: ["products"] });
      toast.success(isNew ? "Produk ditambahkan" : "Produk diperbarui");
      onClose();
    } catch (e) { toast.error("Gagal: " + (e instanceof Error ? e.message : "error")); }
    finally { setLoading(false); }
  };

  return (
    <>
      {showFeatMgr && <FeaturesModal onClose={() => setShowFeatMgr(false)} />}
      <Modal title={isNew ? "Tambah Produk" : `Edit: ${form.name}`} onClose={onClose} wide>
        <div className="space-y-8">
          {/* Informasi Dasar */}
          <section>
            <h3 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Informasi Dasar</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Nama Produk" value={form.name} onChange={updateName} required />
              <Input label="SKU" value={form.sku} onChange={(v) => set("sku", v)} required />
              <Input label="Slug (URL)" value={form.slug} onChange={(v) => set("slug", v)} placeholder="otomatis dari nama" />
              <div>
                <label className="text-xs font-semibold mb-1.5 block">Kategori</label>
                <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/40 text-sm">
                  <option value="">— Pilih Kategori —</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <Input label="Tagline" value={form.tagline} onChange={(v) => set("tagline", v)} className="sm:col-span-2" />
              <Textarea label="Deskripsi" value={form.description} onChange={(v) => set("description", v)} className="sm:col-span-2" rows={4} />
            </div>
          </section>

          {/* Galeri & Dokumen */}
          <section className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Galeri Produk</h3>
              <GalleryUpload value={form.gallery} onChange={(v) => set("gallery", v)} folder="products" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Brosur / PDF (Opsional)</h3>
              <DocumentUpload value={form.document_url} onChange={(v) => set("document_url", v)} folder="products/documents" />
            </div>
          </section>

          {/* Spesifikasi */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground">Spesifikasi</h3>
              <Button type="button" size="sm" variant="outline" onClick={addSpec}><Plus className="h-3.5 w-3.5 mr-1" /> Tambah Spesifikasi</Button>
            </div>
            {form.specs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-xl">Belum ada spesifikasi. Klik "Tambah" untuk menambah baris.</p>
            ) : (
              <div className="space-y-2">
                {form.specs.map((s, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                    <input value={s.key} onChange={(e) => updateSpec(i, "key", e.target.value)} placeholder="Nama (mis: Daya)" className="flex-1 h-10 px-3 rounded-lg bg-muted border border-border outline-none text-sm focus:ring-2 focus:ring-primary/40" />
                    <input value={s.value} onChange={(e) => updateSpec(i, "value", e.target.value)} placeholder="Nilai (mis: 125 Watt)" className="flex-1 h-10 px-3 rounded-lg bg-muted border border-border outline-none text-sm focus:ring-2 focus:ring-primary/40" />
                    <button type="button" onClick={() => removeSpec(i)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Keunggulan */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground">Keunggulan</h3>
              <Button type="button" size="sm" variant="outline" onClick={() => setShowFeatMgr(true)}>
                <Settings2 className="h-3.5 w-3.5 mr-1" /> Kelola Keunggulan
              </Button>
            </div>
            {features.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada keunggulan. Klik "Kelola" untuk menambah.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-2">
                {features.map((f) => (
                  <label key={f.id} className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-lg hover:bg-accent/50 transition-colors">
                    <input type="checkbox" checked={form.feature_ids.includes(f.id)} onChange={() => toggleFeature(f.id)}
                      className="h-4 w-4 rounded accent-primary" />
                    <span className="text-sm">{f.name}</span>
                  </label>
                ))}
              </div>
            )}
          </section>

          {/* Marketplace */}
          <section>
            <h3 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Marketplace</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Link Shopee" value={form.shopee_url} onChange={(v) => set("shopee_url", v)} placeholder="https://shopee.co.id/..." />
              <Input label="Link Tokopedia" value={form.tokopedia_url} onChange={(v) => set("tokopedia_url", v)} placeholder="https://tokopedia.com/..." />
            </div>
          </section>

          {/* Status */}
          <section>
            <h3 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Status</h3>
            <label className="inline-flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border border-border hover:bg-accent/50 transition-colors">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 rounded accent-primary" />
              <span className="text-sm font-medium">Produk Unggulan <span className="text-xs text-muted-foreground font-normal">(tampil di homepage)</span></span>
            </label>
          </section>
        </div>

        <div className="flex justify-end gap-2 mt-8 pt-5 border-t border-border">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={save} disabled={loading}>{loading ? "Menyimpan..." : "Simpan Produk"}</Button>
        </div>
      </Modal>
    </>
  );
}

// ── TAB PRODUK ────────────────────────────────────────────────────────────────
function TabProducts() {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery(qkProducts());
  const { data: categories = [] } = useQuery(qkCategories());
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<ProdForm | null>(null);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  const openNew = () => setEditing({ ...EMPTY_PROD });
  const openEdit = (p: typeof products[number]) => {
    setEditing({
      id: p.id, slug: p.slug || "", sku: p.sku || "", name: p.name || "",
      category_id: p.category_id || "", tagline: p.tagline || "",
      description: p.description || "", gallery: p.gallery || [],
      specs: p.specs || [], shopee_url: p.shopee_url || "",
      tokopedia_url: p.tokopedia_url || "", featured: p.featured,
      feature_ids: (p.features || []).map((f) => f.id),
      document_url: p.document_url || "",
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return;
    try {
      await deleteProduct({ data: { id } });
      await qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk dihapus");
    } catch (e) { toast.error("Gagal: " + (e instanceof Error ? e.message : "error")); }
  };

  const getCatName = (id: string | null) => categories.find((c) => c.id === id)?.name || "—";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">{products.length} produk terdaftar.</p>
        <div className="flex items-center gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama / SKU..."
            className="h-10 w-64 px-3 rounded-xl bg-card border border-border outline-none focus:ring-2 focus:ring-primary/40 text-sm" />
          <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Tambah Produk</Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 w-16">Foto</th>
              <th className="text-left px-4 py-3">Nama Produk</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">SKU</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Kategori</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="text-center py-10 text-muted-foreground text-sm">Memuat...</td></tr>}
            {!isLoading && filtered.map((p) => (
              <tr key={p.id} className="border-t border-border hover:bg-accent/40 transition-colors">
                <td className="px-4 py-3">
                  {p.gallery?.[0] ? (
                    <img src={p.gallery[0]} alt={p.name} className="h-10 w-10 object-cover rounded-lg border border-border" />
                  ) : (
                    <div className="h-10 w-10 rounded-lg border border-border bg-muted grid place-items-center"><ImageIcon className="h-4 w-4 text-muted-foreground" /></div>
                  )}
                </td>
                <td className="px-4 py-3 font-semibold">{p.name}</td>
                <td className="px-4 py-3 font-mono text-xs hidden md:table-cell">{p.sku}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{getCatName(p.category_id)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${p.featured ? "bg-accent-orange/15 text-accent-orange" : "bg-muted text-muted-foreground"}`}>
                    {p.featured ? "Unggulan" : "Normal"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(p.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-muted-foreground text-sm">Tidak ada produk ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && <ProductModal initial={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

// ── MODAL: Tambah/Edit Kategori ───────────────────────────────────────────────
type CatForm = { id?: string; slug: string; name: string; description: string; image_url: string; sort_order: number };
const EMPTY_CAT: CatForm = { slug: "", name: "", description: "", image_url: "", sort_order: 0 };

function CategoryModal({ initial, onClose }: { initial: CatForm; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<CatForm>(initial);
  const [loading, setLoading] = useState(false);
  const isNew = !initial.id;

  const set = <K extends keyof CatForm>(k: K, v: CatForm[K]) => setForm((f) => ({ ...f, [k]: v }));
  const updateName = (v: string) => { set("name", v); if (isNew) set("slug", slugify(v)); };

  const save = async () => {
    if (!form.name.trim()) { toast.error("Nama kategori wajib diisi"); return; }
    const slug = form.slug.trim() || slugify(form.name);
    setLoading(true);
    try {
      await upsertCategory({ data: { ...form, slug } });
      await qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success(isNew ? "Kategori ditambahkan" : "Kategori diperbarui");
      onClose();
    } catch (e) { toast.error("Gagal: " + (e instanceof Error ? e.message : "error")); }
    finally { setLoading(false); }
  };

  return (
    <Modal title={isNew ? "Tambah Kategori" : `Edit: ${form.name}`} onClose={onClose}>
      <div className="space-y-4">
        <Input label="Nama Kategori" value={form.name} onChange={updateName} required />
        <Input label="Slug (URL)" value={form.slug} onChange={(v) => set("slug", v)} placeholder="otomatis dari nama" />
        <Textarea label="Deskripsi" value={form.description} onChange={(v) => set("description", v)} rows={3} />
        <ImageUpload label="Foto Kategori" value={form.image_url} onChange={(v) => set("image_url", v)} folder="categories" />
        <div>
          <label className="text-xs font-semibold mb-1.5 block">Urutan Tampil</label>
          <input type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))}
            className="w-24 h-11 px-3 rounded-lg bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/40 text-sm" />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
        <Button variant="outline" onClick={onClose}>Batal</Button>
        <Button onClick={save} disabled={loading}>{loading ? "Menyimpan..." : "Simpan"}</Button>
      </div>
    </Modal>
  );
}

// ── TAB KATEGORI ──────────────────────────────────────────────────────────────
function TabCategories() {
  const qc = useQueryClient();
  const { data: categories = [], isLoading } = useQuery(qkCategories());
  const { data: products = [] } = useQuery(qkProducts());
  const [editing, setEditing] = useState<CatForm | null>(null);

  const openNew = () => setEditing({ ...EMPTY_CAT });
  const openEdit = (c: typeof categories[number]) => setEditing({ id: c.id, slug: c.slug, name: c.name, description: c.description, image_url: c.image_url, sort_order: c.sort_order });

  const remove = async (id: string) => {
    if (!confirm("Hapus kategori ini?")) return;
    try {
      await deleteCategory({ data: { id } });
      await qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Kategori dihapus");
    } catch (e) { toast.error("Gagal: " + (e instanceof Error ? e.message : "error")); }
  };

  const countProducts = (id: string) => products.filter((p) => p.category_id === id).length;

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Tambah Kategori</Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 w-16">Foto</th>
              <th className="text-left px-4 py-3">Nama Kategori</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Deskripsi</th>
              <th className="text-center px-4 py-3">Produk</th>
              <th className="text-right px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} className="text-center py-10 text-muted-foreground text-sm">Memuat...</td></tr>}
            {!isLoading && categories.map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-accent/40 transition-colors">
                <td className="px-4 py-3">
                  {c.image_url ? (
                    <img src={c.image_url} alt={c.name} className="h-10 w-10 object-cover rounded-lg border border-border" />
                  ) : (
                    <div className="h-10 w-10 rounded-lg border border-border bg-muted grid place-items-center"><ImageIcon className="h-4 w-4 text-muted-foreground" /></div>
                  )}
                </td>
                <td className="px-4 py-3 font-semibold">{c.name}</td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">{c.description || "—"}</td>
                <td className="px-4 py-3 text-center tabular-nums">
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold">{countProducts(c.id)}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(c.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && categories.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-muted-foreground text-sm">Belum ada kategori.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && <CategoryModal initial={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
type Tab = "produk" | "kategori";

function AdminProductsPage() {
  const [tab, setTab] = useState<Tab>("produk");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display font-bold text-3xl">Kelola Produk</h1>
        <p className="text-muted-foreground text-sm mt-1">Manajemen produk dan kategori.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted w-fit">
        {(["produk", "kategori"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${tab === t ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            {t === "produk" ? "Produk" : "Kategori"}
          </button>
        ))}
      </div>

      {tab === "produk" ? <TabProducts /> : <TabCategories />}
    </div>
  );
}
