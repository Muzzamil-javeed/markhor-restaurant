import { cacheLife, cacheTag } from "next/cache";
import { menu } from "@/data/menu";
import type { Category, MenuItem } from "@/data/menu-types";
import { stockImageForSlug } from "@/data/menu-photos";
import { hasImageQuery } from "@/data/images";
import { slugify } from "@/data/slug";
import { prisma } from "@/lib/db";
import { MENU_CACHE_TAG } from "@/lib/menu-cache";

export type MenuOverrideRow = {
  itemId: string;
  available: boolean;
  hidden: boolean;
  priceOverride: number | null;
  nameOverride: string | null;
  imagePath: string | null;
  imageSquarePath?: string | null;
  imageThumbPath?: string | null;
  imageSource?: string | null;
};

export type RuntimeMenuItem = MenuItem & {
  effectivePrice: number;
  imageSrc?: string | null;
  imageSquareSrc?: string | null;
  imageThumbSrc?: string | null;
  imageSource?: string | null;
};

export type CustomMenuItemRow = {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number;
  available: boolean;
  hidden: boolean;
  imagePath: string | null;
  imageSquarePath?: string | null;
  imageThumbPath?: string | null;
  imageSource?: string | null;
};

function applyOverride(
  base: MenuItem,
  override: MenuOverrideRow | null | undefined,
): RuntimeMenuItem | null {
  if (override?.hidden) return null;

  const available = override ? override.available : base.available;
  const effectivePrice =
    override?.priceOverride != null ? override.priceOverride : base.price;
  const name = override?.nameOverride?.trim() || base.name;

  return {
    ...base,
    name,
    available,
    price: effectivePrice,
    effectivePrice,
    imageSrc: override?.imagePath ?? null,
    imageSquareSrc: override?.imageSquarePath ?? null,
    imageThumbSrc: override?.imageThumbPath ?? null,
    imageSource: override?.imageSource ?? null,
  };
}

function customToMenuItem(row: CustomMenuItemRow): MenuItem {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? undefined,
    price: row.price,
    available: row.available,
  };
}

function applyCustom(row: CustomMenuItemRow): RuntimeMenuItem | null {
  if (row.hidden) return null;
  const base = customToMenuItem(row);
  return {
    ...base,
    effectivePrice: row.price,
    imageSrc: row.imagePath ?? null,
    imageSquareSrc: row.imageSquarePath ?? null,
    imageThumbSrc: row.imageThumbPath ?? null,
    imageSource: row.imageSource ?? null,
  };
}

export function staticMenuCategories(): Category[] {
  return menu;
}

export function staticItemById(itemId: string): MenuItem | undefined {
  return menu
    .flatMap((category) => category.items)
    .find((item) => item.id === itemId);
}

export function categoryNameById(categoryId: string): string | null {
  return menu.find((category) => category.id === categoryId)?.name ?? null;
}

export function listCategoryOptions() {
  return menu.map((category) => ({
    id: category.id,
    name: category.name,
  }));
}

/** Merge static menu.ts + custom DB dishes + MenuOverride rows. */
export async function getRuntimeMenu(): Promise<Category[]> {
  "use cache";
  cacheTag(MENU_CACHE_TAG);
  cacheLife("minutes");

  const [overrides, customs] = await Promise.all([
    prisma.menuOverride.findMany(),
    prisma.menuCustomItem.findMany(),
  ]);
  const byId = new Map(overrides.map((entry) => [entry.itemId, entry]));
  const customsByCategory = new Map<string, CustomMenuItemRow[]>();
  for (const row of customs) {
    const list = customsByCategory.get(row.categoryId) ?? [];
    list.push(row);
    customsByCategory.set(row.categoryId, list);
  }

  return menu
    .map((category) => {
      const staticItems = category.items
        .map((item) => applyOverride(item, byId.get(item.id)))
        .filter((item): item is RuntimeMenuItem => item !== null);

      const customItems = (customsByCategory.get(category.id) ?? [])
        .map((row) => applyCustom(row))
        .filter((item): item is RuntimeMenuItem => item !== null);

      return {
        ...category,
        items: [...staticItems, ...customItems],
      };
    })
    .filter((category) => category.items.length > 0);
}

export async function getRuntimeMenuItem(
  itemId: string,
): Promise<RuntimeMenuItem | null> {
  "use cache";
  cacheTag(MENU_CACHE_TAG);
  cacheLife("minutes");

  const base = staticItemById(itemId);
  if (base) {
    const override = await prisma.menuOverride.findUnique({
      where: { itemId },
    });
    return applyOverride(base, override);
  }

  const custom = await prisma.menuCustomItem.findUnique({
    where: { id: itemId },
  });
  if (!custom) return null;
  return applyCustom(custom);
}

export async function resolveMenuItemForPricing(
  itemId: string,
): Promise<MenuItem | null> {
  const runtime = await getRuntimeMenuItem(itemId);
  if (!runtime) return null;
  return {
    id: runtime.id,
    slug: runtime.slug,
    name: runtime.name,
    description: runtime.description,
    price: runtime.price,
    variants: runtime.variants,
    choiceGroups: runtime.choiceGroups,
    addOns: runtime.addOns,
    tags: runtime.tags,
    available: runtime.available,
  };
}

export async function listMenuOverrides() {
  return prisma.menuOverride.findMany({ orderBy: { itemId: "asc" } });
}

export async function upsertMenuOverride(input: {
  itemId: string;
  available?: boolean;
  hidden?: boolean;
  priceOverride?: number | null;
  nameOverride?: string | null;
  imagePath?: string | null;
  imageSquarePath?: string | null;
  imageThumbPath?: string | null;
  imageSource?: string | null;
}) {
  const existing = await prisma.menuOverride.findUnique({
    where: { itemId: input.itemId },
  });

  return prisma.menuOverride.upsert({
    where: { itemId: input.itemId },
    create: {
      itemId: input.itemId,
      available: input.available ?? true,
      hidden: input.hidden ?? false,
      priceOverride: input.priceOverride ?? null,
      nameOverride: input.nameOverride ?? null,
      imagePath: input.imagePath ?? null,
      imageSquarePath: input.imageSquarePath ?? null,
      imageThumbPath: input.imageThumbPath ?? null,
      imageSource: input.imageSource ?? null,
    },
    update: {
      ...(input.available !== undefined ? { available: input.available } : {}),
      ...(input.hidden !== undefined ? { hidden: input.hidden } : {}),
      ...(input.priceOverride !== undefined
        ? { priceOverride: input.priceOverride }
        : existing
          ? {}
          : {}),
      ...(input.nameOverride !== undefined
        ? { nameOverride: input.nameOverride }
        : {}),
      ...(input.imagePath !== undefined ? { imagePath: input.imagePath } : {}),
      ...(input.imageSquarePath !== undefined
        ? { imageSquarePath: input.imageSquarePath }
        : {}),
      ...(input.imageThumbPath !== undefined
        ? { imageThumbPath: input.imageThumbPath }
        : {}),
      ...(input.imageSource !== undefined
        ? { imageSource: input.imageSource }
        : {}),
    },
  });
}

export async function softDeleteMenuItem(itemId: string) {
  const custom = await prisma.menuCustomItem.findUnique({
    where: { id: itemId },
  });
  if (custom) {
    return prisma.menuCustomItem.update({
      where: { id: itemId },
      data: { hidden: true, available: false },
    });
  }
  return upsertMenuOverride({
    itemId,
    hidden: true,
    available: false,
  });
}

export async function createCustomMenuItem(input: {
  name: string;
  categoryId: string;
  price: number;
  description?: string | null;
  available?: boolean;
}) {
  if (!categoryNameById(input.categoryId)) {
    throw new Error("Unknown category.");
  }

  const baseSlug = slugify(input.name);
  if (!baseSlug) throw new Error("Enter a valid dish name.");

  let slug = baseSlug;
  let n = 2;
  while (await prisma.menuCustomItem.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${n}`;
    n += 1;
  }

  // Avoid colliding with a static menu id/slug
  const staticHit = menu
    .flatMap((category) => category.items)
    .some((item) => item.id === slug || item.slug === slug);
  if (staticHit) {
    slug = `${slug}-custom`;
  }

  return prisma.menuCustomItem.create({
    data: {
      slug,
      categoryId: input.categoryId,
      name: input.name.trim(),
      description: input.description?.trim() || null,
      price: input.price,
      available: input.available ?? true,
      hidden: false,
    },
  });
}

export async function updateCustomMenuItem(
  itemId: string,
  input: {
    name?: string;
    price?: number;
    available?: boolean;
    hidden?: boolean;
    description?: string | null;
    imagePath?: string | null;
    imageSquarePath?: string | null;
    imageThumbPath?: string | null;
    imageSource?: string | null;
  },
) {
  return prisma.menuCustomItem.update({
    where: { id: itemId },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.price !== undefined ? { price: input.price } : {}),
      ...(input.available !== undefined ? { available: input.available } : {}),
      ...(input.hidden !== undefined ? { hidden: input.hidden } : {}),
      ...(input.description !== undefined
        ? { description: input.description?.trim() || null }
        : {}),
      ...(input.imagePath !== undefined ? { imagePath: input.imagePath } : {}),
      ...(input.imageSquarePath !== undefined
        ? { imageSquarePath: input.imageSquarePath }
        : {}),
      ...(input.imageThumbPath !== undefined
        ? { imageThumbPath: input.imageThumbPath }
        : {}),
      ...(input.imageSource !== undefined
        ? { imageSource: input.imageSource }
        : {}),
    },
  });
}

export async function isKnownMenuItemId(itemId: string): Promise<boolean> {
  if (staticItemById(itemId)) return true;
  const custom = await prisma.menuCustomItem.findUnique({
    where: { id: itemId },
    select: { id: true },
  });
  return Boolean(custom);
}

export function previewImageForAdmin(input: {
  slug: string;
  imagePath: string | null;
  hasStaticPhoto: boolean;
}) {
  if (input.imagePath) return input.imagePath;
  if (input.hasStaticPhoto || hasImageQuery(input.slug)) {
    return `/images/menu/${input.slug}.webp`;
  }
  return stockImageForSlug(input.slug);
}
