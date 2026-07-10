import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle, X } from "lucide-react";
import { useCompany } from "@/hooks/use-company";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const company = useCompany();
  const [show, setShow] = useState(false);
  const [cookieOk, setCookieOk] = useState(true);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    setCookieOk(localStorage.getItem("kth-cookie") === "1");
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const acceptCookie = () => {
    localStorage.setItem("kth-cookie", "1");
    setCookieOk(true);
  };

  return (
    <>
      <a
        href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent("Halo KTH, saya ingin bertanya tentang pompa air.")}`}
        target="_blank"
        rel="noopener"
        className="fixed bottom-6 right-6 z-40 group"
        aria-label="Chat WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-success/40 animate-ping" />
        <span className="relative grid h-14 w-14 place-items-center rounded-full bg-success text-white shadow-elegant hover:scale-110 transition-transform">
          <MessageCircle className="h-6 w-6" />
        </span>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground text-background px-3 py-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
          Chat dengan kami
        </span>
      </a>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={cn(
          "fixed bottom-24 right-6 z-40 grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition-all hover:scale-110",
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
        )}
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      {!cookieOk && (
        <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-40 glass rounded-2xl p-4 shadow-elegant">
          <div className="flex items-start gap-3">
            <div className="text-sm flex-1">
              <strong className="font-display">🍪 Cookie</strong>
              <p className="mt-1 text-muted-foreground">
                Kami menggunakan cookie untuk meningkatkan pengalaman Anda. Dengan terus menggunakan situs ini, Anda menyetujui penggunaannya.
              </p>
            </div>
            <button onClick={acceptCookie} aria-label="Tutup" className="rounded-md p-1 hover:bg-accent">
              <X className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={acceptCookie}
            className="mt-3 w-full rounded-lg bg-primary text-primary-foreground py-2 text-sm font-medium hover:opacity-90"
          >
            Saya Setuju
          </button>
        </div>
      )}
    </>
  );
}
