export type Distributor = {
  id: string;
  name: string;
  city: string;
  province: string;
  address: string;
  whatsapp: string;
  hours: string;
  lat: number;
  lng: number;
  type: "distributor" | "agent";
};

export const DISTRIBUTORS: Distributor[] = [
  { id: "d1", name: "KTH Jakarta Pusat", city: "Jakarta", province: "DKI Jakarta", address: "Jl. Mangga Dua Raya No. 45", whatsapp: "6281100001111", hours: "Senin–Sabtu 08.00–17.00", lat: -6.1389, lng: 106.8294, type: "distributor" },
  { id: "d2", name: "KTH Tangerang", city: "Tangerang", province: "Banten", address: "Jl. Daan Mogot KM 17", whatsapp: "6281100001112", hours: "Senin–Sabtu 08.00–17.00", lat: -6.1781, lng: 106.6319, type: "distributor" },
  { id: "d3", name: "KTH Bekasi", city: "Bekasi", province: "Jawa Barat", address: "Jl. Ahmad Yani Bekasi Selatan", whatsapp: "6281100001113", hours: "Senin–Sabtu 08.00–17.00", lat: -6.2383, lng: 106.9756, type: "distributor" },
  { id: "d4", name: "KTH Bandung", city: "Bandung", province: "Jawa Barat", address: "Jl. Soekarno Hatta No. 200", whatsapp: "6281100001114", hours: "Senin–Sabtu 08.00–17.00", lat: -6.9175, lng: 107.6191, type: "distributor" },
  { id: "d5", name: "KTH Semarang", city: "Semarang", province: "Jawa Tengah", address: "Jl. Pemuda No. 88", whatsapp: "6281100001115", hours: "Senin–Sabtu 08.00–17.00", lat: -6.9667, lng: 110.4167, type: "distributor" },
  { id: "d6", name: "KTH Yogyakarta", city: "Yogyakarta", province: "DI Yogyakarta", address: "Jl. Magelang KM 5", whatsapp: "6281100001116", hours: "Senin–Sabtu 08.00–17.00", lat: -7.7956, lng: 110.3695, type: "distributor" },
  { id: "d7", name: "KTH Surabaya", city: "Surabaya", province: "Jawa Timur", address: "Jl. Raya Darmo No. 50", whatsapp: "6281100001117", hours: "Senin–Sabtu 08.00–17.00", lat: -7.2575, lng: 112.7521, type: "distributor" },
  { id: "d8", name: "KTH Malang", city: "Malang", province: "Jawa Timur", address: "Jl. Soekarno Hatta Malang", whatsapp: "6281100001118", hours: "Senin–Sabtu 08.00–17.00", lat: -7.9666, lng: 112.6326, type: "distributor" },
  { id: "d9", name: "KTH Denpasar", city: "Denpasar", province: "Bali", address: "Jl. Gatot Subroto Barat", whatsapp: "6281100001119", hours: "Senin–Sabtu 08.00–17.00", lat: -8.6705, lng: 115.2126, type: "distributor" },
  { id: "d10", name: "KTH Medan", city: "Medan", province: "Sumatera Utara", address: "Jl. Gatot Subroto Medan", whatsapp: "6281100001120", hours: "Senin–Sabtu 08.00–17.00", lat: 3.5952, lng: 98.6722, type: "distributor" },
  { id: "d11", name: "KTH Pekanbaru", city: "Pekanbaru", province: "Riau", address: "Jl. Sudirman Pekanbaru", whatsapp: "6281100001121", hours: "Senin–Sabtu 08.00–17.00", lat: 0.5071, lng: 101.4478, type: "distributor" },
  { id: "d12", name: "KTH Palembang", city: "Palembang", province: "Sumatera Selatan", address: "Jl. Veteran Palembang", whatsapp: "6281100001122", hours: "Senin–Sabtu 08.00–17.00", lat: -2.9909, lng: 104.7566, type: "distributor" },
  { id: "d13", name: "KTH Lampung", city: "Bandar Lampung", province: "Lampung", address: "Jl. Raden Intan Lampung", whatsapp: "6281100001123", hours: "Senin–Sabtu 08.00–17.00", lat: -5.4292, lng: 105.2610, type: "distributor" },
  { id: "d14", name: "KTH Pontianak", city: "Pontianak", province: "Kalimantan Barat", address: "Jl. Tanjungpura Pontianak", whatsapp: "6281100001124", hours: "Senin–Sabtu 08.00–17.00", lat: -0.0263, lng: 109.3425, type: "distributor" },
  { id: "d15", name: "KTH Banjarmasin", city: "Banjarmasin", province: "Kalimantan Selatan", address: "Jl. A. Yani KM 3", whatsapp: "6281100001125", hours: "Senin–Sabtu 08.00–17.00", lat: -3.3194, lng: 114.5908, type: "distributor" },
  { id: "d16", name: "KTH Balikpapan", city: "Balikpapan", province: "Kalimantan Timur", address: "Jl. Jenderal Sudirman", whatsapp: "6281100001126", hours: "Senin–Sabtu 08.00–17.00", lat: -1.2379, lng: 116.8529, type: "distributor" },
  { id: "d17", name: "KTH Makassar", city: "Makassar", province: "Sulawesi Selatan", address: "Jl. AP Pettarani No. 99", whatsapp: "6281100001127", hours: "Senin–Sabtu 08.00–17.00", lat: -5.1477, lng: 119.4327, type: "distributor" },
  { id: "d18", name: "KTH Manado", city: "Manado", province: "Sulawesi Utara", address: "Jl. Sam Ratulangi", whatsapp: "6281100001128", hours: "Senin–Sabtu 08.00–17.00", lat: 1.4748, lng: 124.8421, type: "distributor" },
  { id: "d19", name: "KTH Jayapura", city: "Jayapura", province: "Papua", address: "Jl. Ahmad Yani Jayapura", whatsapp: "6281100001129", hours: "Senin–Sabtu 08.00–17.00", lat: -2.5337, lng: 140.7181, type: "distributor" },
  { id: "d20", name: "KTH Aceh", city: "Banda Aceh", province: "Aceh", address: "Jl. Teuku Umar Banda Aceh", whatsapp: "6281100001130", hours: "Senin–Sabtu 08.00–17.00", lat: 5.5483, lng: 95.3238, type: "distributor" },
  { id: "a1", name: "Agen KTH Bogor", city: "Bogor", province: "Jawa Barat", address: "Jl. Pajajaran No. 100", whatsapp: "6281100002001", hours: "Senin–Minggu 09.00–18.00", lat: -6.5950, lng: 106.8166, type: "agent" },
  { id: "a2", name: "Agen KTH Cirebon", city: "Cirebon", province: "Jawa Barat", address: "Jl. Siliwangi Cirebon", whatsapp: "6281100002002", hours: "Senin–Minggu 09.00–18.00", lat: -6.7320, lng: 108.5523, type: "agent" },
  { id: "a3", name: "Agen KTH Solo", city: "Surakarta", province: "Jawa Tengah", address: "Jl. Slamet Riyadi Solo", whatsapp: "6281100002003", hours: "Senin–Minggu 09.00–18.00", lat: -7.5755, lng: 110.8243, type: "agent" },
  { id: "a4", name: "Agen KTH Madiun", city: "Madiun", province: "Jawa Timur", address: "Jl. Pahlawan Madiun", whatsapp: "6281100002004", hours: "Senin–Minggu 09.00–18.00", lat: -7.6298, lng: 111.5239, type: "agent" },
  { id: "a5", name: "Agen KTH Padang", city: "Padang", province: "Sumatera Barat", address: "Jl. Khatib Sulaiman Padang", whatsapp: "6281100002005", hours: "Senin–Minggu 09.00–18.00", lat: -0.9471, lng: 100.4172, type: "agent" },
  { id: "a6", name: "Agen KTH Samarinda", city: "Samarinda", province: "Kalimantan Timur", address: "Jl. P. Hidayatullah", whatsapp: "6281100002006", hours: "Senin–Minggu 09.00–18.00", lat: -0.5022, lng: 117.1536, type: "agent" },
  { id: "a7", name: "Agen KTH Mataram", city: "Mataram", province: "Nusa Tenggara Barat", address: "Jl. Pejanggik Mataram", whatsapp: "6281100002007", hours: "Senin–Minggu 09.00–18.00", lat: -8.5833, lng: 116.1167, type: "agent" },
  { id: "a8", name: "Agen KTH Kupang", city: "Kupang", province: "Nusa Tenggara Timur", address: "Jl. El Tari Kupang", whatsapp: "6281100002008", hours: "Senin–Minggu 09.00–18.00", lat: -10.1772, lng: 123.6070, type: "agent" },
];
