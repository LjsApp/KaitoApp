import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { useCompany } from "@/hooks/use-company";
import { submitMessage } from "@/lib/queries";
import { toast } from "sonner";
import team from "@/assets/team.jpg";

export const Route = createFileRoute("/kontak")({
  head: () => ({
    meta: [
      { title: "Kontak Kami — Kaito Hiro (KTH)" },
      { name: "description", content: "Hubungi tim Kaito Hiro untuk konsultasi pompa air dan layanan purna jual." },
      { property: "og:url", content: "/kontak" },
    ],
    links: [{ rel: "canonical", href: "/kontak" }],
  }),
  component: KontakPage,
});

function KontakPage() {
  const SITE = useCompany();
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);

    // ── Honeypot anti-bot: jika field _hp terisi, abaikan (ini bot)
    if (fd.get("_hp")) {
      // Pura-pura berhasil agar bot tidak tahu terdeteksi
      toast.success("Pesan terkirim! Tim kami akan menghubungi Anda secepatnya.");
      setLoading(false);
      form.reset();
      return;
    }
    try {
      await submitMessage({
        name: String(fd.get("name") || ""),
        phone: String(fd.get("phone") || ""),
        email: String(fd.get("email") || ""),
        subject: String(fd.get("subject") || ""),
        message: String(fd.get("message") || ""),
      });
      toast.success("Pesan terkirim! Tim kami akan menghubungi Anda secepatnya.");
      form.reset();
    } catch (err) {
      toast.error("Sistem sedang perbaikan, mengalihkan pesan Anda ke WhatsApp...", {
        duration: 3000,
      });
      // Fallback ke WhatsApp
      const text = `Halo Kaito Hiro, saya ingin meninggalkan pesan.\n\n*Nama:* ${fd.get("name")}\n*No. Telepon:* ${fd.get("phone")}\n*Email:* ${fd.get("email")}\n*Subjek:* ${fd.get("subject")}\n\n*Pesan:*\n${fd.get("message")}`;
      
      setTimeout(() => {
        window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
        setLoading(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {/* ── HEADER & HERO SPLIT ── */}
      <section className="relative overflow-hidden bg-brand-bg text-brand-foreground min-h-[60vh] flex items-center">
        {/* Background image half */}
        <div className="absolute top-0 right-0 bottom-0 w-full lg:w-1/2 opacity-30 lg:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/80 to-transparent z-10 hidden lg:block" />
          <div className="absolute inset-0 bg-brand-bg/60 z-10 lg:hidden" />
          <img src={team} alt="Customer Service KTH" className="w-full h-full object-cover" />
        </div>

        <div className="relative z-20 mx-auto max-w-7xl container-px py-12 md:py-16 w-full">
          <div className="max-w-xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-accent-orange mb-6">
                Hubungi Kami
              </div>
              <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl leading-tight text-white mb-6">
                Kami Siap Membantu Anda.
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-10">
                Punya pertanyaan tentang produk? Ingin klaim garansi? Atau tertarik menjadi distributor resmi KTH? Tim ahli kami selalu siap sedia.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="grid sm:grid-cols-2 gap-5">
                <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="group">
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-success/20 border border-success/30 hover:bg-success/30 transition-all">
                    <div className="h-12 w-12 rounded-full bg-success text-white grid place-items-center shrink-0">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-white text-lg">WhatsApp</div>
                      <div className="text-xs text-white/70">Respon cepat 24/7</div>
                    </div>
                  </div>
                </a>
                <a href={`tel:${SITE.phone}`} className="group">
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="h-12 w-12 rounded-full bg-white/10 text-white grid place-items-center shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-white text-lg">Telepon</div>
                      <div className="text-xs text-white/70">Senin - Sabtu</div>
                    </div>
                  </div>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CONTACT INFO & FORM ── */}
      <section className="mx-auto max-w-7xl container-px py-12 md:py-16">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 items-start">
          
          {/* Info Column */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display font-bold text-3xl mb-2">Informasi Kontak</h2>
              <p className="text-muted-foreground">Kunjungi kantor pusat kami atau hubungi melalui saluran resmi KTH.</p>
            </div>
            
            <div className="space-y-6">
              <ContactRow icon={MapPin} title="Kantor Pusat" desc={SITE.address} />
              <ContactRow icon={Mail} title="Email Resmi" desc={SITE.email} href={`mailto:${SITE.email}`} />
              <ContactRow icon={Clock} title="Jam Operasional" desc={SITE.working_hours || "Senin – Sabtu, 08.00–17.00 WIB"} />
            </div>


          </div>

          {/* Form Column */}
          <div className="lg:col-span-3">
            <Reveal delay={0.2}>
              <div className="bg-card border border-border shadow-elegant rounded-3xl p-8 md:p-10">
                <div className="mb-8">
                  <h2 className="font-display font-bold text-2xl">Kirim Pesan Langsung</h2>
                  <p className="text-muted-foreground mt-2">Isi formulir di bawah ini dan kami akan membalas email Anda dalam 1x24 jam.</p>
                </div>
                
                <form onSubmit={submit} className="space-y-5">
                  {/* Honeypot anti-bot — tersembunyi dari pengguna nyata */}
                  <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                    <label htmlFor="_hp">Biarkan kosong</label>
                    <input id="_hp" name="_hp" type="text" tabIndex={-1} autoComplete="off" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="Nama Lengkap">
                      <input name="name" required className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground" placeholder="Contoh: Budi Santoso" />
                    </Field>
                    <Field label="No. WhatsApp / Telepon">
                      <input name="phone" required type="tel" className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground" placeholder="Contoh: 0812..." />
                    </Field>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <Field label="Alamat Email">
                      <input name="email" required type="email" className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground" placeholder="nama@email.com" />
                    </Field>
                    <Field label="Subjek Pesan">
                      <select name="subject" required className="w-full h-12 bg-muted border border-border rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all">
                        <option value="">Pilih keperluan Anda</option>
                        <option>Pertanyaan Produk / Harga</option>
                        <option>Klaim Garansi / Servis</option>
                        <option>Kemitraan / Menjadi Distributor</option>
                        <option>Lainnya</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Pesan Anda">
                    <textarea name="message" rows={5} required className="w-full bg-muted border border-border rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none placeholder:text-muted-foreground" placeholder="Tuliskan pertanyaan atau pesan Anda di sini..." />
                  </Field>
                  <div className="pt-2">
                    <Button type="submit" size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground font-bold h-12 px-8 rounded-xl hover:opacity-90 transition-opacity" disabled={loading}>
                      {loading ? (
                        "Mengirim..."
                      ) : (
                        <><Send className="mr-2 h-4 w-4" /> Kirim Pesan Sekarang</>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </Reveal>
          </div>

        </div>
      </section>

      {SITE.map_embed ? (
        <section className="w-full h-[500px] relative">
          <div className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0" dangerouslySetInnerHTML={{ __html: SITE.map_embed }} />
        </section>
      ) : SITE.address ? (
        <section className="w-full h-[500px] relative grayscale hover:grayscale-0 transition-all duration-700">
          <iframe
            title="Lokasi Pusat KTH"
            src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.address)}&output=embed`}
            className="w-full h-full border-0 absolute inset-0"
            loading="lazy"
          />
        </section>
      ) : null}
    </>
  );
}

function ContactRow({ icon: Icon, title, desc, href }: { icon: any; title: string; desc: string; href?: string }) {
  const inner = (
    <div className="flex items-start gap-4 group cursor-pointer">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
        <Icon className="h-5 w-5" />
      </div>
      <div className="pt-1">
        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{title}</div>
        <div className="text-sm font-medium leading-relaxed group-hover:text-primary transition-colors">{desc}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="block">{inner}</a> : inner;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-foreground/90">{label}</label>
      {children}
    </div>
  );
}
