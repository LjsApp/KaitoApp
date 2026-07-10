import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, Sun, Search, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { qkCategories } from "@/lib/queries";
import { useCompany } from "@/hooks/use-company";
import { Logo } from "@/components/site/Logo";
import { GlobalSearch } from "@/components/site/GlobalSearch";

type NavItem = { to: string; label: string; mega?: boolean };
const NAV: NavItem[] = [
  { to: "/", label: "Beranda" },
  { to: "/produk", label: "Produk", mega: true },
  { to: "/tentang", label: "Tentang" },
  { to: "/artikel", label: "Artikel" },
  { to: "/kontak", label: "Kontak" },
];

export function SiteHeader() {
  const company = useCompany();
  const { data: cats = [] } = useQuery({ ...qkCategories(), staleTime: 60_000 });
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("kth-theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("kth-theme", next ? "dark" : "light");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass shadow-soft" : "bg-background/0",
      )}
    >
      {/* Top utility bar */}
      <div className="block border-b border-border/40 bg-brand-bg text-brand-foreground text-[10px] sm:text-xs">
        <div className="mx-auto max-w-7xl container-px flex h-9 items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3 w-3 hidden sm:block" /> {company.phone || "+62 21 5000 1234"}
            </span>
            <span className="opacity-70 hidden sm:inline">
              {company.working_hours || "Senin–Sabtu, 08.00–17.00 WIB"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/download" className="hover:underline">
              Download Center
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl container-px">
        <div className="flex h-16 lg:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <Logo className="h-12 w-12" />
            <div className="flex flex-col leading-none">
              <span className="font-display font-extrabold text-base lg:text-lg tracking-tight">
                {company.name || "Kaito Hiro"}
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Pompa Air Premium
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
              if (item.mega) {
                return (
                  <div
                    key={item.to}
                    className="relative"
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                  >
                    <Link
                      to={item.to}
                      className={cn(
                        "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        active ? "text-primary" : "hover:text-primary",
                      )}
                    >
                      {item.label}
                    </Link>
                    {megaOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[640px]">
                        <div className="glass rounded-2xl p-6 shadow-elegant grid grid-cols-2 gap-2">
                          {cats.map((c) => (
                            <Link
                              key={c.slug}
                              to="/kategori/$slug"
                              params={{ slug: c.slug }}
                              className="group flex items-start gap-3 rounded-lg p-3 hover:bg-accent/60 transition-colors"
                              onClick={() => setMegaOpen(false)}
                            >
                              <div className="h-10 w-10 rounded-lg bg-gradient-primary/10 grid place-items-center text-primary shrink-0 overflow-hidden">
                                {c.image_url ? (
                                  <img
                                    src={c.image_url}
                                    alt={c.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <circle cx="12" cy="12" r="9" />
                                  </svg>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-sm group-hover:text-primary">
                                  {c.name}
                                </div>
                                <div className="text-xs text-muted-foreground line-clamp-1">
                                  {c.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    active ? "text-primary" : "hover:text-primary",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Toggle theme">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <a
              href={`https://wa.me/${company.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex"
            >
              <Button className="bg-gradient-warm text-accent-orange-foreground hover:opacity-90 shadow-soft">
                Hubungi Kami
              </Button>
            </a>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[88vw] max-w-sm">
                <div className="mt-8 flex flex-col gap-1">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-muted-foreground mb-4"
                    onClick={() => {
                      setMobileOpen(false);
                      setSearchOpen(true);
                    }}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Cari produk atau artikel...
                  </Button>
                  {NAV.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="px-3 py-3 rounded-md hover:bg-accent font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    to="/download"
                    className="px-3 py-3 rounded-md hover:bg-accent font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    Download Center
                  </Link>
                  <a
                    href={`https://wa.me/${company.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4"
                  >
                    <Button
                      className="w-full bg-gradient-warm text-accent-orange-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      Hubungi Kami
                    </Button>
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
