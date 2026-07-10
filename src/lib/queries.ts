// Client-side data helpers for public pages (RLS SELECT is public on these tables).
import { supabase } from "@/integrations/supabase/client";
import { queryOptions } from "@tanstack/react-query";

export type DbCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  sort_order: number;
};

export type DbProduct = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category_id: string | null;
  tagline: string;
  description: string;
  gallery: string[];
  specs: { key: string; value: string }[];
  shopee_url: string;
  tokopedia_url: string;
  featured: boolean;
  document_url: string;
  category?: DbCategory | null;
  features?: { id: string; name: string }[];
};

export type DbArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_url: string;
  content: string;
  author: string;
  published_at: string;
};

export type DbDownload = {
  id: string;
  title: string;
  type: string;
  file_url: string;
  size: string;
  created_at: string;
};

export type DbCompany = {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  address: string;
  map_embed: string;
  shopee_url: string;
  tokopedia_url: string;
  working_hours: string;
};

export type DbFeature = { id: string; name: string };

import fallbackData from "@/lib/fallback-data.json";

const PRODUCT_SELECT = "*, category:categories(*), product_features(feature:features(id,name))";

function mapProducts(rows: unknown): DbProduct[] {
  if (!rows) return [];
  return (rows as (DbProduct & { product_features?: { feature: DbFeature }[] })[]).map((p) => ({
    ...p,
    features: (p.product_features || []).map((pf) => pf.feature).filter(Boolean),
  }));
}

async function safeFetch<T>(
  promise: PromiseLike<{ data: unknown; error: { message: string; code?: string } | null }>,
  label: string,
  fallbackKey?: keyof typeof fallbackData
): Promise<T> {
  try {
    let timerId: ReturnType<typeof setTimeout>;
    // Race antara request Supabase dan timeout 8 detik
    // Mencegah hang saat database paused (Supabase free-tier)
    const timeout = new Promise<never>((_, reject) => {
      timerId = setTimeout(() => reject(new Error(`[Timeout] Supabase fetch "${label}" exceeded 8s`)), 8000);
    });
    const res = await Promise.race([promise, timeout]) as { data: unknown; error: { message: string; code?: string } | null };
    clearTimeout(timerId!);
    if (res.error) {
      console.warn(`[Supabase API Error: ${label}]`, res.error);
      throw new Error(res.error.message);
    }
    return res.data as T;
  } catch (err) {
    console.warn(`[Fallback] Using static JSON for ${label} due to error:`, err);
    if (fallbackKey && fallbackData && fallbackData[fallbackKey]) {
      return fallbackData[fallbackKey] as T;
    }
    throw err;
  }
}

export const listCategories = async (): Promise<DbCategory[]> =>
  safeFetch<DbCategory[]>(supabase.from("categories" as never).select("*").order("sort_order").order("name"), "categories", "categories");

export const listFeatures = async (): Promise<DbFeature[]> =>
  safeFetch<DbFeature[]>(supabase.from("features" as never).select("id,name").order("name"), "features");

export const listProducts = async (): Promise<DbProduct[]> =>
  mapProducts(await safeFetch(supabase.from("products" as never).select(PRODUCT_SELECT).order("created_at", { ascending: false }), "products", "products"));

export const listFeaturedProducts = async (): Promise<DbProduct[]> => {
  try {
    return mapProducts(await safeFetch(supabase.from("products" as never).select(PRODUCT_SELECT).eq("featured", true).limit(6), "products.featured", "products"));
  } catch (err) {
    // Jika fallback, kita filter manual
    const all = fallbackData.products || [];
    return mapProducts(all.filter((p: any) => p.featured).slice(0, 6));
  }
};

export const listProductsByCategory = async (slug: string): Promise<DbProduct[]> => {
  const cats = await listCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) return [];
  try {
    return mapProducts(await safeFetch(supabase.from("products" as never).select(PRODUCT_SELECT).eq("category_id", cat.id), "products.byCategory", "products"));
  } catch (err) {
    const all = fallbackData.products || [];
    return mapProducts(all.filter((p: any) => p.category_id === cat.id));
  }
};

export const getProductBySlug = async (slug: string): Promise<DbProduct | null> => {
  try {
    const promise = supabase.from("products" as never).select(PRODUCT_SELECT).eq("slug", slug).maybeSingle();
    const data = await safeFetch<unknown>(promise, "product");
    if (!data) return null;
    return mapProducts([data])[0];
  } catch (err) {
    const all = fallbackData.products || [];
    const found = all.find((p: any) => p.slug === slug);
    return found ? mapProducts([found])[0] : null;
  }
};

export const listArticles = async (): Promise<DbArticle[]> =>
  safeFetch<DbArticle[]>(supabase.from("articles" as never).select("*").order("published_at", { ascending: false }), "articles", "articles");

export const getArticleBySlug = async (slug: string): Promise<DbArticle | null> => {
  try {
    const promise = supabase.from("articles" as never).select("*").eq("slug", slug).maybeSingle();
    return await safeFetch<DbArticle | null>(promise, "article");
  } catch (err) {
    const all = fallbackData.articles || [];
    return (all.find((a: any) => a.slug === slug) as DbArticle) || null;
  }
};

export const listDownloads = async (): Promise<DbDownload[]> =>
  safeFetch<DbDownload[]>(supabase.from("downloads" as never).select("*").order("created_at", { ascending: false }), "downloads", "downloads");

const COMPANY_CLIENT_COLUMNS = "id,name,phone,whatsapp,email,instagram,facebook,youtube,tiktok,address,map_embed,shopee_url,tokopedia_url,working_hours";

export const getCompanyClient = async (): Promise<DbCompany> => {
  // Pilih kolom spesifik — JANGAN SELECT * (menghindari admin_username/admin_password_hash)
  const promise = supabase.from("company_settings" as never).select(COMPANY_CLIENT_COLUMNS as never).eq("id", 1).maybeSingle();
  const data = await safeFetch<DbCompany | null>(promise, "company");
  return data ?? ({
    name: "Kaito Hiro", phone: "", whatsapp: "", email: "", instagram: "", facebook: "",
    youtube: "", tiktok: "", address: "", map_embed: "", shopee_url: "", tokopedia_url: "", working_hours: "",
  });
};

export const submitMessage = async (m: { name: string; phone?: string; email?: string; subject?: string; message: string }) => {
  const res = await supabase.from("contact_messages" as never).insert({
    name: m.name, phone: m.phone || "", email: m.email || "", subject: m.subject || "", message: m.message,
  } as never);
  if (res.error) throw new Error(res.error.message);
};

// contact_messages SELECT hanya boleh via listMessagesAdmin() server function (service_role)
// Jangan tambahkan listMessages di sini — anon tidak punya SELECT policy

// Query options — retry 1x saja dengan delay singkat agar fallback cepat tampil
const BASE_QUERY_OPTIONS = { retry: 1, retryDelay: 500, staleTime: 1000 * 60 * 5 };

export const qkCategories = () => queryOptions({ ...BASE_QUERY_OPTIONS, queryKey: ["categories"], queryFn: listCategories });
export const qkFeatures = () => queryOptions({ ...BASE_QUERY_OPTIONS, queryKey: ["features"], queryFn: listFeatures });
export const qkProducts = () => queryOptions({ ...BASE_QUERY_OPTIONS, queryKey: ["products"], queryFn: listProducts });
export const qkFeaturedProducts = () => queryOptions({ ...BASE_QUERY_OPTIONS, queryKey: ["products", "featured"], queryFn: listFeaturedProducts });
export const qkProductsByCategory = (slug: string) => queryOptions({ ...BASE_QUERY_OPTIONS, queryKey: ["products", "cat", slug], queryFn: () => listProductsByCategory(slug) });
export const qkProduct = (slug: string) => queryOptions({ ...BASE_QUERY_OPTIONS, queryKey: ["product", slug], queryFn: () => getProductBySlug(slug) });
export const qkArticles = () => queryOptions({ ...BASE_QUERY_OPTIONS, queryKey: ["articles"], queryFn: listArticles });
export const qkArticle = (slug: string) => queryOptions({ ...BASE_QUERY_OPTIONS, queryKey: ["article", slug], queryFn: () => getArticleBySlug(slug) });
export const qkDownloads = () => queryOptions({ ...BASE_QUERY_OPTIONS, queryKey: ["downloads"], queryFn: listDownloads });
export const qkCompany = () => queryOptions({ ...BASE_QUERY_OPTIONS, queryKey: ["company"], queryFn: getCompanyClient });
