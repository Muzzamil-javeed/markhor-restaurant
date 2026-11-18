import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

/**
 * Persist a resized menu JPEG.
 * - Local: write under /public (writable disk)
 * - Vercel: Vercel Blob (serverless FS is read-only)
 */
export async function storeMenuOverrideImage(input: {
  itemId: string;
  jpeg: Buffer;
}): Promise<string> {
  const safeName = input.itemId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `${safeName}.jpg`;
  const pathname = `menu/overrides/${filename}`;

  const hasBlob =
    Boolean(process.env.BLOB_READ_WRITE_TOKEN) ||
    Boolean(process.env.VERCEL && process.env.BLOB_STORE_ID);

  if (hasBlob) {
    const blob = await put(pathname, input.jpeg, {
      access: "public",
      contentType: "image/jpeg",
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
      "Image uploads on Vercel need a connected Blob store (BLOB_STORE_ID / BLOB_READ_WRITE_TOKEN). Connect markhor-restaurant-blob to this project and redeploy.",
    );
  }

  const dir = path.join(
    process.cwd(),
    "public",
    "images",
    "menu",
    "overrides",
  );
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), input.jpeg);
  return `/images/menu/overrides/${filename}`;
}
