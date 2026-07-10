import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/site/PageHero";
import { ProductCard } from "@/components/site/ProductCard";
import { qkCategories, qkProductsByCategory } from "@/lib/queries";
import { CardSkeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/kategori/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Kategori — Kaito Hiro` },
      { property: "og:url", content: `/kategori/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/kategori/${params.slug}` }],
  }),
  component: KategoriPage,
});

function KategoriPage() {
  const { slug } = Route.useParams();
  const { data: cats = [], isLoading: catsLoading } = useQuery(qkCategories());
  const { data: products = [], isLoading: productsLoading } = useQuery(qkProductsByCategory(slug));
  const category = cats.find((c) => c.slug === slug);

  if (!catsLoading && cats.length > 0 && !category) {
    return (
      <div className="py-20 text-center">
        Kategori tidak ditemukan.{" "}
        <Link to="/produk" className="text-primary underline">
          Lihat semua
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageHero
        title={category?.name ?? "Kategori"}
        subtitle={category?.description ?? ""}
        breadcrumb={[{ label: "Produk", to: "/produk" }, { label: category?.name ?? "" }]}
      />
      <section className="mx-auto max-w-7xl container-px py-12">
        {productsLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            Belum ada produk di kategori ini.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
