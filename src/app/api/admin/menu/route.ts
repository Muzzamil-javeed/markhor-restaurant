import { NextResponse } from "next/server";
import { z } from "zod";
import { menu } from "@/data/menu";
import { menuPhotoSlugs } from "@/data/menu-photos";
import { assertAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { revalidateMenuCache } from "@/lib/menu-cache";
import {
  createCustomMenuItem,
  listCategoryOptions,
  previewImageForAdmin,
} from "@/lib/menu-runtime";

const createSchema = z.object({
  name: z.string().trim().min(2).max(120),
  categoryId: z.string().trim().min(1),
  price: z.number().int().min(0),
  description: z.string().trim().max(400).nullable().optional(),
  available: z.boolean().optional(),
});

export async function GET(request: Request) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const [overrides, customs] = await Promise.all([
    prisma.menuOverride.findMany(),
    prisma.menuCustomItem.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  const byId = new Map(overrides.map((entry) => [entry.itemId, entry]));
  const categoryName = new Map(
    menu.map((category) => [category.id, category.name]),
  );

  const staticItems = menu.flatMap((category) =>
    category.items.map((item) => {
      const override = byId.get(item.id);
      return {
        id: item.id,
        slug: item.slug,
        name: override?.nameOverride?.trim() || item.name,
        baseName: item.name,
        categoryId: category.id,
        categoryName: category.name,
        baseAvailable: item.available,
        basePrice: item.price,
        available: override ? override.available : item.available,
        hidden: override?.hidden ?? false,
        priceOverride: override?.priceOverride ?? null,
        nameOverride: override?.nameOverride ?? null,
        imagePath: override?.imagePath ?? null,
        hasStaticPhoto: menuPhotoSlugs.has(item.slug),
        previewImage: previewImageForAdmin({
          slug: item.slug,
          imagePath: override?.imagePath ?? null,
          hasStaticPhoto: menuPhotoSlugs.has(item.slug),
        }),
        isCustom: false,
      };
    }),
  );

  const customItems = customs.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    baseName: item.name,
    categoryId: item.categoryId,
    categoryName: categoryName.get(item.categoryId) ?? item.categoryId,
    baseAvailable: item.available,
    basePrice: item.price,
    available: item.available,
    hidden: item.hidden,
    priceOverride: null as number | null,
    nameOverride: null as string | null,
    imagePath: item.imagePath,
    hasStaticPhoto: false,
    previewImage: previewImageForAdmin({
      slug: item.slug,
      imagePath: item.imagePath,
      hasStaticPhoto: false,
    }),
    isCustom: true,
  }));

  return NextResponse.json({
    items: [...customItems, ...staticItems],
    categories: listCategoryOptions(),
  });
}

export async function POST(request: Request) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload." },
      { status: 400 },
    );
  }

  try {
    const item = await createCustomMenuItem({
      name: parsed.data.name,
      categoryId: parsed.data.categoryId,
      price: parsed.data.price,
      description: parsed.data.description ?? null,
      available: parsed.data.available ?? true,
    });
    revalidateMenuCache();
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("[admin/menu POST]", error);
    const message =
      error instanceof Error ? error.message : "Could not create dish.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
