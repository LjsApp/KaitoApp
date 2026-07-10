import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
}

export function LazyImage({ src, alt, className, wrapperClassName, ...props }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Reset state jika src berubah
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden bg-muted w-full h-full", wrapperClassName)}>
      {/* Skeleton / Placeholder yang terlihat sebelum gambar dimuat */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-muted-foreground/10" />
      )}
      
      {/* Fallback jika error memuat gambar */}
      {error && (
        <div className="absolute inset-0 grid place-items-center bg-muted text-xs text-muted-foreground">
          Gambar Gagal
        </div>
      )}

      {src && (
        <img
          src={src}
          alt={alt || "Gambar Kaito Hiro"}
          loading="lazy" // Native browser lazy loading
          decoding="async" // Decode asynchronously to prevent UI freeze
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setIsLoaded(true);
            setError(true);
          }}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          {...props}
        />
      )}
    </div>
  );
}
