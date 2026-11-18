import sharp from "sharp";
import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin-auth";
import { revalidateMenuCache } from "@/lib/menu-cache";
import { storeMenuOverrideImages } from "@/lib/menu-image-storage";
import { applyDarkGrade } from "@/lib/dark-grade";
import {
  isKnownMenuItemId,
  staticItemById,
  updateCustomMenuItem,
  upsertMenuOverride,
} from "@/lib/menu-runtime";

type RouteContext = {
  params: Promise<{ itemId: string }>;
};

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request, context: RouteContext) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { itemId } = await context.params;
  if (!(await isKnownMenuItemId(itemId))) {
    return NextResponse.json({ error: "Unknown menu item." }, { status: 404 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = form.get("file");
  const matchStyle = String(form.get("matchStyle") ?? "1") !== "0";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing image file." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Use JPG, PNG, or WebP." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image must be under 8MB." },
      { status: 400 },
    );
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());

    let landscape: Buffer;
    let square: Buffer;
    let thumb: Buffer;

    if (matchStyle) {
      landscape = await applyDarkGrade(bytes, { width: 1600, height: 1067 });
      square = await applyDarkGrade(bytes, {
        width: 800,
        height: 800,
        square: true,
      });
      thumb = await applyDarkGrade(bytes, {
        width: 320,
        height: 320,
        square: true,
      });
    } else {
      landscape = await sharp(bytes)
        .rotate()
        .resize(1600, 1067, { fit: "cover", position: "attention" })
        .webp({ quality: 84 })
        .toBuffer();
      square = await sharp(bytes)
        .rotate()
        .resize(800, 800, { fit: "cover", position: "attention" })
        .webp({ quality: 84 })
        .toBuffer();
      thumb = await sharp(bytes)
        .rotate()
        .resize(320, 320, { fit: "cover", position: "attention" })
        .webp({ quality: 82 })
        .toBuffer();
    }

    const stored = await storeMenuOverrideImages({
      itemId,
      landscape,
      square,
      thumb,
    });

    const isCustom = !staticItemById(itemId);
    const override = isCustom
      ? await updateCustomMenuItem(itemId, {
          imagePath: stored.imagePath,
          imageSquarePath: stored.imageSquarePath,
          imageThumbPath: stored.imageThumbPath,
          imageSource: stored.imageSource,
        })
      : await upsertMenuOverride({
          itemId,
          imagePath: stored.imagePath,
          imageSquarePath: stored.imageSquarePath,
          imageThumbPath: stored.imageThumbPath,
          imageSource: stored.imageSource,
        });

    revalidateMenuCache();
    const bust = `v=${Date.now()}`;
    return NextResponse.json({
      override,
      imagePath: `${stored.imagePath}${stored.imagePath.includes("?") ? "&" : "?"}${bust}`,
      imageSquarePath: stored.imageSquarePath,
      imageThumbPath: stored.imageThumbPath,
      imageSource: stored.imageSource,
    });
  } catch (error) {
    console.error("[admin/menu/:itemId/image]", error);
    const message =
      error instanceof Error ? error.message : "Image upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Remove uploaded photo → fall back to stock. */
export async function DELETE(request: Request, context: RouteContext) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { itemId } = await context.params;
  if (!(await isKnownMenuItemId(itemId))) {
    return NextResponse.json({ error: "Unknown menu item." }, { status: 404 });
  }

  const isCustom = !staticItemById(itemId);
  const override = isCustom
    ? await updateCustomMenuItem(itemId, {
        imagePath: null,
        imageSquarePath: null,
        imageThumbPath: null,
        imageSource: null,
      })
    : await upsertMenuOverride({
        itemId,
        imagePath: null,
        imageSquarePath: null,
        imageThumbPath: null,
        imageSource: null,
      });

  revalidateMenuCache();
  return NextResponse.json({ override });
}
