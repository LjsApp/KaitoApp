import { useNavigate } from "@tanstack/react-router";
import { Package, FileText } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { qkProducts, qkArticles } from "@/lib/queries";

export function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const { data: products = [] } = useQuery(qkProducts());
  const { data: articles = [] } = useQuery(qkArticles());

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Cari pompa, artikel, atau panduan..." />
      <CommandList>
        <CommandEmpty>Tidak ada hasil ditemukan.</CommandEmpty>
        
        <CommandGroup heading="Produk">
          {products.map((product) => (
            <CommandItem
              key={`prod-${product.slug}`}
              value={product.name + " " + product.sku}
              onSelect={() => runCommand(() => navigate({ to: `/produk/${product.slug}` }))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Package className="h-4 w-4 text-primary" />
              <span>{product.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Artikel & Panduan">
          {articles.map((article) => (
            <CommandItem
              key={`art-${article.slug}`}
              value={article.title}
              onSelect={() => runCommand(() => navigate({ to: `/artikel/${article.slug}` }))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FileText className="h-4 w-4 text-accent-orange" />
              <span>{article.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
