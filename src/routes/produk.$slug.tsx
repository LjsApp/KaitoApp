import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Download,
  MessageCircle,
  Share2,
  ShieldCheck,
  BadgeCheck,
  Clock,
  Check,
  ShoppingBag,
  Store,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { qkProduct, qkProductsByCategory } from "@/lib/queries";
import { useCompany } from "@/hooks/use-company";
import { FAQS } from "@/data/content";

export const Route = createFileRoute("/produk/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Produk — Kaito Hiro (KTH)` },
      { property: "og:url", content: `/produk/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/produk/${params.slug}` }],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useQuery(qkProduct(slug));
  const company = useCompany();
  const [active, setActive] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { data: related = [] } = useQuery({
    ...qkProductsByCategory(product?.category?.slug ?? ""),
    enabled: !!product?.category?.slug,
  });

  if (isLoading) return <div className="py-24 text-center text-muted-foreground">Memuat...</div>;
  if (!product) {
    return (
      <div className="py-20 text-center">
        Produk tidak ditemukan.{" "}
        <Link to="/produk" className="text-primary underline">
          Kembali
        </Link>
      </div>
    );
  }

  const gallery = product.gallery?.length ? product.gallery : [""];
  const shopee = product.shopee_url || company.shopee_url;
  const tokped = product.tokopedia_url || company.tokopedia_url;

  return (
    <>
      <PageHero
        title={product.name}
        subtitle={product.tagline}
        breadcrumb={[
          { label: "Produk", to: "/produk" },
          ...(product.category ? [{ label: product.category.name }] : []),
          { label: product.name },
        ]}
      />

      <section className="mx-auto max-w-7xl container-px py-10 grid lg:grid-cols-2 gap-10">
        <div>
          <div className="relative aspect-square rounded-3xl border border-border bg-gradient-to-br from-muted to-accent overflow-hidden shadow-soft">
            {gallery[active] ? (
              <img
                src={gallery[active]}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                Tanpa Gambar
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
              <span className="rounded-full bg-accent-orange text-accent-orange-foreground px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                {product.sku}
              </span>
              <span className="rounded-full bg-card/90 backdrop-blur px-3 py-1 text-xs font-semibold inline-flex items-center gap-1 text-primary">
                <ShieldCheck className="h-3 w-3" /> SNI
              </span>
              <span className="rounded-full bg-card/90 backdrop-blur px-3 py-1 text-xs font-semibold inline-flex items-center gap-1 text-accent-orange">
                <BadgeCheck className="h-3 w-3" /> GARANSI
              </span>
            </div>
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`relative aspect-square rounded-xl border-2 overflow-hidden transition-all ${active === i ? "border-primary shadow-soft" : "border-border hover:border-primary/50"}`}
                >
                  {g && (
                    <img src={g} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.category && (
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
              {product.category.name}
            </div>
          )}
          <h2 className="mt-2 font-display font-extrabold text-3xl md:text-4xl">{product.name}</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line">
            {product.description}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { icon: ShieldCheck, label: "Garansi", val: "1 Tahun" },
              { icon: BadgeCheck, label: "Sertifikasi", val: "SNI" },
              { icon: Clock, label: "Operasi", val: "24 Jam" },
            ].map((b, i) => (
              <div key={i} className="rounded-xl bg-muted/60 p-3 text-center">
                <b.icon className="h-5 w-5 mx-auto text-primary mb-1" />
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {b.label}
                </div>
                <div className="font-semibold text-sm">{b.val}</div>
              </div>
            ))}
          </div>

          {product.specs?.length > 0 && (
            <div className="mt-8">
              <h3 className="font-display font-bold text-lg mb-3">Spesifikasi</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.specs.map((s, i) => (
                  <SpecRow key={i} label={s.key} value={s.value} />
                ))}
              </div>
            </div>
          )}

          {product.features && product.features.length > 0 && (
            <div className="mt-8">
              <h3 className="font-display font-bold text-lg mb-3">Keunggulan</h3>
              <ul className="grid sm:grid-cols-2 gap-2">
                {product.features.map((f) => (
                  <li key={f.id} className="flex items-start gap-2 text-sm">
                    <BadgeCheck className="h-4 w-4 mt-0.5 text-accent-orange shrink-0" /> {f.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-3">
            {product.document_url && (
              <a href={product.document_url} target="_blank" rel="noopener">
                <Button
                  size="default"
                  variant="default"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Katalog
                </Button>
              </a>
            )}
            <a
              href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(`Halo KTH, saya tertarik dengan ${product.name} (${product.sku}).`)}`}
              target="_blank"
              rel="noopener"
            >
              <Button size="default" className="w-full bg-success text-white hover:opacity-90">
                <MessageCircle className="mr-2 h-4 w-4" /> Chat WhatsApp
              </Button>
            </a>
            {shopee && (
              <a href={shopee} target="_blank" rel="noopener">
                <Button
                  size="default"
                  variant="outline"
                  className="w-full border-[#EE4D2D] text-[#EE4D2D] hover:bg-[#EE4D2D] hover:text-white"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" /> Shopee
                </Button>
              </a>
            )}
            {tokped && (
              <a href={tokped} target="_blank" rel="noopener">
                <Button
                  size="default"
                  variant="outline"
                  className="w-full border-[#03AC0E] text-[#03AC0E] hover:bg-[#03AC0E] hover:text-white"
                >
                  <Store className="mr-2 h-4 w-4" /> Tokopedia
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── Q&A / FAQ ── */}
      <section className="mx-auto max-w-7xl container-px pb-16">
        <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-soft">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center shrink-0">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-0.5">
                Support
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl">Pertanyaan Umum</h3>
            </div>
          </div>
          <div className="divide-y divide-border">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="py-0.5">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-3 text-left group"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`font-semibold text-sm md:text-base transition-colors ${isOpen ? "text-primary" : "group-hover:text-primary"}`}
                    >
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "group-hover:text-primary"}`}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: isOpen ? "300px" : "0px", opacity: isOpen ? 1 : 0 }}
                  >
                    <p className="pb-3 pr-8 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
            <p className="text-sm text-muted-foreground">Tidak menemukan jawaban yang Anda cari?</p>
            <a
              href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent("Halo KTH, saya punya pertanyaan tentang produk Anda.")}`}
              target="_blank"
              rel="noopener"
            >
              <Button size="sm" className="bg-success text-white hover:opacity-90 shrink-0">
                <MessageCircle className="mr-2 h-3.5 w-3.5" /> Tanya via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {related.filter((r) => r.slug !== product.slug).length > 0 && (
        <section className="mx-auto max-w-7xl container-px py-16">
          <h3 className="font-display font-bold text-2xl mb-6">Produk Terkait</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related
              .filter((r) => r.slug !== product.slug)
              .slice(0, 3)
              .map((r) => (
                <ProductCard key={r.id} product={r} />
              ))}
          </div>
        </section>
      )}
    </>
  );
}

function SpecRow({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={`rounded-xl bg-muted/60 px-4 py-3 ${full ? "col-span-2" : ""}`}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-semibold text-sm mt-0.5">{value}</div>
    </div>
  );
}
