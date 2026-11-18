import sharp from "sharp";
import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin-auth";
import { revalidateMenuCache } from "@/lib/menu-cache";
import { storeMenuOverrideImage } from "@/lib/menu-image-storage";
import {
  isKnownMenuItemId,
  staticItemById,
  updateCustomMenuItem,
  upsertMenuOverride,
} from "@/lib/menu-runtime";

type RouteContext = {
  params: Promise<{ itemId: string }>;
};

const MAX_BYTES = 4 * 1024 * 1024;
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
      { error: "Image must be under 4MB." },
      { status: 400 },
    );
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const jpeg = await sharp(bytes)
      .rotate()
      .resize(1200, 900, { fit: "cover" })
      .jpeg({ quality: 84 })
      .toBuffer();

    const imagePath = await storeMenuOverrideImage({ itemId, jpeg });
    const isCustom = !staticItemById(itemId);
    const override = isCustom
      ? await updateCustomMenuItem(itemId, { imagePath })
      : await upsertMenuOverride({ itemId, imagePath });

    revalidateMenuCache();
    return NextResponse.json({
      override,
      imagePath: `${imagePath}${imagePath.includes("?") ? "&" : "?"}v=${Date.now()}`,
    });
  } catch (error) {
    console.error("[admin/menu/:itemId/image]", error);
    const message =
      error instanceof Error ? error.message : "Image upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
