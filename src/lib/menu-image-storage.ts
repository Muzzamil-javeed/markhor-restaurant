import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

export type StoredMenuImages = {
  imagePath: string;
  imageSquarePath: string;
  imageThumbPath: string;
  imageSource: "uploaded";
};

async function putOne(
  pathname: string,
  body: Buffer,
  contentType: string,
): Promise<string> {
  const hasBlob =
    Boolean(process.env.BLOB_READ_WRITE_TOKEN) ||
    Boolean(process.env.VERCEL && process.env.BLOB_STORE_ID);

  if (hasBlob) {
    const blob = await put(pathname, body, {
      access: "public",
      contentType,
      allowOverwrite: true,
      addRandomSuffix: false,
      ...(process.env.BLOB_READ_WRITE_TOKEN
        ? { token: process.env.BLOB_READ_WRITE_TOKEN }
        : {}),
    });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Image uploads on Vercel need a connected Blob store (BLOB_STORE_ID / BLOB_READ_WRITE_TOKEN).",
    );
  }

  const abs = path.join(process.cwd(), "public", pathname);
  await mkdir(path.dirname(abs), { recursive: true });
  await writeFile(abs, body);
  return `/${pathname.replace(/\\/g, "/")}`;
}

/** Persist landscape + square + thumb for an admin upload. */
export async function storeMenuOverrideImages(input: {
  itemId: string;
  landscape: Buffer;
  square: Buffer;
  thumb: Buffer;
}): Promise<StoredMenuImages> {
  const safe = input.itemId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const base = `images/menu/overrides/${safe}`;

  const [imagePath, imageSquarePath, imageThumbPath] = await Promise.all([
    putOne(`${base}.webp`, input.landscape, "image/webp"),
    putOne(`${base}-sq.webp`, input.square, "image/webp"),
    putOne(`${base}-thumb.webp`, input.thumb, "image/webp"),
  ]);

  return {
    imagePath,
    imageSquarePath,
    imageThumbPath,
    imageSource: "uploaded",
  };
}

/** @deprecated single-file helper kept for older callers */
export async function storeMenuOverrideImage(input: {
  itemId: string;
  jpeg: Buffer;
}): Promise<string> {
  const stored = await storeMenuOverrideImages({
    itemId: input.itemId,
    landscape: input.jpeg,
    square: input.jpeg,
    thumb: input.jpeg,
  });
  return stored.imagePath;
}
