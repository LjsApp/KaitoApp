import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Minus,
  Undo,
  Redo,
  Code,
  Quote,
  Code2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import { useEffect, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  className?: string;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  label = "Isi Artikel",
  className,
  placeholder = "Tulis isi artikel di sini... atau klik 'Mode HTML' untuk paste kode HTML langsung.",
}: RichTextEditorProps) {
  const [htmlMode, setHtmlMode] = useState(false);
  const [rawHtml, setRawHtml] = useState(value || "");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        // StarterKit v3 sudah include Link — cukup config di sini
        link: {
          openOnClick: false,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[320px] outline-none px-4 py-3 text-sm leading-relaxed prose prose-sm max-w-none focus:outline-none",
      },
    },
  });

  // Sync ketika value berubah dari luar (mis. saat edit artikel lain)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
      setRawHtml(value || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Saat masuk mode HTML, sync konten editor ke textarea
  const enterHtmlMode = () => {
    if (editor) setRawHtml(editor.getHTML());
    setHtmlMode(true);
  };

  // Saat keluar mode HTML, parse HTML ke editor
  const exitHtmlMode = () => {
    if (editor) {
      editor.commands.setContent(rawHtml, { emitUpdate: false });
      onChange(rawHtml);
    }
    setHtmlMode(false);
  };

  if (!editor) return null;

  const ToolbarBtn = ({
    onClick,
    active,
    title,
    children,
    danger,
  }: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
    danger?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`grid h-8 w-8 place-items-center rounded-md text-sm transition-colors ${
        danger
          ? "text-accent-orange hover:bg-accent-orange/10"
          : active
            ? "bg-primary text-white"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );

  const setLink = () => {
    const url = window.prompt("URL:", editor.getAttributes("link").href);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  return (
    <div className={className}>
      {label && <label className="text-xs font-semibold mb-1.5 block">{label}</label>}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-border px-3 py-2 bg-muted/40">
          {!htmlMode && (
            <>
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive("bold")}
                title="Bold (Ctrl+B)"
              >
                <Bold className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive("italic")}
                title="Italic (Ctrl+I)"
              >
                <Italic className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleCode().run()}
                active={editor.isActive("code")}
                title="Inline Code"
              >
                <Code className="h-4 w-4" />
              </ToolbarBtn>
              <div className="w-px h-5 bg-border mx-1" />
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                active={editor.isActive("heading", { level: 2 })}
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                active={editor.isActive("heading", { level: 3 })}
                title="Heading 3"
              >
                <Heading3 className="h-4 w-4" />
              </ToolbarBtn>
              <div className="w-px h-5 bg-border mx-1" />
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive("bulletList")}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editor.isActive("orderedList")}
                title="Ordered List"
              >
                <ListOrdered className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                active={editor.isActive("blockquote")}
                title="Blockquote"
              >
                <Quote className="h-4 w-4" />
              </ToolbarBtn>
              <div className="w-px h-5 bg-border mx-1" />
              <ToolbarBtn onClick={setLink} active={editor.isActive("link")} title="Tambah Link">
                <LinkIcon className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                active={false}
                title="Garis Pemisah"
              >
                <Minus className="h-4 w-4" />
              </ToolbarBtn>
              <div className="w-px h-5 bg-border mx-1" />
              {/* Text Alignment Buttons */}
              <ToolbarBtn
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                active={editor.isActive({ textAlign: "left" })}
                title="Rata Kiri"
              >
                <AlignLeft className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                active={editor.isActive({ textAlign: "center" })}
                title="Rata Tengah"
              >
                <AlignCenter className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                active={editor.isActive({ textAlign: "right" })}
                title="Rata Kanan"
              >
                <AlignRight className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                active={editor.isActive({ textAlign: "justify" })}
                title="Rata Kiri-Kanan (Justify)"
              >
                <AlignJustify className="h-4 w-4" />
              </ToolbarBtn>
              <div className="w-px h-5 bg-border mx-1" />
              <ToolbarBtn
                onClick={() => editor.chain().focus().undo().run()}
                active={false}
                title="Undo (Ctrl+Z)"
              >
                <Undo className="h-4 w-4" />
              </ToolbarBtn>
              <ToolbarBtn
                onClick={() => editor.chain().focus().redo().run()}
                active={false}
                title="Redo (Ctrl+Y)"
              >
                <Redo className="h-4 w-4" />
              </ToolbarBtn>
            </>
          )}

          {/* Mode HTML toggle */}
          <button
            type="button"
            onClick={htmlMode ? exitHtmlMode : enterHtmlMode}
            title={
              htmlMode
                ? "Kembali ke Visual Editor (apply HTML)"
                : "Mode HTML — paste atau edit HTML langsung"
            }
            className={`ml-auto inline-flex items-center gap-1.5 h-7 px-3 rounded-md text-xs font-semibold transition-colors ${
              htmlMode
                ? "bg-accent-orange text-white hover:bg-accent-orange/90"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground border border-border"
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            {htmlMode ? "✓ Terapkan HTML" : "Mode HTML"}
          </button>
        </div>

        {/* Editor Area */}
        {htmlMode ? (
          <div className="relative">
            <textarea
              value={rawHtml}
              onChange={(e) => setRawHtml(e.target.value)}
              className="w-full min-h-[320px] px-4 py-3 text-xs font-mono leading-relaxed bg-muted/20 text-foreground outline-none resize-y border-0 focus:outline-none"
              placeholder="Paste HTML di sini... contoh: <h2>Judul</h2><p>Paragraf</p>"
              spellCheck={false}
            />
            <div className="absolute top-2 right-2 text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono">
              HTML
            </div>
          </div>
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>

      {/* Helper text */}
      <p className="text-[11px] text-muted-foreground mt-1.5">
        {htmlMode
          ? 'Edit HTML langsung, lalu klik "Terapkan HTML" untuk melihat hasilnya di editor.'
          : 'Gunakan toolbar untuk format teks. Klik "Mode HTML" untuk paste HTML mentah.'}
      </p>
    </div>
  );
}
