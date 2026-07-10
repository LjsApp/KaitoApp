import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, FileText, Search } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { qkDownloads } from "@/lib/queries";
import { Reveal } from "@/components/site/Reveal";
import { ListRowSkeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Download Center — Kaito Hiro" },
      { name: "description", content: "Unduh brosur, manual book, datasheet, katalog, dan sertifikat resmi pompa air KTH." },
      { property: "og:url", content: "/download" },
    ],
    links: [{ rel: "canonical", href: "/download" }],
  }),
  component: DownloadPage,
});

function DownloadPage() {
  const { data: downloads = [], isLoading } = useQuery(qkDownloads());
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  
  // Ambil tipe/kategori unik dari database
  const types = ["all", ...Array.from(new Set(downloads.map((d) => d.type)))];
  
  const list = downloads.filter((d) =>
    (type === "all" || d.type === type) &&
    (!q || d.title.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <>
      <PageHero
        title="Download Center"
        subtitle="Semua dokumen produk Kaito Hiro dalam satu tempat."
        breadcrumb={[{ label: "Download" }]}
      />
      <section className="mx-auto max-w-5xl container-px py-6 md:py-8">
        <div className="rounded-2xl border border-border bg-card p-4 md:p-5 shadow-soft">
          <div className="grid md:grid-cols-[1fr_auto] gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari dokumen..." className="pl-9" />
            </div>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${type === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
                >
                  {t === "all" ? "Semua" : t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <ListRowSkeleton key={i} />)
          ) : list.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">Belum ada dokumen yang sesuai.</div>
          ) : (
            list.map((d, i) => (
              <Reveal key={d.id} delay={Math.min(i * 0.05, 0.4)}>
                <Card
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover-lift"
                >
              <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] sm:text-xs text-primary font-semibold uppercase tracking-wider">
                    {d.type}
                  </div>
                  <div className="font-display font-bold text-sm sm:text-base break-words">
                    {d.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{d.size || "Unknown size"}</div>
                </div>
              </div>
              <a href={d.file_url} target="_blank" rel="noreferrer" download className="sm:shrink-0">
                <Button size="sm" className="w-full sm:w-auto bg-primary text-primary-foreground">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </a>
            </Card>
            </Reveal>
          ))
        )}
        </div>
      </section>
    </>
  );
}
