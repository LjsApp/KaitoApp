import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, BadgeCheck, ShoppingBag, Store, Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { DbProduct } from "@/lib/queries";
import { useCompany } from "@/hooks/use-company";
import { LazyImage } from "@/components/ui/LazyImage";

export function ProductCard({ product }: { product: DbProduct }) {
  const { t } = useTranslation();
  const company = useCompany();
  const image = product.gallery?.[0] || "";
  const specs = product.specs || [];
  const s1 = specs[0],
    s2 = specs[1],
    s3 = specs[2];
  const shopee = product.shopee_url || company.shopee_url;
  const tokped = product.tokopedia_url || company.tokopedia_url;

  return (
    <article className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover-lift">
      <Link
        to="/produk/$slug"
        params={{ slug: product.slug }}
        aria-label={product.name}
        className="absolute inset-0 z-0"
      />
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-accent pointer-events-none">
        {image ? (
          <LazyImage
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            wrapperClassName="absolute inset-0"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground text-xs">
            Tanpa Gambar
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[calc(100%-1.5rem)]">
          {product.featured && (
            <span className="rounded-full bg-accent-orange text-accent-orange-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
              Unggulan
            </span>
          )}
          <span className="rounded-full bg-card/90 backdrop-blur px-2.5 py-1 text-[10px] font-semibold text-primary inline-flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> SNI
          </span>
          <span className="rounded-full bg-card/90 backdrop-blur px-2.5 py-1 text-[10px] font-semibold text-accent-orange inline-flex items-center gap-1">
            <BadgeCheck className="h-3 w-3" /> BERGARANSI
          </span>
        </div>
      </div>
      <div className="relative flex flex-1 flex-col p-5 pointer-events-none">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">{product.sku}</div>
        <h3 className="mt-1 font-display font-bold text-base line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {product.tagline || product.description}
        </p>
        {(s1 || s2 || s3) && (
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {s1 && <Spec label={s1.key} value={s1.value} />}
            {s2 && <Spec label={s2.key} value={s2.value} />}
            {s3 && <Spec label={s3.key} value={s3.value} />}
          </div>
        )}
        <div className="mt-5 flex items-center justify-between gap-2 pt-4 border-t border-border">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
            {t("cta.detail")} <ArrowRight className="h-4 w-4" />
          </span>
          <div className="pointer-events-auto relative z-10 flex items-center gap-1.5">
            {product.document_url && (
              <a
                href={product.document_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download Katalog"
                title="Download Katalog"
                onClick={(e) => e.stopPropagation()}
                className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <Download className="h-4 w-4" />
              </a>
            )}
            {shopee && (
              <a
                href={shopee}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Beli di Shopee"
                title="Official Store Shopee"
                onClick={(e) => e.stopPropagation()}
                className="grid h-8 w-8 place-items-center rounded-lg bg-[#EE4D2D]/10 text-[#EE4D2D] hover:bg-[#EE4D2D] hover:text-white transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
              </a>
            )}
            {tokped && (
              <a
                href={tokped}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Beli di Tokopedia"
                title="Official Store Tokopedia"
                onClick={(e) => e.stopPropagation()}
                className="grid h-8 w-8 place-items-center rounded-lg bg-[#03AC0E]/10 text-[#03AC0E] hover:bg-[#03AC0E] hover:text-white transition-colors"
              >
                <Store className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/60 py-1.5 px-1">
      <div className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">
        {label}
      </div>
      <div className="text-xs font-semibold tabular-nums truncate">{value}</div>
    </div>
  );
}
