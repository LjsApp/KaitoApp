import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/catalog.functions";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
  maxSizeMB?: number;
}

export function ImageUpload({ value, onChange, folder = "misc", label = "Upload Foto", className, maxSizeMB = 5 }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Hanya file gambar yang diperbolehkan");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Ukuran gambar maksimal ${maxSizeMB} MB`);
      return;
    }
    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const result = await uploadImage({ data: { fileName: file.name, contentType: file.type, base64, folder } });
      onChange(result.url);
    } catch (e) {
      toast.error("Gagal upload gambar: " + (e instanceof Error ? e.message : "unknown"));
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className={className}>
      {label && <label className="text-xs font-semibold mb-1.5 block">{label}</label>}
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-border bg-muted">
          <img src={value} alt="preview" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-destructive text-white hover:opacity-80 transition"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-border rounded-xl h-48 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-colors"
        >
          {loading ? (
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Klik atau seret gambar ke sini</span>
              <span className="text-xs text-muted-foreground">PNG, JPG, WEBP · Maks {maxSizeMB} MB</span>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
