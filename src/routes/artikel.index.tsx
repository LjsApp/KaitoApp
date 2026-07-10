import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar, ArrowRight } from "lucide-react";
import { qkArticles } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { LazyImage } from "@/components/ui/LazyImage";
import { Reveal } from "@/components/site/Reveal";
import { CardSkeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/artikel/")({
  head: () => ({
    meta: [
      { title: "Artikel & Edukasi Pompa Air — Kaito Hiro" },
      { name: "description", content: "Tips memilih, merawat, dan menggunakan pompa air." },
      { property: "og:url", content: "/artikel" },
    ],
    links: [{ rel: "canonical", href: "/artikel" }],
  }),
  component: ArtikelIndex,
});

function ArtikelIndex() {
  const { data: articles = [], isLoading } = useQuery(qkArticles());
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const cats = ["all", ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))];

  const list = useMemo(
    () => articles.filter((a) =>
      (cat === "all" || a.category === cat) &&
      (!q || (a.title + a.excerpt).toLowerCase().includes(q.toLowerCase())),
    ),
    [articles, q, cat],
  );

  const featured = list[0];
  const sideArticles = list.slice(1, 4);
  const remaining = list.slice(4);

  return (
    <section className="mx-auto max-w-7xl container-px pt-6 pb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="font-display font-black text-3xl md:text-4xl tracking-tight">KTH <span className="text-primary">Edukasi</span></h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-base">Wawasan ahli, tips perawatan, dan panduan seputar pompa air premium.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari artikel..."
              className="h-10 pl-10 pr-4 rounded-xl bg-muted border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex items-center gap-2 bg-muted p-1 rounded-lg overflow-x-auto">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap transition ${cat === c ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {c === "all" ? "Semua" : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="py-24 text-center text-muted-foreground">Belum ada artikel.</div>
      ) : (
        <>
          {featured && (
            <div className="grid lg:grid-cols-12 gap-8 mb-16">
              <Reveal delay={0.1} className="lg:col-span-8 group relative rounded-2xl overflow-hidden aspect-[16/10] block">
                <Link to="/artikel/$slug" params={{ slug: featured.slug }}>
                  {featured.cover_url ? (
                    <LazyImage src={featured.cover_url} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (<div className="w-full h-full bg-muted" />)}
                  {/* Overlay tipis merata */}
                  <div className="absolute inset-0 bg-black/20" />
                  {/* Gradient bawah untuk area teks */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="rounded-full bg-accent-orange text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">{featured.category}</span>
                    <h2 className="font-display font-black text-3xl md:text-4xl text-white mt-4 leading-tight line-clamp-2">{featured.title}</h2>
                    <p className="text-white/80 mt-3 line-clamp-2">{featured.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
              <div className="lg:col-span-4 flex flex-col gap-6">
                {sideArticles.map((a, i) => (
                  <Reveal key={a.slug} delay={0.2 + (i * 0.1)}>
                    <Link to="/artikel/$slug" params={{ slug: a.slug }} className="group flex gap-5 bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-elegant transition-all p-3 border border-border/50">
                      <div className="w-28 h-28 shrink-0 relative rounded-xl overflow-hidden">
                        {a.cover_url ? <LazyImage src={a.cover_url} alt={a.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-muted" />}
                      </div>
                      <div className="flex flex-col justify-center flex-1 py-1 pr-2">
                        <span className="text-accent-orange font-bold text-[10px] mb-2 uppercase tracking-widest">{a.category}</span>
                        <h3 className="font-display font-bold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors leading-snug">{a.title}</h3>
                        <div className="text-muted-foreground text-xs mt-3 flex items-center gap-1.5">
                          <span className="flex items-center gap-1.5 font-medium">
                            {formatDate(a.published_at, { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {remaining.length > 0 && (
            <div className="mb-20">
              <div className="flex items-center justify-between mb-8 border-b border-border/50 pb-4">
                <h3 className="font-display font-bold text-2xl">Berita Terbaru</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remaining.map((a, i) => (
                  <Reveal key={a.slug} delay={Math.min(i * 0.05, 0.4)}>
                    <Link to="/artikel/$slug" params={{ slug: a.slug }} className="group flex flex-col h-full">
                      <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden relative shadow-sm mb-5">
                        {a.cover_url ? <LazyImage src={a.cover_url} alt={a.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="w-full h-full bg-muted" />}
                        {/* Overlay tipis agar badge kategori lebih kontras */}
                        <div className="absolute inset-0 bg-black/15 rounded-2xl" />
                        <div className="absolute top-4 left-4">
                          <span className="rounded-full bg-background/90 backdrop-blur text-foreground px-3 py-1 text-xs font-bold">{a.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(a.published_at)}</span>
                      </div>
                      <h4 className="font-display font-bold text-xl group-hover:text-primary transition-colors line-clamp-2 mb-3">{a.title}</h4>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">{a.excerpt}</p>
                      <span className="mt-auto inline-flex items-center gap-1 text-primary text-sm font-semibold">Baca <ArrowRight className="h-4 w-4" /></span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
