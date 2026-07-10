import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
// TODO: replace with project URL once a project name or custom domain is set.
const BASE_URL = "https://kaitohiro.co.id";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const [{ data: categories }, { data: products }, { data: articles }] = await Promise.all([
          supabaseAdmin.from("categories").select("slug"),
          supabaseAdmin.from("products").select("slug"),
          supabaseAdmin.from("articles").select("slug"),
        ]);

        const entries: { path: string; changefreq?: string; priority?: string }[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/produk", changefreq: "weekly", priority: "0.9" },
          { path: "/tentang", changefreq: "monthly", priority: "0.7" },

          { path: "/download", changefreq: "monthly", priority: "0.6" },
          { path: "/artikel", changefreq: "weekly", priority: "0.7" },
          { path: "/kontak", changefreq: "monthly", priority: "0.6" },
        ];

        if (categories) {
          for (const c of categories)
            entries.push({ path: `/kategori/${c.slug}`, changefreq: "weekly", priority: "0.7" });
        }
        if (products) {
          for (const p of products)
            entries.push({ path: `/produk/${p.slug}`, changefreq: "weekly", priority: "0.8" });
        }
        if (articles) {
          for (const a of articles)
            entries.push({ path: `/artikel/${a.slug}`, changefreq: "monthly", priority: "0.6" });
        }

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map(
            (e) =>
              `  <url><loc>${BASE_URL}${e.path}</loc>${e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : ""}${e.priority ? `<priority>${e.priority}</priority>` : ""}</url>`,
          ),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
