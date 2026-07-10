import { useRef, useState } from "react";
import { Upload, X, GripVertical, Loader2, ImagePlus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { uploadImage } from "@/lib/catalog.functions";
import { toast } from "sonner";

interface GalleryUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
}

interface SortableImageProps {
  url: string;
  index: number;
  onRemove: () => void;
}

function SortableImage({ url, index, onRemove }: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: url });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-xl overflow-hidden border-2 border-border bg-muted w-32 h-32 shrink-0"
    >
      {index === 0 && (
        <span className="absolute top-1 left-1 z-10 rounded-md bg-accent-orange text-white text-[9px] font-bold px-1.5 py-0.5 uppercase">
          Utama
        </span>
      )}
      <img src={url} alt={`gallery-${index}`} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        type="button"
        className="absolute bottom-1 left-1 grid h-6 w-6 place-items-center rounded-md bg-black/50 text-white opacity-0 group-hover:opacity-100 transition cursor-grab"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

export function GalleryUpload({ value, onChange, folder = "products" }: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const fileArr = Array.from(files);
    
    const invalidFormat = fileArr.filter((f) => !f.type.startsWith("image/"));
    if (invalidFormat.length) {
      toast.error("Format file harus berupa gambar");
      return;
    }

    const totalSize = fileArr.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 3 * 1024 * 1024) {
      toast.error("Total file yang diupload tidak boleh lebih dari 3 MB");
      return;
    }

    setLoading(true);
    try {
      const results = await Promise.all(
        fileArr.map((file) =>
          fileToBase64(file).then((base64) =>
            uploadImage({ data: { fileName: file.name, contentType: file.type, base64, folder } })
          )
        )
      );
      onChange([...value, ...results.map((r) => r.url)]);
    } catch (e) {
      toast.error("Gagal upload: " + (e instanceof Error ? e.message : "unknown"));
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = value.indexOf(active.id as string);
      const newIdx = value.indexOf(over.id as string);
      onChange(arrayMove(value, oldIdx, newIdx));
    }
  };

  const remove = (url: string) => onChange(value.filter((u) => u !== url));

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold block">
        Galeri Produk{" "}
        <span className="text-muted-foreground font-normal">(gambar pertama = thumbnail utama)</span>
      </label>

      {/* Sortable gallery */}
      {value.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={value} strategy={horizontalListSortingStrategy}>
            <div className="flex gap-3 flex-wrap">
              {value.map((url, idx) => (
                <SortableImage key={url} url={url} index={idx} onRemove={() => remove(url)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Upload area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-colors"
      >
        {loading ? (
          <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
        ) : (
          <>
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Tambah gambar (bisa banyak sekaligus)</span>
            <span className="text-xs text-muted-foreground">PNG, JPG, WEBP · Total maksimal 3 MB</span>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
      />
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
