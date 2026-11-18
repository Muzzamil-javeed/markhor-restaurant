import { revalidateTag } from "next/cache";

export const MENU_CACHE_TAG = "menu";

/** Bust storefront menu cache after admin menu writes. */
export function revalidateMenuCache() {
  revalidateTag(MENU_CACHE_TAG, { expire: 0 });
}
