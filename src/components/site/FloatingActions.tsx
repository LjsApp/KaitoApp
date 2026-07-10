import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={cn(
          "fixed bottom-6 right-6 z-40 grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition-all hover:scale-110",
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
        )}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  );
}

