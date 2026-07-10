import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

// Skeleton khusus untuk Card Produk / Artikel
export function CardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
      <Skeleton className="w-full aspect-[4/3] rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

// Skeleton untuk list baris (mis. download center)
export function ListRowSkeleton() {
  return (
    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-xl border border-border bg-card">
      <div className="flex items-start gap-3 sm:gap-4 flex-1">
        <Skeleton className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
      <Skeleton className="h-8 w-full sm:w-24 rounded-md shrink-0" />
    </div>
  );
}
