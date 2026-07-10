import { createServerFn } from "@tanstack/react-start";

// ============ CATEGORIES ============
export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  sort_order: number;
};

export const upsertCategory = createServerFn({ method: "POST" })
  .validator((d: Partial<Category> & { name: string; slug: string }) => d)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload: Record<string, unknown> = { ...data };
    const { error } = data.id
      ? await supabaseAdmin
          .from("categories" as never)
          .update(payload as never)
          .eq("id", data.id)
      : await supabaseAdmin.from("categories" as never).insert(payload as never);
    if (error) throw error;
    return { ok: true };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("categories" as never)
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ============ FEATURES ============
export const upsertFeature = createServerFn({ method: "POST" })
  .validator((d: { id?: string; name: string }) => d)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = data.id
      ? await supabaseAdmin
          .from("features" as never)
          .update({ name: data.name } as never)
          .eq("id", data.id)
      : await supabaseAdmin.from("features" as never).insert({ name: data.name } as never);
    if (error) throw error;
    return { ok: true };
  });

export const deleteFeature = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("features" as never)
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ============ PRODUCTS ============
export type ProductSpec = { key: string; value: string };
export type ProductInput = {
  id?: string;
  slug: string;
  sku: string;
  name: string;
  category_id: string | null;
  tagline: string;
  description: string;
  gallery: string[];
  specs: ProductSpec[];
  shopee_url: string;
  tokopedia_url: string;
  featured: boolean;
  feature_ids: string[];
  document_url?: string;
};

export const upsertProduct = createServerFn({ method: "POST" })
  .validator((d: ProductInput) => d)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { feature_ids, id, ...rest } = data;
    const payload = { ...rest } as Record<string, unknown>;
    let productId = id;
    if (id) {
      const { error } = await supabaseAdmin
        .from("products" as never)
        .update(payload as never)
        .eq("id", id);
      if (error) throw error;
    } else {
      const { data: ins, error } = await supabaseAdmin
        .from("products" as never)
        .insert(payload as never)
        .select("id")
        .single();
      if (error) throw error;
      productId = (ins as { id: string }).id;
    }
    // reset relations
    await supabaseAdmin
      .from("product_features" as never)
      .delete()
      .eq("product_id", productId!);
    if (feature_ids.length) {
      const rows = feature_ids.map((fid) => ({ product_id: productId, feature_id: fid }));
      const { error } = await supabaseAdmin.from("product_features" as never).insert(rows as never);
      if (error) throw error;
    }
    return { ok: true, id: productId };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("products" as never)
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ============ ARTICLES ============
export type ArticleInput = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_url: string;
  content: string;
  published_at?: string;
};

export const upsertArticle = createServerFn({ method: "POST" })
  .validator((d: ArticleInput) => d)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...rest } = data;
    const payload = { ...rest } as Record<string, unknown>;
    const { error } = id
      ? await supabaseAdmin
          .from("articles" as never)
          .update(payload as never)
          .eq("id", id)
      : await supabaseAdmin.from("articles" as never).insert(payload as never);
    if (error) throw error;
    return { ok: true };
  });

export const deleteArticle = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("articles" as never)
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ============ MESSAGES ============
export const markMessage = createServerFn({ method: "POST" })
  .validator((d: { id: string; read: boolean }) => d)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("contact_messages" as never)
      .update({ read: data.read } as never)
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const deleteMessage = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("contact_messages" as never)
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ============ DOWNLOADS ============
export type DownloadInput = {
  id?: string;
  title: string;
  type: string;
  file_url: string;
  size: string;
};

export const upsertDownload = createServerFn({ method: "POST" })
  .validator((d: DownloadInput) => d)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...rest } = data;
    const payload = { ...rest } as Record<string, unknown>;
    const { error } = id
      ? await supabaseAdmin
          .from("downloads" as never)
          .update(payload as never)
          .eq("id", id)
      : await supabaseAdmin.from("downloads" as never).insert(payload as never);
    if (error) throw error;
    return { ok: true };
  });

export const deleteDownload = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("downloads" as never)
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ============ UPLOAD ============
const ALLOWED_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"]);
const ALLOWED_IMAGE_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);
const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const uploadImage = createServerFn({ method: "POST" })
  .validator((d: { fileName: string; contentType: string; base64: string; folder?: string }) => d)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();

    // ── Validasi tipe file ────────────────────────────────────────────────────
    const ext = (data.fileName.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
      throw new Error(`Tipe file tidak diizinkan: .${ext}. Hanya gambar yang boleh diupload.`);
    }
    if (!ALLOWED_IMAGE_CONTENT_TYPES.has(data.contentType)) {
      throw new Error(`Content-type tidak diizinkan: ${data.contentType}`);
    }

    // ── Validasi ukuran ───────────────────────────────────────────────────────
    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    if (bytes.length > MAX_UPLOAD_SIZE_BYTES) {
      throw new Error("Ukuran file melebihi batas 10 MB");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const path = `${data.folder || "misc"}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabaseAdmin.storage.from("public-media").upload(path, bytes, {
      contentType: data.contentType,
      upsert: false,
    });
    if (error) throw error;
    // 10 years
    const { data: signed, error: sErr } = await supabaseAdmin.storage
      .from("public-media")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    if (sErr) throw sErr;
    return { url: signed.signedUrl, path };
  });

export const uploadDocument = createServerFn({ method: "POST" })
  .validator((d: { fileName: string; contentType: string; base64: string; folder?: string }) => d)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();

    const allowedExts = new Set(["pdf", "doc", "docx", "xls", "xlsx", "zip", "rar"]);
    const ext = (data.fileName.split(".").pop() || "").toLowerCase();

    if (!allowedExts.has(ext)) {
      throw new Error(
        `Tipe file tidak diizinkan: .${ext}. Hanya file dokumen/arsip (pdf, docx, zip, dll) yang boleh diupload.`,
      );
    }

    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    // Limit: 2 MB
    if (bytes.length > 2 * 1024 * 1024) {
      throw new Error("Ukuran file melebihi batas 2 MB");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const path = `${data.folder || "documents"}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabaseAdmin.storage.from("public-media").upload(path, bytes, {
      contentType: data.contentType,
      upsert: false,
    });
    if (error) throw error;
    const { data: signed, error: sErr } = await supabaseAdmin.storage
      .from("public-media")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    if (sErr) throw sErr;
    return { url: signed.signedUrl, path };
  });
