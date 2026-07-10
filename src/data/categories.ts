import productJet from "@/assets/product-jet-pump.jpg";
import productSub from "@/assets/product-submersible.jpg";
import productBooster from "@/assets/product-booster.jpg";
import productIndustrial from "@/assets/product-industrial.jpg";

export type Category = {
  slug: string;
  name: { id: string; en: string };
  tagline: { id: string; en: string };
  description: { id: string; en: string };
  image: string;
  icon: string; // lucide icon name
};

export const CATEGORIES: Category[] = [
  {
    slug: "jet-pump",
    name: { id: "Jet Pump", en: "Jet Pump" },
    tagline: { id: "Sumur dalam hingga 30 meter", en: "Deep well up to 30 m" },
    description: {
      id: "Pompa jet bertenaga tinggi untuk sumur dalam dengan daya hisap maksimal.",
      en: "High-power jet pumps for deep wells with maximum suction.",
    },
    image: productJet,
    icon: "Droplets",
  },
  {
    slug: "semi-jet",
    name: { id: "Semi Jet", en: "Semi Jet" },
    tagline: { id: "Sumur sedang 9–20 meter", en: "Medium well 9–20 m" },
    description: {
      id: "Daya hisap kuat untuk kebutuhan rumah tangga dengan sumur sedang.",
      en: "Strong suction for households with medium-depth wells.",
    },
    image: productJet,
    icon: "Waves",
  },
  {
    slug: "booster",
    name: { id: "Booster Pump", en: "Booster Pump" },
    tagline: { id: "Penguat tekanan air", en: "Water pressure booster" },
    description: {
      id: "Stabilkan tekanan air untuk shower, water heater, dan kran lantai atas.",
      en: "Stabilize pressure for showers, water heaters, and upper-floor taps.",
    },
    image: productBooster,
    icon: "Gauge",
  },
  {
    slug: "submersible",
    name: { id: "Submersible", en: "Submersible" },
    tagline: { id: "Pompa celup tahan banting", en: "Heavy-duty submersible" },
    description: {
      id: "Pompa celup untuk sumur dalam, kolam, dan instalasi industri.",
      en: "Submersible pumps for deep wells, ponds, and industrial use.",
    },
    image: productSub,
    icon: "Anchor",
  },
  {
    slug: "industrial",
    name: { id: "Industrial", en: "Industrial" },
    tagline: { id: "Operasi 24 jam non-stop", en: "24/7 non-stop operation" },
    description: {
      id: "Pompa industri kapasitas besar untuk pabrik, gedung, dan agrikultur.",
      en: "High-capacity industrial pumps for factories, buildings, and agriculture.",
    },
    image: productIndustrial,
    icon: "Factory",
  },
  {
    slug: "accessories",
    name: { id: "Accessories", en: "Accessories" },
    tagline: { id: "Sparepart & aksesoris asli", en: "Genuine spare parts" },
    description: {
      id: "Kapasitor, kabel, foot valve, pressure switch, dan komponen original KTH.",
      en: "Capacitors, cables, foot valves, pressure switches, and genuine KTH parts.",
    },
    image: productBooster,
    icon: "Wrench",
  },
];
