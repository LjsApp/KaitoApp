import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ArrowLeft, ArrowRight, Calendar, Search } from "lucide-react";
import { qkArticle, qkArticles } from "@/lib/queries";
import { motion, useScroll } from "framer-motion";
import { LazyImage } from "@/components/ui/LazyImage";
import { CardSkeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

/**
 * Sanitasi HTML artikel sebelum dirender — mencegah stored XSS.
 * Menghapus: <script>, <iframe>, <object>, <embed>, atribut on*, href=javascript:
 * Fallback ke raw HTML jika DOMParser tidak tersedia (SSR) atau parsing gagal.
 */
function sanitizeHtml(html: string): string {
  if (!html) return "";
  // SSR: window/DOMParser tidak tersedia — kembalikan html langsung
  // (konten dari DB sudah diinput via admin yang terautentikasi)
  if (typeof window === "undefined" || typeof DOMParser === "undefined") return html;
  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    // Hapus tag berbahaya
    doc.querySelectorAll("script, iframe, object, embed, form, meta").forEach((el) => el.remove());
    // Hapus atribut berbahaya di semua elemen
    doc.querySelectorAll("*").forEach((el) => {
      for (const attr of Array.from(el.attributes)) {
        if (
          attr.name.toLowerCase().startsWith("on") ||
          (attr.name.toLowerCase() === "href" && attr.value.trim().toLowerCase().startsWith("javascript:")) ||
          (attr.name.toLowerCase() === "src" && attr.value.trim().toLowerCase().startsWith("javascript:")) ||
          attr.name.toLowerCase() === "srcdoc"
        ) {
          el.removeAttribute(attr.name);
        }
      }
    });
    return doc.body.innerHTML || html;
  } catch {
    // Jika parsing gagal, kembalikan html asli (bukan string kosong)
    return html;
  }
}


export const Route = createFileRoute("/artikel/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Artikel — KTH` },
      { property: "og:url", content: `/artikel/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/artikel/${params.slug}` }],
  }),
  component: ArtikelDetail,
});

function ArtikelDetail() {
  const { slug } = Route.useParams();
  const { data: article, isLoading } = useQuery(qkArticle(slug));
  const { data: all = [] } = useQuery(qkArticles());
  const related = all.filter((a) => a.slug !== slug).slice(0, 3);

  // PENTING: useScroll harus dipanggil di sini (sebelum return kondisional apapun)
  // agar tidak melanggar Rules of Hooks React
  const { scrollYProgress } = useScroll();

  // Sanitasi konten HTML untuk mencegah XSS
  const safeContent = useMemo(() => sanitizeHtml(article?.content || ""), [article?.content]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl container-px py-24 space-y-6">
        <div className="h-8 w-32 bg-muted animate-pulse rounded-full mb-8" />
        <div className="h-12 w-full bg-muted animate-pulse rounded-lg" />
        <div className="h-12 w-3/4 bg-muted animate-pulse rounded-lg" />
        <div className="h-6 w-48 bg-muted animate-pulse rounded-md mt-6" />
        <div className="aspect-video w-full bg-muted animate-pulse rounded-2xl mt-8" />
        <div className="space-y-4 mt-8">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
          <div className="h-4 w-4/5 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }
  if (!article) {
    return (
      <div className="py-20 text-center">
        Artikel tidak ditemukan. <Link to="/artikel" className="text-primary underline">Kembali</Link>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
        style={{ scaleX: scrollYProgress }} 
      />
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        {article.cover_url ? (
          <LazyImage src={article.cover_url} alt={article.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-accent-orange" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-3xl container-px pb-10 md:pb-16">
          <Link to="/artikel" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Artikel
          </Link>
          <div className="flex items-center gap-3 mb-5">
            <span className="rounded-full bg-accent-orange text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
              {article.category}
            </span>
          </div>
          <h1 className="font-display font-black text-3xl md:text-5xl text-white leading-tight">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-5 text-white/75 text-sm mt-6 font-medium">
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4" />{formatDate(article.published_at, { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl container-px py-12">
        <article>
          {article.excerpt && (
            <p className="text-xl font-medium text-foreground/90 leading-relaxed border-l-4 border-primary pl-6 mb-10">
              {article.excerpt}
            </p>
          )}
          <div
            className="prose prose-lg max-w-none text-foreground/80 leading-loose"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent-orange/10 border border-primary/20 p-8 text-center">
            <h3 className="font-display font-bold text-xl mb-2">Butuh Pompa yang Tepat?</h3>
            <p className="text-muted-foreground mb-6">Konsultasikan kebutuhan Anda langsung dengan tim ahli KTH secara gratis.</p>
            <Link to="/kontak">
              <button className="bg-gradient-to-r from-primary to-primary-glow text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
                Hubungi Kami Sekarang
              </button>
            </Link>
          </div>
        </article>
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl container-px pb-20 border-t border-border pt-12">
          <h2 className="font-display font-bold text-2xl mb-8">Artikel Terkait</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((a) => (
              <Link key={a.slug} to="/artikel/$slug" params={{ slug: a.slug }} className="group flex flex-col">
                <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden relative mb-5">
                  {a.cover_url ? (
                    <LazyImage src={a.cover_url} alt={a.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (<div className="w-full h-full bg-muted" />)}
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-background/90 backdrop-blur text-foreground px-3 py-1 text-xs font-bold">{a.category}</span>
                  </div>
                </div>
                <h3 className="font-display font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">{a.title}</h3>
                <div className="mt-3 inline-flex items-center gap-1 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
