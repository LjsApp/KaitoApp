import { createFileRoute, Link } from "@tanstack/react-router";
import { Factory, Target, Eye, Heart, BadgeCheck, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/site/Reveal";
import { TIMELINE } from "@/data/content";
import warehouse from "@/assets/warehouse.jpg";
import team from "@/assets/team.jpg";

export const Route = createFileRoute("/tentang")({
  head: () => ({
    meta: [
      { title: "Tentang Kami — Kaito Hiro (KTH)" },
      { name: "description", content: "Sejarah, visi, misi, dan komitmen Kaito Hiro sebagai produsen pompa air premium di Indonesia." },
      { property: "og:title", content: "Tentang Kaito Hiro" },
      { property: "og:url", content: "/tentang" },
      { property: "og:image", content: team },
    ],
    links: [{ rel: "canonical", href: "/tentang" }],
  }),
  component: TentangPage,
});

function TentangPage() {
  return (
    <>
      {/* ── FULL BLEED HERO ── */}
      <div className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden">
        <img src={warehouse} alt="Fasilitas Kaito Hiro" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-16 mx-auto max-w-7xl container-px">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          >
            <div className="text-xs uppercase tracking-[0.25em] text-accent-orange font-bold mb-4">Tentang Kami</div>
            <h1 className="font-display font-black text-4xl md:text-6xl text-white leading-tight max-w-3xl">
              Pompa Air Premium<br />untuk Indonesia
            </h1>
            <p className="mt-5 text-white/70 text-lg max-w-2xl leading-relaxed">
              Lebih dari 10 tahun menghadirkan pompa air berkualitas dan menjadi mitra terpercaya ribuan pelanggan di seluruh Indonesia.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── STORY ── */}
      <section className="mx-auto max-w-7xl container-px py-12 md:py-16 grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">Cerita Kami</div>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl leading-tight">
            Dari Workshop Kecil<br />hingga Brand Nasional
          </h2>
          {/* Pull Quote */}
          <blockquote className="mt-8 pl-6 border-l-4 border-accent-orange">
            <p className="text-xl font-medium text-foreground/80 italic leading-relaxed">
              "Kami percaya setiap keluarga Indonesia berhak mendapatkan air bersih yang cukup, kapan pun dibutuhkan."
            </p>
            <footer className="mt-3 text-sm text-muted-foreground font-semibold">— Pendiri, Kaito Hiro</footer>
          </blockquote>
          <p className="mt-7 text-muted-foreground leading-relaxed">
            Kaito Hiro (KTH) didirikan pada tahun 2015 dengan satu tujuan sederhana: menghadirkan pompa air berkualitas tinggi yang terjangkau bagi keluarga Indonesia. Dimulai dari workshop kecil di Jakarta, kini KTH menjadi salah satu merek pompa air paling dipercaya dengan jaringan <strong className="text-foreground">150+ distributor</strong> dan ribuan agen di seluruh nusantara.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Setiap pompa KTH dibuat dengan komponen premium — motor 100% kawat tembaga, gantungan kuningan, dan body anti karat — yang dijamin garansi resmi ganti unit baru selama 1 tahun.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-4">
            <img src={warehouse} alt="Gudang KTH" loading="lazy" className="aspect-[3/4] w-full rounded-3xl object-cover shadow-elegant" />
            <img src={team} alt="Tim KTH" loading="lazy" className="aspect-[3/4] w-full rounded-3xl object-cover shadow-elegant mt-8" />
          </div>
        </Reveal>
      </section>

      {/* ── VISI MISI ── */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl container-px py-12 md:py-16 grid md:grid-cols-2 gap-8">
          <Reveal>
            <div className="h-full">
              <div className="inline-flex items-center gap-3 mb-5">
                <div className="h-11 w-11 rounded-xl bg-primary/10 grid place-items-center">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-2xl">Visi</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Menjadi perusahaan pompa terkemuka yang memperkuat brand skala nasional dengan mengedepankan kualitas, pelayanan, dan kepuasan pelanggan.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full">
              <div className="inline-flex items-center gap-3 mb-5">
                <div className="h-11 w-11 rounded-xl bg-accent-orange/10 grid place-items-center">
                  <Target className="h-5 w-5 text-accent-orange" />
                </div>
                <h3 className="font-display font-bold text-2xl">Misi</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Mengembangkan produk pompa yang inovatif dan berkualitas tinggi.",
                  "Menjamin ketersediaan produk serta layanan garansi yang mudah diakses.",
                  "Memberikan pelayanan terbaik kepada pelanggan di seluruh Indonesia.",
                  "Memberikan edukasi mengenai penggunaan dan perawatan pompa air.",
                ].map((m, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-accent-orange/15 text-accent-orange text-xs font-bold grid place-items-center shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-muted-foreground leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <TimelineSection />

      {/* ── CORE VALUES ── */}
      <section className="mx-auto max-w-7xl container-px py-12 md:py-16">
        <Reveal className="text-center mb-14">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">DNA Perusahaan</div>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl">Nilai Inti Kami</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Heart, label: "01", t: "Pelanggan #1", d: "Kepuasan pelanggan adalah prioritas utama dalam setiap keputusan yang kami ambil.", color: "text-rose-500 bg-rose-500/10" },
            { icon: BadgeCheck, label: "02", t: "Kualitas Premium", d: "Standar tinggi untuk setiap komponen, proses produksi, dan unit yang kami kirimkan.", color: "text-primary bg-primary/10" },
            { icon: Target, label: "03", t: "Inovasi", d: "Terus mengembangkan produk yang lebih efisien, hemat energi, dan mudah dirawat.", color: "text-accent-orange bg-accent-orange/10" },
            { icon: Eye, label: "04", t: "Transparansi", d: "Komunikasi terbuka dan jujur dengan seluruh mitra, distributor, dan pelanggan.", color: "text-emerald-500 bg-emerald-500/10" },
          ].map((v, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="p-7 rounded-2xl border border-border hover:shadow-soft transition-shadow h-full">
                <div className={`h-12 w-12 rounded-xl grid place-items-center mb-5 ${v.color}`}>
                  <v.icon className="h-6 w-6" />
                </div>
                <div className="text-[10px] text-muted-foreground font-bold tracking-widest mb-1">{v.label}</div>
                <h3 className="font-display font-bold text-lg mb-3">{v.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-7xl container-px pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-brand-bg text-brand-foreground p-10 md:p-16">
          <div className="absolute -top-16 -right-16 h-80 w-80 rounded-full bg-accent-orange/10 blur-3xl pointer-events-none" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-display font-extrabold text-2xl md:text-3xl">Bergabung Bersama 150+ Distributor KTH</h3>
              <p className="mt-3 text-white/70 leading-relaxed">Jadilah bagian dari jaringan distribusi pompa air terpercaya di Indonesia dan raih peluang bisnis yang menjanjikan.</p>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <Link to="/kontak">
                <button className="inline-flex items-center gap-2 bg-accent-orange text-white font-bold px-7 py-3 rounded-xl hover:opacity-90 transition-opacity">
                  Hubungi Kami <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
              <Link to="/produk">
                <button className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-bold px-7 py-3 rounded-xl hover:bg-white/20 transition-colors">
                  Lihat Produk <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 20%"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="mx-auto max-w-4xl container-px py-12 md:py-16">
      <Reveal className="text-center mb-14">
        <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">Perjalanan</div>
        <h2 className="font-display font-extrabold text-3xl md:text-4xl">10 Tahun Pertumbuhan</h2>
      </Reveal>
      <div ref={ref} className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />
        <motion.div
          style={{ height: lineHeight }}
          className="absolute left-4 md:left-1/2 top-0 w-0.5 bg-gradient-to-b from-primary to-accent-orange md:-translate-x-1/2 origin-top"
        />
        {TIMELINE.map((item, i) => {
          const fromRight = i % 2 === 1;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: fromRight ? 40 : -40, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`relative mb-10 md:grid md:grid-cols-2 md:gap-8 ${fromRight ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <div className={`pl-12 md:pl-0 ${fromRight ? "md:pl-12" : "md:pr-12 md:text-right"}`}>
                <div className="text-2xl font-display font-extrabold text-gradient">{item.year}</div>
                <h3 className="mt-1 font-display font-bold text-base">{item.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
              <div className="hidden md:block" />
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 14, delay: i * 0.08 + 0.1 }}
                className="absolute left-4 md:left-1/2 top-1.5 -translate-x-1/2 grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground shadow-elegant ring-4 ring-background"
              >
                <Factory className="h-3 w-3" />
                <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping opacity-25" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
