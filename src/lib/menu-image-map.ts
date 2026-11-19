import { cacheLife, cacheTag } from "next/cache";
import { withPrismaRetry } from "@/lib/db";
import { MENU_CACHE_TAG } from "@/lib/menu-cache";
import {
  type MenuImageEntry,
  type MenuImageMap,
} from "@/lib/menu-image-map-types";
import { staticItemById } from "@/lib/menu-runtime";

export type { MenuImageEntry, MenuImageMap } from "@/lib/menu-image-map-types";
export { lookupMenuImage } from "@/lib/menu-image-map-types";

function put(map: MenuImageMap, key: string, entry: MenuImageEntry) {
  if (!key || !entry.imageSrc.trim()) return;
  map[key] = entry;
}

function entryFromRow(row: {
  imagePath: string | null;
  imageSquarePath?: string | null;
  imageThumbPath?: string | null;
}): MenuImageEntry | null {
  if (!row.imagePath?.trim()) return null;
  return {
    imageSrc: row.imagePath.trim(),
    imageSquareSrc: row.imageSquarePath ?? null,
    imageThumbSrc: row.imageThumbPath ?? null,
  };
}

async function loadMenuImageMap(): Promise<MenuImageMap> {
  const [overrides, customs] = await withPrismaRetry((db) =>
    Promise.all([
      db.menuOverride.findMany({
        where: { imagePath: { not: null } },
        select: {
          itemId: true,
          imagePath: true,
          imageSquarePath: true,
          imageThumbPath: true,
        },
      }),
      db.menuCustomItem.findMany({
        where: { imagePath: { not: null }, hidden: false },
        select: {
          id: true,
          slug: true,
          imagePath: true,
          imageSquarePath: true,
          imageThumbPath: true,
        },
      }),
    ]),
  );

  const map: MenuImageMap = {};

  for (const row of overrides) {
    const entry = entryFromRow(row);
    if (!entry) continue;
    put(map, row.itemId, entry);
    const base = staticItemById(row.itemId);
    if (base?.slug) put(map, base.slug, entry);
  }

  for (const row of customs) {
    const entry = entryFromRow(row);
    if (!entry) continue;
    put(map, row.id, entry);
    put(map, row.slug, entry);
  }

  return map;
}

/** Load every admin-uploaded dish photo (overrides + custom items). */
export async function getMenuImageMap(): Promise<MenuImageMap> {
  "use cache";
  cacheTag(MENU_CACHE_TAG);
  cacheLife("minutes");

  try {
    return await loadMenuImageMap();
  } catch (error) {
    // Storefront should still render with stock photos if DB is briefly down.
    console.error("[getMenuImageMap]", error);
    return {};
  }
}
