import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex items-center gap-1.5 text-muted-foreground flex-wrap">
        <li>
          <Link to="/" className="hover:text-primary inline-flex items-center gap-1">
            <Home className="h-3.5 w-3.5" />
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            {item.to && i < items.length - 1 ? (
              <Link to={item.to} className="hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  title,
  subtitle,
  breadcrumb,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; to?: string }[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent-orange/5">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent-orange/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl container-px py-14 lg:py-20">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        <h1 className="mt-4 font-display font-extrabold text-3xl md:text-5xl tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
