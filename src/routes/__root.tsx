import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { FloatingActions } from "@/components/site/FloatingActions";
import { Toaster } from "@/components/ui/sonner";
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[80dvh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="font-display text-[120px] leading-none font-extrabold text-gradient">404</div>
        <h2 className="mt-2 text-2xl font-display font-bold">Halaman tidak ditemukan</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <div className="mt-6 flex gap-2 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Ke Beranda
          </Link>
          <Link
            to="/produk"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent"
          >
            Lihat Produk
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Error Boundary]", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[80dvh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-display font-semibold tracking-tight">
          Halaman ini tidak dapat dimuat
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Terjadi kesalahan pada sistem. Silakan coba muat ulang atau kembali ke beranda.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Coba Lagi
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent"
          >
            Ke Beranda
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kaito Hiro (KTH) — Pompa Air Andal untuk Semua Kebutuhan" },
      {
        name: "description",
        content:
          "Kaito Hiro (KTH) — produsen pompa air premium ber-SNI, motor 100% kawat tembaga, garansi resmi 1 tahun ganti unit baru. 150+ distributor di seluruh Indonesia.",
      },
      { name: "author", content: "Kaito Hiro Indonesia" },
      { name: "theme-color", content: "#0F3D75" },
      { property: "og:site_name", content: "Kaito Hiro" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Kaito Hiro (KTH) — Pompa Air Premium" },
      { property: "og:description", content: "Pompa air andal ber-SNI dengan garansi resmi 1 tahun ganti unit baru." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@kaitohiro" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/jpeg", href: "/favicon.jpg" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Kaito Hiro",
          alternateName: "KTH",
          url: "/",
          logo: "/",
          description: "Produsen pompa air premium ber-SNI dengan jaringan 150+ distributor di Indonesia.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Jl. Industri Raya Blok C No. 12",
            addressLocality: "Cikarang",
            addressRegion: "Bekasi",
            postalCode: "17530",
            addressCountry: "ID",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+62-21-5000-1234",
            contactType: "customer service",
            areaServed: "ID",
            availableLanguage: ["Indonesian", "English"],
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <main className="flex-1 relative">
            <Outlet />
          </main>
          <SiteFooter />
          <FloatingActions />
          <Toaster position="top-right" richColors />
        </div>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
