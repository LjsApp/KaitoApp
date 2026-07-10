import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { useCompany } from "@/hooks/use-company";
import { qkCategories } from "@/lib/queries";

export function SiteFooter() {
  const company = useCompany();
  const { data: cats = [] } = useQuery({ ...qkCategories(), staleTime: 60_000 });
  return (
    <footer className="mt-24 border-t border-border bg-brand-bg text-brand-foreground">
      <div className="mx-auto max-w-7xl container-px py-14 grid gap-10 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center p-0.5 shadow-soft">
              <Logo className="h-full w-full" />
            </div>
            <div>
              <div className="font-display font-extrabold text-lg">
                {company.name || "Kaito Hiro"}
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] opacity-70">
                Pompa Air Premium
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-80 leading-relaxed">
            Kaito Hiro (KTH) menghadirkan rangkaian pompa submersible berkualitas tinggi yang
            dirancang untuk performa optimal dan ketahanan jangka panjang
          </p>
          <div className="mt-5 flex gap-2">
            {company.instagram && (
              <a
                href={company.instagram}
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 hover:bg-accent-orange transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {company.facebook && (
              <a
                href={company.facebook}
                aria-label="Facebook"
                className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 hover:bg-accent-orange transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {company.youtube && (
              <a
                href={company.youtube}
                aria-label="YouTube"
                className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 hover:bg-accent-orange transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 opacity-80">
            Produk
          </h4>
          <ul className="space-y-2.5 text-sm">
            {cats.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  to="/kategori/$slug"
                  params={{ slug: c.slug }}
                  className="opacity-80 hover:opacity-100 hover:text-accent-orange"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 opacity-80">
            Perusahaan
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/tentang" className="opacity-80 hover:opacity-100 hover:text-accent-orange">
                Tentang Kami
              </Link>
            </li>

            <li>
              <Link
                to="/download"
                className="opacity-80 hover:opacity-100 hover:text-accent-orange"
              >
                Download Center
              </Link>
            </li>
            <li>
              <Link to="/artikel" className="opacity-80 hover:opacity-100 hover:text-accent-orange">
                Artikel
              </Link>
            </li>
            <li>
              <Link to="/kontak" className="opacity-80 hover:opacity-100 hover:text-accent-orange">
                Kontak
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 opacity-80">
            Kontak
          </h4>
          <ul className="space-y-3 text-sm">
            {company.address && (
              <li className="flex gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 opacity-70" />
                <span className="opacity-80">{company.address}</span>
              </li>
            )}
            {company.phone && (
              <li className="flex gap-2.5">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 opacity-70" />
                <a href={`tel:${company.phone}`} className="opacity-80 hover:opacity-100">
                  {company.phone}
                </a>
              </li>
            )}
            {company.email && (
              <li className="flex gap-2.5">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 opacity-70" />
                <a href={`mailto:${company.email}`} className="opacity-80 hover:opacity-100">
                  {company.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl container-px py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs opacity-70">
          <div>© {new Date().getFullYear()} PT Kaito Hiro Indonesia. All rights reserved.</div>
          <div className="flex gap-4">
            <Link to="/kontak" className="hover:opacity-100">
              Privasi
            </Link>
            <Link to="/kontak" className="hover:opacity-100">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
