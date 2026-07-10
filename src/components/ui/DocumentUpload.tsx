import { useRef, useState } from "react";
import { Upload, X, Loader2, FileText } from "lucide-react";
import { uploadDocument } from "@/lib/catalog.functions";
import { toast } from "sonner";

interface DocumentUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
}

export function DocumentUpload({
  value,
  onChange,
  folder = "documents",
  label = "Upload Dokumen",
  className,
}: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const allowed = ["pdf", "doc", "docx", "xls", "xlsx", "zip", "rar"];
    if (!allowed.includes(ext)) {
      toast.error(`Tipe file .${ext} tidak diizinkan`);
      return;
    }
    // Limit: 2 MB
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran dokumen maksimal 2 MB");
      return;
    }
    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const result = await uploadDocument({
        data: {
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
          base64,
          folder,
        },
      });

      // Hitung ukuran file untuk ditampilkan
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const sizeString =
        file.size < 1024 * 1024 ? Math.round(file.size / 1024) + " KB" : sizeMB + " MB";

      // Kembalikan URL dan juga fire custom event/callback jika perlu,
      // tapi kita akan pakai URL saja, dan biarkan form mendeteksi ukuran/tipe.
      onChange(result.url + "|||" + sizeString); // Hack sederhana untuk return size
    } catch (e) {
      toast.error("Gagal upload dokumen: " + (e instanceof Error ? e.message : "unknown"));
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // Parsing url dan size dari value
  const parts = value ? value.split("|||") : ["", ""];
  const docUrl = parts[0];

  return (
    <div className={className}>
      {label && <label className="text-xs font-semibold mb-1.5 block">{label}</label>}
      {value ? (
        <div className="relative rounded-xl border border-border bg-muted p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-primary/10 grid place-items-center text-primary shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">Dokumen Terunggah</div>
            <a
              href={docUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Lihat Dokumen
            </a>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="grid h-8 w-8 place-items-center rounded hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
            title="Hapus Dokumen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-border rounded-xl h-24 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-colors"
        >
          {loading ? (
            <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">
                Upload File (PDF/DOC/ZIP)
              </span>
              <span className="text-xs text-muted-foreground">Maks 2 MB</span>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
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
