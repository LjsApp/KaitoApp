import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Search, Package, ChevronDown, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { qkProducts, qkCategories } from "@/lib/queries";
import { cn } from "@/lib/utils";

import { CardSkeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/produk/")({
  head: () => ({
    meta: [
      { title: "Katalog Produk Pompa Air — Kaito Hiro (KTH)" },
      { name: "description", content: "Jelajahi katalog pompa air KTH." },
      { property: "og:url", content: "/produk" },
    ],
    links: [{ rel: "canonical", href: "/produk" }],
  }),
  component: ProdukIndex,
});

function ProdukIndex() {
  const { t } = useTranslation();
  const { data: products = [], isLoading } = useQuery(qkProducts());
  const { data: categories = [] } = useQuery(qkCategories());
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState<string>("newest");
  const [filterOpen, setFilterOpen] = useState(false);

  const list = useMemo(() => {
    let arr = products.filter((p) => {
      const matchQ =
        !q || `${p.name} ${p.sku} ${p.tagline}`.toLowerCase().includes(q.toLowerCase());
      const matchCat = cat === "all" || p.category?.slug === cat;
      return matchQ && matchCat;
    });
    if (sort === "featured") arr = [...arr].sort((a, b) => Number(b.featured) - Number(a.featured));
    if (sort === "name") arr = [...arr].sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [products, q, cat, sort]);

  return (
    <>
      <div className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto max-w-7xl container-px py-6 md:py-8">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-1.5">
            Katalog Lengkap
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">
            Produk Kaito Hiro
          </h1>
          <p className="mt-2 text-muted-foreground text-sm md:text-base max-w-2xl">
            Dari pompa jet rumah tangga hingga pompa industri kapasitas besar — temukan solusi yang
            tepat.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-7xl container-px pb-10 pt-4">
        <div className="sticky top-[81px] lg:top-[97px] z-20 -mx-4 px-4 md:mx-0 md:px-0 pb-4 pt-3">
          <div className="rounded-2xl border border-border bg-background/95 backdrop-blur shadow-soft overflow-hidden">
            {/* Filter Header — hanya tampil di mobile */}
            <button
              onClick={() => setFilterOpen((v) => !v)}
              className="w-full flex md:hidden items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Filter Produk</span>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-300",
                  filterOpen && "rotate-180",
                )}
              />
            </button>

            {/* Filter Body — collapse di mobile, selalu tampil di desktop */}
            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out md:!grid-rows-[1fr] md:!opacity-100",
                filterOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="px-4 md:px-5 pb-3 pt-1 md:pt-3 border-t border-border/60 md:border-none">
                  <div className="flex flex-col sm:flex-row gap-2.5 mb-3 md:mt-0">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder={t("common.search")}
                        className="w-full h-10 bg-muted border border-border rounded-xl pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                    </div>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="h-10 rounded-xl border border-border bg-muted px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="newest">Terbaru</option>
                      <option value="featured">Unggulan</option>
                      <option value="name">Nama A-Z</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Pill active={cat === "all"} onClick={() => setCat("all")}>
                      Semua
                    </Pill>
                    {categories.map((c) => (
                      <Pill key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
                        {c.name}
                      </Pill>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-1.5 mb-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{list.length}</span> produk ditemukan
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="mt-8 text-center py-20 rounded-2xl border border-dashed border-border">
            <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground font-medium">Belum ada produk.</p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => {
                setQ("");
                setCat("all");
              }}
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {list.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i * 0.04, 0.3)}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function Pill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${active ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}
