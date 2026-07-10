import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import React from "react";
import {
  ArrowRight, ShieldCheck, Zap, Volume2, Cpu, Wrench, BadgeCheck, Award, Anchor,
  Star, MessageCircle, Phone, Quote, Sparkles, Clock, Calendar, Maximize
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroFactory from "@/assets/hero-baru.jpg";
import kthParts from "@/assets/kth-parts.jpg";
import { useQuery } from "@tanstack/react-query";
import { qkFeaturedProducts, qkCategories, qkArticles } from "@/lib/queries";
import { STATS, WHY, TESTIMONIALS } from "@/data/content";
import { ProductCard } from "@/components/site/ProductCard";
import { Counter } from "@/components/site/Counter";
import { Reveal } from "@/components/site/Reveal";
import { formatDate } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap, Volume2, ShieldCheck, Cpu, Wrench, BadgeCheck, Award, Anchor,
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kaito Hiro (KTH) — Pompa Air Andal untuk Semua Kebutuhan" },
      { name: "description", content: "Pompa air premium ber-SNI dengan motor 100% kawat tembaga & garansi resmi 1 tahun ganti unit baru. 150+ distributor di Indonesia." },
      { property: "og:title", content: "Kaito Hiro (KTH) — Pompa Air Premium" },
      { property: "og:description", content: "Pompa air andal untuk semua kebutuhan rumah tangga & industri." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "id" | "en";
  const { data: featured = [] } = useQuery(qkFeaturedProducts());
  const { data: categories = [] } = useQuery(qkCategories());
  const { data: articles = [] } = useQuery(qkArticles());

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative isolate overflow-hidden bg-gradient-hero text-brand-foreground min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src={heroFactory}
            alt="Pabrik pompa air Kaito Hiro"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-transparent" />
          <div className="absolute inset-0 pointer-events-none">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="absolute rounded-full border border-white/10"
                style={{
                  left: `${15 + i * 20}%`,
                  top: `${25 + (i % 2) * 30}%`,
                  width: 80 + i * 50,
                  height: 80 + i * 50,
                  animation: `ripple 5s ${i * 0.8}s ease-out infinite`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl container-px py-24 lg:py-36 w-full grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-4 py-1.5 text-xs font-medium mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent-orange" />
              {t("hero.badge")}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight"
            >
              {t("hero.title").split(" ").slice(0, 2).join(" ")}{" "}
              <span className="bg-gradient-to-r from-accent-orange to-yellow-300 bg-clip-text text-transparent">
                {t("hero.title").split(" ").slice(2).join(" ")}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-white/80 max-w-xl leading-relaxed"
            >
              {t("hero.sub")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link to="/produk">
                <Button size="lg" className="bg-accent-orange text-white hover:opacity-90 shadow-glow group h-12 px-8 text-base">
                  {t("cta.seeProducts")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 h-12 px-8 text-base">
                  <MessageCircle className="mr-2 h-4 w-4" /> {t("cta.chatWA")}
                </Button>
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/80 font-medium"
            >
              {[
                { label: "Kapasitas Besar", icon: Maximize },
                { label: "Suara Halus", icon: Volume2 },
                { label: "Low Maintenance", icon: Wrench },
                { label: "Anti Karat", icon: ShieldCheck },
                { label: "Gantungan Pompa 100% Kuningan", icon: Anchor },
                { label: "Motor 100% Kawat Tembaga", icon: Zap },
              ].map((item) => (
                <span key={item.label} className="inline-flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <item.icon className="h-4 w-4 text-accent-orange" /> {item.label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Floating card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full max-w-md mx-auto lg:max-w-none mt-8 lg:mt-0"
          >
            <div className="relative glass-dark rounded-3xl p-8 shadow-elegant">
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/50 mb-5 font-semibold">Keunggulan Produk</div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[{ v: "10+", l: "Tahun" }, { v: "16+", l: "Distributor" }, { v: "52+", l: "Agen" }, { v: "24 Jam", l: "Non-Stop" }].map((s) => (
                  <div key={s.l} className="rounded-2xl bg-white/8 p-4">
                    <div className="font-display font-black text-2xl text-white">{s.v}</div>
                    <div className="text-xs text-white/60 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-accent-orange/15 border border-accent-orange/30 p-4">
                <ShieldCheck className="h-9 w-9 text-accent-orange shrink-0" />
                <div>
                  <div className="font-display font-bold text-sm text-white">Garansi Resmi</div>

                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-accent-orange/20 blur-3xl pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="bg-gradient-to-r from-primary/5 via-transparent to-accent-orange/5 border-y border-border/50">
        <div className="mx-auto max-w-7xl container-px py-10 lg:py-16 text-center">
          <Reveal>
            <h2 className="font-display font-black text-4xl md:text-6xl lg:text-7xl tracking-tight text-gradient opacity-90 italic">
              "KTH, ANDAL DI SETIAP ALIRAN"
            </h2>
          </Reveal>
        </div>
      </section>

      {/* ── INSIDE KTH FEATURE ── */}
      <section className="mx-auto max-w-7xl container-px py-12 lg:py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl shadow-soft">
            <img
              src={kthParts}
              alt="Bagian-bagian Pompa KTH KAITOHIRO"
              loading="lazy"
              className="w-full h-auto object-cover"
            />
          </div>
        </Reveal>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="mx-auto max-w-7xl container-px py-12 lg:py-16">
        <Reveal className="flex items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">Produk Unggulan</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">Best Seller KTH</h2>
          </div>
          <Link to="/produk" className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
            {t("cta.viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center md:hidden">
          <Link to="/produk">
            <Button variant="outline" className="gap-2">Lihat Semua Produk <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-card border-y border-border py-16 lg:py-20">
        <div className="mx-auto max-w-7xl container-px">
          <Reveal className="mb-14">
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">Lini Produk</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">Temukan Pompa yang Tepat</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.05}>
                <Link
                  to="/kategori/$slug"
                  params={{ slug: c.slug }}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-2xl hover-lift"
                >
                  {c.image_url ? (
                    <img src={c.image_url} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent-orange/40" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-accent-orange font-bold mb-1 line-clamp-1">{c.description}</div>
                    <h3 className="font-display font-bold text-xl text-white">{c.name}</h3>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-white/80 group-hover:text-accent-orange group-hover:gap-3 transition-all font-semibold">
                      Lihat Produk <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY KTH ── */}
      <section className="mx-auto max-w-7xl container-px py-16 lg:py-20">
        <Reveal className="mb-14">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">Kenapa KTH</div>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">
            Kualitas Premium, <span className="text-gradient">Harga Tepat</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Setiap pompa dirancang dengan komponen premium dan diuji ketat untuk performa jangka panjang.</p>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {WHY.map((w, i) => {
            const Icon = ICON_MAP[w.icon] ?? Zap;
            return (
              <Reveal key={i} delay={i * 0.04}>
                <div className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-soft transition-all duration-300 h-full">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold text-sm md:text-base mb-1.5">{w.title[lang]}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{w.desc[lang]}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── WARRANTY BANNER ── */}
      <section className="mx-auto max-w-7xl container-px pb-10">
        <div className="relative overflow-hidden rounded-3xl bg-brand-bg text-brand-foreground p-8 md:p-14">
          <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-accent-orange/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-primary-glow/20 blur-3xl pointer-events-none" />
          <div className="relative grid md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-center">
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white/10 backdrop-blur shrink-0">
              <ShieldCheck className="h-10 w-10 text-accent-orange" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-2xl md:text-3xl">Garansi Resmi 1 Tahun Ganti Unit Baru</h3>
              <p className="mt-2 text-white/70 leading-relaxed">Sparepart original, service support nasional, dan jaringan distributor di seluruh Indonesia.</p>
            </div>
            <Link to="/kontak" className="shrink-0">
              <Button className="bg-accent-orange text-white hover:opacity-90 h-12 px-6 whitespace-nowrap">
                Klaim Garansi <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 lg:py-20 bg-card border-y border-border">
        <div className="mx-auto max-w-7xl container-px">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">Testimoni</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">Dipercaya Ribuan Pelanggan</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 3).map((t, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="relative p-7 rounded-2xl border border-border bg-background hover:shadow-soft transition-shadow h-full flex flex-col">
                  <Quote className="absolute top-5 right-5 h-8 w-8 text-primary/8" />
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, k) => (
                      <Star key={k} className="h-4 w-4 fill-accent-orange text-accent-orange" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80 flex-1">"{t.quote}"</p>
                  <div className="mt-6 pt-5 border-t border-border/60 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 grid place-items-center text-primary font-bold text-sm shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTICLES ── */}
      <section className="mx-auto max-w-7xl container-px py-16 lg:py-20">
        <Reveal className="flex items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">Artikel & Edukasi</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">Belajar tentang Pompa Air</h2>
          </div>
          <Link to="/artikel" className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
            Semua artikel <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.06}>
              <Link to="/artikel/$slug" params={{ slug: a.slug }} className="group block rounded-2xl overflow-hidden border border-border bg-card hover-lift">
                <div className="aspect-[16/10] relative overflow-hidden">
                  {a.cover_url ? (
                    <img src={a.cover_url} alt={a.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent-orange/10 grid place-items-center">
                      <span className="font-display font-extrabold text-5xl text-gradient opacity-20">KTH</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-accent-orange text-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">{a.category}</span>
                  </div>
                  {/* Overlay tipis — sedikit lebih gelap saat hover */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(a.published_at, { day: "numeric", month: "short" })}</span>
                  </div>
                  <h3 className="font-display font-bold text-base md:text-lg group-hover:text-primary line-clamp-2 transition-colors">{a.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{a.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ── CTA ── */}
      <section className="mx-auto max-w-7xl container-px pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero text-brand-foreground p-10 md:p-20 text-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-accent-orange/20 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-primary-glow/30 blur-3xl" />
          </div>
          <div className="relative max-w-2xl mx-auto">
            <div className="text-xs uppercase tracking-[0.2em] text-accent-orange font-semibold mb-4">Konsultasi Gratis</div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl leading-tight">Masih Bingung Memilih Pompa?</h2>
            <p className="mt-5 text-white/75 text-lg leading-relaxed">
              Tim ahli KTH siap membantu Anda menemukan pompa yang tepat sesuai kebutuhan dan anggaran.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener">
                <Button size="lg" className="bg-success text-white hover:opacity-90 h-12 px-8">
                  <MessageCircle className="mr-2 h-4 w-4" /> Chat WhatsApp
                </Button>
              </a>
              <Link to="/kontak">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 h-12 px-8">
                  <Phone className="mr-2 h-4 w-4" /> Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
