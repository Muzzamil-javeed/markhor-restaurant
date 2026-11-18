import { NextResponse } from "next/server";
import { z } from "zod";
import { assertAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { revalidateMenuCache } from "@/lib/menu-cache";
import {
  isKnownMenuItemId,
  softDeleteMenuItem,
  staticItemById,
  updateCustomMenuItem,
  upsertMenuOverride,
} from "@/lib/menu-runtime";

type RouteContext = {
  params: Promise<{ itemId: string }>;
};

const patchSchema = z.object({
  available: z.boolean().optional(),
  hidden: z.boolean().optional(),
  priceOverride: z.number().int().min(0).nullable().optional(),
  nameOverride: z
    .union([z.string().trim().min(1).max(120), z.null()])
    .optional(),
  imagePath: z
    .union([z.string().trim().min(1).max(240), z.null()])
    .optional(),
  /** Direct fields for custom dishes */
  name: z.string().trim().min(1).max(120).optional(),
  price: z.number().int().min(0).optional(),
});

function serverError(error: unknown) {
  console.error("[admin/menu/:itemId]", error);
  const message =
    error instanceof Error ? error.message : "Could not update menu item.";
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { itemId } = await context.params;
  if (!(await isKnownMenuItemId(itemId))) {
    return NextResponse.json({ error: "Unknown menu item." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload." },
      { status: 400 },
    );
  }

  if (
    parsed.data.available === undefined &&
    parsed.data.hidden === undefined &&
    parsed.data.priceOverride === undefined &&
    parsed.data.nameOverride === undefined &&
    parsed.data.imagePath === undefined &&
    parsed.data.name === undefined &&
    parsed.data.price === undefined
  ) {
    return NextResponse.json(
      { error: "Provide at least one field to update." },
      { status: 400 },
    );
  }

  try {
    const isCustom = !staticItemById(itemId);

    if (isCustom) {
      const override = await updateCustomMenuItem(itemId, {
        name: parsed.data.name ?? parsed.data.nameOverride ?? undefined,
        price:
          parsed.data.price ??
          (parsed.data.priceOverride === null
            ? undefined
            : (parsed.data.priceOverride ?? undefined)),
        available: parsed.data.available,
        hidden: parsed.data.hidden,
        imagePath: parsed.data.imagePath,
      });
      revalidateMenuCache();
      return NextResponse.json({ override, item: override });
    }

    const override = await upsertMenuOverride({
      itemId,
      available: parsed.data.available,
      hidden: parsed.data.hidden,
      priceOverride: parsed.data.priceOverride,
      nameOverride: parsed.data.nameOverride,
      imagePath: parsed.data.imagePath,
    });
    revalidateMenuCache();
    return NextResponse.json({ override });
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = assertAdmin(_request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { itemId } = await context.params;
  if (!(await isKnownMenuItemId(itemId))) {
    return NextResponse.json({ error: "Unknown menu item." }, { status: 404 });
  }

  try {
    const override = await softDeleteMenuItem(itemId);
    revalidateMenuCache();
    return NextResponse.json({ override });
  } catch (error) {
    return serverError(error);
  }
}

export async function GET(_request: Request, context: RouteContext) {
  const auth = assertAdmin(_request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { itemId } = await context.params;
  const custom = await prisma.menuCustomItem.findUnique({ where: { id: itemId } });
  if (custom) return NextResponse.json({ item: custom, isCustom: true });
  const staticItem = staticItemById(itemId);
  if (!staticItem) {
    return NextResponse.json({ error: "Unknown menu item." }, { status: 404 });
  }
  return NextResponse.json({ item: staticItem, isCustom: false });
}
