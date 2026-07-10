import { useQuery } from "@tanstack/react-query";
import { qkCompany, type DbCompany } from "@/lib/queries";
import { SITE } from "@/data/site";

const FALLBACK: DbCompany = {
  name: SITE.brand,
  phone: SITE.phone,
  whatsapp: SITE.whatsapp,
  email: SITE.email,
  instagram: SITE.social.instagram,
  facebook: SITE.social.facebook,
  youtube: SITE.social.youtube,
  tiktok: SITE.social.tiktok,
  address: SITE.address,
  map_embed: "",
  shopee_url: SITE.stores.shopee,
  tokopedia_url: SITE.stores.tokopedia,
  working_hours: "Senin–Sabtu, 08.00–17.00 WIB",
};

export function useCompany(): DbCompany {
  const { data } = useQuery({ ...qkCompany(), staleTime: 60_000 });
  return data ?? FALLBACK;
}
