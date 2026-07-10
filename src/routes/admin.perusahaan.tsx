import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { qkCompany } from "@/lib/queries";
import { updateCompany, type CompanySettings } from "@/lib/company.functions";
import { updateAdminCredentials } from "@/lib/admin.functions";
import { toast } from "sonner";
import { Save, Building2, Phone, Mail, Globe, MapPin, KeyRound, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/perusahaan")({ component: AdminCompanyPage });

function Field({
  label, name, value, onChange, placeholder, type = "text",
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-semibold mb-1.5 block">{label}</label>
      <input
        id={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-3 rounded-lg bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/40 text-sm"
      />
    </div>
  );
}

function TextareaField({
  label, name, value, onChange, placeholder, rows = 3,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-semibold mb-1.5 block">{label}</label>
      <textarea
        id={name}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/40 text-sm resize-y"
      />
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <h2 className="font-display font-bold text-base">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ── Password field with show/hide ─────────────────────────────────────────────
function PasswordField({ label, name, value, onChange, placeholder }: {
  label: string; name: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={name} className="text-xs font-semibold mb-1.5 block">{label}</label>
      <div className="relative">
        <input
          id={name}
          type={show ? "text" : "password"}
          value={value}
          placeholder={placeholder || "••••••••"}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 px-3 pr-10 rounded-lg bg-muted border border-border outline-none focus:ring-2 focus:ring-primary/40 text-sm"
        />
        <button type="button" onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

// ── Credential Management Section ────────────────────────────────────────────
function CredentialSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!currentPassword) { toast.error("Masukkan password saat ini"); return; }
    if (!newUsername.trim()) { toast.error("Username baru wajib diisi"); return; }
    if (newPassword.length < 8) { toast.error("Password baru minimal 8 karakter"); return; }
    if (newPassword !== confirmPassword) { toast.error("Konfirmasi password tidak cocok"); return; }
    setSaving(true);
    try {
      const result = await updateAdminCredentials({
        data: { currentPassword, newUsername: newUsername.trim(), newPassword },
      });
      if (result.ok) {
        toast.success("Credentials berhasil diperbarui");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.error || "Gagal memperbarui");
      }
    } catch (e) {
      toast.error("Gagal: " + (e instanceof Error ? e.message : "error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard title="Akun Admin Login" icon={KeyRound}>
      <div className="rounded-xl bg-muted/50 border border-border/50 p-3 text-xs text-muted-foreground mb-2">
        Ubah username dan password yang digunakan untuk login ke admin panel.
        Masukkan password saat ini untuk konfirmasi.
      </div>
      <Field label="Username Baru" name="new_username" value={newUsername} onChange={setNewUsername} placeholder="Username baru" />
      <PasswordField label="Password Saat Ini" name="current_password" value={currentPassword} onChange={setCurrentPassword} placeholder="Password yang sekarang dipakai" />
      <PasswordField label="Password Baru (min. 8 karakter)" name="new_password" value={newPassword} onChange={setNewPassword} placeholder="Password baru" />
      <PasswordField label="Konfirmasi Password Baru" name="confirm_password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Ulangi password baru" />
      <div className="pt-2">
        <Button onClick={save} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />{saving ? "Menyimpan..." : "Simpan Credentials"}
        </Button>
      </div>
    </SectionCard>
  );
}

function AdminCompanyPage() {
  const qc = useQueryClient();
  const { data: company, isLoading } = useQuery({ ...qkCompany(), staleTime: 0 });
  const [form, setForm] = useState<CompanySettings>({
    name: "", phone: "", whatsapp: "", email: "", instagram: "",
    facebook: "", youtube: "", tiktok: "", address: "", map_embed: "",
    shopee_url: "", tokopedia_url: "", working_hours: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (company) setForm({ ...form, ...company });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]);

  const set = (k: keyof CompanySettings) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await updateCompany({ data: form });
      await qc.invalidateQueries({ queryKey: ["company"] });
      toast.success("Data perusahaan berhasil disimpan");
    } catch (e) {
      toast.error("Gagal menyimpan: " + (e instanceof Error ? e.message : "error"));
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-muted-foreground">Memuat data perusahaan...</div>;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-3xl">Data Perusahaan</h1>
          <p className="text-muted-foreground text-sm mt-1">Informasi perusahaan yang tampil di website dan footer.</p>
        </div>
        <Button onClick={save} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Identitas */}
        <SectionCard title="Identitas Perusahaan" icon={Building2}>
          <Field label="Nama Perusahaan" name="name" value={form.name} onChange={set("name")} placeholder="PT Kaito Hiro Indonesia" />
          <Field label="No. Telepon" name="phone" value={form.phone} onChange={set("phone")} placeholder="+62 21 1234 5678" type="tel" />
          <Field label="No. WhatsApp (angka saja, tanpa +62)" name="whatsapp" value={form.whatsapp} onChange={set("whatsapp")} placeholder="6281234567890" />
          <Field label="Email" name="email" value={form.email} onChange={set("email")} placeholder="info@kaitohiro.co.id" type="email" />
          <Field label="Jam Operasional" name="working_hours" value={form.working_hours} onChange={set("working_hours")} placeholder="Senin–Sabtu, 08.00–17.00 WIB" />
        </SectionCard>

        {/* Sosial Media */}
        <SectionCard title="Sosial Media" icon={Globe}>
          <Field label="Instagram (URL lengkap)" name="instagram" value={form.instagram} onChange={set("instagram")} placeholder="https://instagram.com/kaitohiro.id" />
          <Field label="Facebook (URL lengkap)" name="facebook" value={form.facebook} onChange={set("facebook")} placeholder="https://facebook.com/kaitohiro" />
          <Field label="YouTube (URL lengkap)" name="youtube" value={form.youtube} onChange={set("youtube")} placeholder="https://youtube.com/@kaitohiro" />
          <Field label="TikTok (URL lengkap)" name="tiktok" value={form.tiktok} onChange={set("tiktok")} placeholder="https://tiktok.com/@kaitohiro" />
        </SectionCard>

        {/* Marketplace */}
        <SectionCard title="Marketplace" icon={Phone}>
          <Field label="Link Shopee Toko" name="shopee_url" value={form.shopee_url} onChange={set("shopee_url")} placeholder="https://shopee.co.id/kaitohiro" />
          <Field label="Link Tokopedia Toko" name="tokopedia_url" value={form.tokopedia_url} onChange={set("tokopedia_url")} placeholder="https://tokopedia.com/kaitohiro" />
        </SectionCard>

        {/* Kontak & Lokasi */}
        <SectionCard title="Kontak & Lokasi" icon={MapPin}>
          <TextareaField label="Alamat" name="address" value={form.address} onChange={set("address")} placeholder="Jl. Industri Raya No. 88, Jakarta..." rows={3} />
          <TextareaField
            label="Embed Google Maps (salin kode iframe dari Google Maps)"
            name="map_embed"
            value={form.map_embed}
            onChange={set("map_embed")}
            placeholder={'<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'}
            rows={5}
          />
          {/* Map preview */}
          {form.map_embed && (
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2">Preview Peta:</div>
              <div
                className="rounded-xl overflow-hidden border border-border [&_iframe]:w-full [&_iframe]:h-56 [&_iframe]:block"
                dangerouslySetInnerHTML={{ __html: form.map_embed }}
              />
            </div>
          )}
        </SectionCard>
      </div>

      {/* Akun Admin */}
      <CredentialSection />

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving} size="lg" className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </Button>
      </div>
    </div>
  );
}
