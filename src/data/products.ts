import jetImg from "@/assets/product-jet-pump.jpg";
import subImg from "@/assets/product-submersible.jpg";
import boosterImg from "@/assets/product-booster.jpg";
import industrialImg from "@/assets/product-industrial.jpg";

export type Product = {
  slug: string;
  sku: string;
  name: string;
  category: string;
  tagline: { id: string; en: string };
  description: { id: string; en: string };
  image: string;
  gallery: string[];
  specs: {
    power: string;
    head: string;
    flow: string;
    suction: string;
    discharge: string;
    voltage: string;
    weight: string;
    application: { id: string; en: string };
  };
  features: { id: string; en: string }[];
  featured?: boolean;
  popular?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    slug: "kth-jp250",
    sku: "KTH-JP250",
    name: "KTH JP-250 Jet Pump",
    category: "jet-pump",
    tagline: { id: "Pompa jet 250 W untuk sumur dalam", en: "250 W jet pump for deep wells" },
    description: {
      id: "Pompa jet otomatis bertenaga tinggi dengan motor 100% kawat tembaga, mampu menarik air dari sumur dalam hingga 30 meter. Suara halus, hemat listrik, dan tahan dioperasikan 24 jam non-stop.",
      en: "High-power automatic jet pump with 100% copper windings, capable of drawing water from wells up to 30 m deep. Quiet, energy-efficient, and built for 24/7 operation.",
    },
    image: jetImg,
    gallery: [jetImg, jetImg, jetImg],
    specs: {
      power: "250 Watt",
      head: "30 m",
      flow: "33 L/min",
      suction: "9 m",
      discharge: "30 m",
      voltage: "220 V / 50 Hz",
      weight: "12 kg",
      application: { id: "Rumah tangga, sumur dalam", en: "Residential, deep wells" },
    },
    features: [
      { id: "Motor 100% kawat tembaga", en: "100% copper motor windings" },
      { id: "Gantungan 100% kuningan", en: "100% brass hanger" },
      { id: "Anti karat & low maintenance", en: "Rust-proof & low maintenance" },
      { id: "Otomatis dengan pressure switch", en: "Auto pressure switch" },
    ],
    featured: true,
    popular: true,
  },
  {
    slug: "kth-jp370",
    sku: "KTH-JP370",
    name: "KTH JP-370 Jet Pump Plus",
    category: "jet-pump",
    tagline: { id: "Daya 370 W debit besar", en: "370 W high flow" },
    description: {
      id: "Versi upgrade dengan daya 370 W untuk kebutuhan keluarga besar dan bangunan dua lantai.",
      en: "Upgraded 370 W version for large families and two-story buildings.",
    },
    image: jetImg,
    gallery: [jetImg, jetImg],
    specs: {
      power: "370 Watt",
      head: "35 m",
      flow: "45 L/min",
      suction: "9 m",
      discharge: "35 m",
      voltage: "220 V / 50 Hz",
      weight: "14 kg",
      application: { id: "Rumah tangga premium", en: "Premium residential" },
    },
    features: [
      { id: "Motor 100% kawat tembaga", en: "100% copper motor" },
      { id: "Kapasitas besar", en: "High capacity" },
      { id: "Garansi 1 tahun ganti baru", en: "1-year replacement warranty" },
    ],
    featured: true,
  },
  {
    slug: "kth-sj125",
    sku: "KTH-SJ125",
    name: "KTH SJ-125 Semi Jet",
    category: "semi-jet",
    tagline: { id: "Hemat energi 125 W", en: "Energy saving 125 W" },
    description: {
      id: "Pompa semi jet hemat listrik untuk sumur 9–20 meter dengan operasi sangat halus.",
      en: "Energy-efficient semi-jet pump for 9–20 m wells with whisper-quiet operation.",
    },
    image: jetImg,
    gallery: [jetImg],
    specs: {
      power: "125 Watt",
      head: "20 m",
      flow: "20 L/min",
      suction: "9 m",
      discharge: "20 m",
      voltage: "220 V / 50 Hz",
      weight: "9 kg",
      application: { id: "Rumah tangga, sumur sedang", en: "Residential, medium wells" },
    },
    features: [
      { id: "Suara halus", en: "Whisper-quiet" },
      { id: "Hemat listrik", en: "Energy efficient" },
      { id: "Ber-SNI", en: "SNI certified" },
    ],
    popular: true,
  },
  {
    slug: "kth-bp200",
    sku: "KTH-BP200",
    name: "KTH BP-200 Booster",
    category: "booster",
    tagline: { id: "Penguat tekanan otomatis", en: "Automatic pressure booster" },
    description: {
      id: "Booster pump otomatis untuk menjaga tekanan air stabil di shower, water heater, dan kran lantai atas.",
      en: "Automatic booster to keep water pressure steady for showers, heaters, and upper-floor taps.",
    },
    image: boosterImg,
    gallery: [boosterImg, boosterImg],
    specs: {
      power: "200 Watt",
      head: "15 m",
      flow: "35 L/min",
      suction: "—",
      discharge: "15 m",
      voltage: "220 V / 50 Hz",
      weight: "8 kg",
      application: { id: "Booster lantai atas, water heater", en: "Upper-floor boost, water heater" },
    },
    features: [
      { id: "Flow switch otomatis", en: "Auto flow switch" },
      { id: "Body anti karat", en: "Rust-proof body" },
      { id: "Plug & play", en: "Plug & play" },
    ],
    featured: true,
  },
  {
    slug: "kth-sb750",
    sku: "KTH-SB750",
    name: "KTH SB-750 Submersible",
    category: "submersible",
    tagline: { id: "Pompa celup 750 W", en: "750 W submersible" },
    description: {
      id: "Pompa celup stainless steel tahan banting untuk sumur dalam dan aplikasi industri ringan.",
      en: "Heavy-duty stainless submersible pump for deep wells and light industrial use.",
    },
    image: subImg,
    gallery: [subImg, subImg],
    specs: {
      power: "750 Watt",
      head: "60 m",
      flow: "55 L/min",
      suction: "—",
      discharge: "60 m",
      voltage: "220 V / 50 Hz",
      weight: "18 kg",
      application: { id: "Sumur dalam, kolam, industri", en: "Deep wells, ponds, industrial" },
    },
    features: [
      { id: "Body stainless steel", en: "Stainless steel body" },
      { id: "Thermal protection", en: "Thermal protection" },
      { id: "Mampu 24 jam non-stop", en: "24/7 capable" },
    ],
    popular: true,
  },
  {
    slug: "kth-in15",
    sku: "KTH-IN15",
    name: "KTH IN-15 Industrial",
    category: "industrial",
    tagline: { id: "Pompa industri 1.5 kW", en: "1.5 kW industrial pump" },
    description: {
      id: "Pompa sentrifugal industri kapasitas besar untuk pabrik, gedung tinggi, dan irigasi pertanian.",
      en: "High-capacity industrial centrifugal pump for factories, high-rise buildings, and irrigation.",
    },
    image: industrialImg,
    gallery: [industrialImg, industrialImg],
    specs: {
      power: "1500 Watt",
      head: "50 m",
      flow: "200 L/min",
      suction: "8 m",
      discharge: "50 m",
      voltage: "220 V / 50 Hz",
      weight: "32 kg",
      application: { id: "Industri, agrikultur, gedung", en: "Industrial, agriculture, buildings" },
    },
    features: [
      { id: "Cast iron heavy duty", en: "Heavy-duty cast iron" },
      { id: "Operasi non-stop", en: "Non-stop operation" },
      { id: "Sparepart tersedia", en: "Spare parts available" },
    ],
    featured: true,
  },
  {
    slug: "kth-jp125",
    sku: "KTH-JP125",
    name: "KTH JP-125 Compact",
    category: "jet-pump",
    tagline: { id: "Pompa compact 125 W", en: "Compact 125 W pump" },
    description: {
      id: "Pompa jet compact dengan body ringkas, ideal untuk rumah minimalis dan apartemen.",
      en: "Compact jet pump with a small footprint, ideal for small homes and apartments.",
    },
    image: jetImg,
    gallery: [jetImg],
    specs: {
      power: "125 Watt",
      head: "22 m",
      flow: "22 L/min",
      suction: "9 m",
      discharge: "22 m",
      voltage: "220 V / 50 Hz",
      weight: "8 kg",
      application: { id: "Apartemen, rumah kecil", en: "Apartments, small homes" },
    },
    features: [
      { id: "Body compact", en: "Compact body" },
      { id: "Pemasangan mudah", en: "Easy installation" },
    ],
  },
  {
    slug: "kth-acc-ps01",
    sku: "KTH-PS01",
    name: "KTH Pressure Switch Original",
    category: "accessories",
    tagline: { id: "Sparepart original KTH", en: "Genuine KTH part" },
    description: {
      id: "Pressure switch original untuk menggantikan komponen otomatis pompa air KTH.",
      en: "Genuine pressure switch replacement for KTH water pumps.",
    },
    image: boosterImg,
    gallery: [boosterImg],
    specs: {
      power: "—",
      head: "—",
      flow: "—",
      suction: "—",
      discharge: "—",
      voltage: "220 V",
      weight: "0.3 kg",
      application: { id: "Sparepart pompa KTH", en: "KTH pump spare part" },
    },
    features: [
      { id: "Original 100%", en: "100% genuine" },
      { id: "Garansi 6 bulan", en: "6-month warranty" },
    ],
  },
];
