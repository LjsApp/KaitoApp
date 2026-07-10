import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const id = {
  nav: {
    home: "Beranda",
    products: "Produk",
    categories: "Kategori",
    about: "Tentang",
    warranty: "Garansi",
    downloads: "Download",
    distributors: "Distributor",
    agents: "Agen",
    articles: "Artikel",
    contact: "Kontak",
  },
  cta: {
    seeProducts: "Lihat Produk",
    contactDistributor: "Hubungi Distributor",
    contactUs: "Hubungi Kami",
    downloadBrochure: "Download Brosur",
    downloadManual: "Download Manual",
    downloadDatasheet: "Download Datasheet",
    learnMore: "Pelajari Selengkapnya",
    viewAll: "Lihat Semua",
    quickView: "Tampilan Cepat",
    compare: "Bandingkan",
    detail: "Detail Produk",
    chatWA: "Chat WhatsApp",
  },
  common: {
    search: "Cari...",
    filter: "Filter",
    sort: "Urutkan",
    category: "Kategori",
    power: "Daya",
    head: "Head",
    flow: "Debit",
    application: "Aplikasi",
    newest: "Terbaru",
    popular: "Terpopuler",
    price: "Harga",
    capacity: "Kapasitas",
    all: "Semua",
    province: "Provinsi",
    city: "Kota",
    notFound: "Tidak ada hasil ditemukan",
    loading: "Memuat...",
  },
  hero: {
    badge: "10 Tahun Dipercaya Ribuan Pelanggan",
    title: "Pompa Air Andal untuk Semua Kebutuhan",
    sub: "Kaito Hiro (KTH) menghadirkan rangkaian pompa submersible berkualitas tinggi yang dirancang untuk performa optimal dan ketahanan jangka panjang.",
  },
};

const en = {
  nav: {
    home: "Home",
    products: "Products",
    categories: "Categories",
    about: "About",
    warranty: "Warranty",
    downloads: "Downloads",
    distributors: "Distributors",
    agents: "Agents",
    articles: "Articles",
    contact: "Contact",
  },
  cta: {
    seeProducts: "View Products",
    contactDistributor: "Find Distributor",
    contactUs: "Contact Us",
    downloadBrochure: "Download Brochure",
    downloadManual: "Download Manual",
    downloadDatasheet: "Download Datasheet",
    learnMore: "Learn More",
    viewAll: "View All",
    quickView: "Quick View",
    compare: "Compare",
    detail: "Product Detail",
    chatWA: "Chat on WhatsApp",
  },
  common: {
    search: "Search...",
    filter: "Filter",
    sort: "Sort by",
    category: "Category",
    power: "Power",
    head: "Head",
    flow: "Flow",
    application: "Application",
    newest: "Newest",
    popular: "Popular",
    price: "Price",
    capacity: "Capacity",
    all: "All",
    province: "Province",
    city: "City",
    notFound: "No results found",
    loading: "Loading...",
  },
  hero: {
    badge: "10 Years Trusted by Thousands of Customers",
    title: "Reliable Water Pumps for Every Need",
    sub: "Kaito Hiro (KTH) delivers high-quality water pumps with 100% copper motor windings, brass hangers, and an official unit-replacement warranty.",
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: { id: { translation: id }, en: { translation: en } },
    lng: typeof window !== "undefined" ? localStorage.getItem("kth-lang") || "id" : "id",
    fallbackLng: "id",
    interpolation: { escapeValue: false },
  });
}

export default i18n;
