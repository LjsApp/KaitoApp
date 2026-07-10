import { PRODUCTS, type Product } from "@/data/products";
import { ARTICLES } from "@/data/content";

export type Article = (typeof ARTICLES)[number];
export type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read?: boolean;
};

const K = {
  products: "kth-admin-products",
  articles: "kth-admin-articles",
  messages: "kth-admin-messages",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("kth-admin-change", { detail: { key } }));
}

// Products
export const productStore = {
  all: (): Product[] => read<Product[]>(K.products, PRODUCTS),
  get: (slug: string) => productStore.all().find((p) => p.slug === slug),
  upsert: (p: Product) => {
    const list = productStore.all();
    const idx = list.findIndex((x) => x.slug === p.slug);
    if (idx >= 0) list[idx] = p;
    else list.unshift(p);
    write(K.products, list);
  },
  remove: (slug: string) =>
    write(
      K.products,
      productStore.all().filter((p) => p.slug !== slug),
    ),
  reset: () => write(K.products, PRODUCTS),
};

// Articles
export const articleStore = {
  all: (): Article[] => read<Article[]>(K.articles, ARTICLES as Article[]),
  get: (slug: string) => articleStore.all().find((a) => a.slug === slug),
  upsert: (a: Article) => {
    const list = articleStore.all();
    const idx = list.findIndex((x) => x.slug === a.slug);
    if (idx >= 0) list[idx] = a;
    else list.unshift(a);
    write(K.articles, list);
  },
  remove: (slug: string) =>
    write(
      K.articles,
      articleStore.all().filter((a) => a.slug !== slug),
    ),
  reset: () => write(K.articles, ARTICLES as Article[]),
};

// Contact messages
export const messageStore = {
  all: (): ContactMessage[] => read<ContactMessage[]>(K.messages, []),
  add: (m: Omit<ContactMessage, "id" | "createdAt" | "read">) => {
    const msg: ContactMessage = {
      ...m,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    write(K.messages, [msg, ...messageStore.all()]);
    return msg;
  },
  update: (id: string, patch: Partial<ContactMessage>) => {
    write(
      K.messages,
      messageStore.all().map((m) => (m.id === id ? { ...m, ...patch } : m)),
    );
  },
  remove: (id: string) =>
    write(
      K.messages,
      messageStore.all().filter((m) => m.id !== id),
    ),
};

import { useEffect, useState } from "react";
export function useAdminVersion() {
  const [, setV] = useState(0);
  useEffect(() => {
    const h = () => setV((v) => v + 1);
    window.addEventListener("kth-admin-change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("kth-admin-change", h);
      window.removeEventListener("storage", h);
    };
  }, []);
}
