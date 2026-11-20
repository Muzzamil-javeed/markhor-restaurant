/**
 * Download admin-uploaded menu photos from Vercel Blob (or any https URL)
 * into public/images/menu/overrides/, then rewrite DB paths to local /images/...
 *
 *   npx tsx scripts/export-blob-images.ts
 *   npx tsx scripts/export-blob-images.ts --dry-run
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { Pool } from "pg";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });
loadEnv({ path: ".env.vercel" });

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "images", "menu", "overrides");
const dryRun = process.argv.includes("--dry-run");

type Row = {
  kind: "override" | "custom";
  id: string;
  imagePath: string | null;
  imageSquarePath: string | null;
  imageThumbPath: string | null;
};

function normalizeDatabaseUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const mode = parsed.searchParams.get("sslmode");
    if (mode === "require" || mode === "prefer" || mode === "verify-ca") {
      parsed.searchParams.set("sslmode", "verify-full");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function isRemote(url: string | null | undefined): url is string {
  return Boolean(url && /^https?:\/\//i.test(url));
}

function safeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function extensionFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.(webp|jpe?g|png)$/i);
    if (!match) return ".webp";
    const ext = match[1]!.toLowerCase();
    return ext === "jpeg" ? ".jpg" : `.${ext}`;
  } catch {
    return ".webp";
  }
}

async function download(url: string, destAbs: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  await mkdir(path.dirname(destAbs), { recursive: true });
  await writeFile(destAbs, buffer);
}

async function main() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL is not set.");

  const pool = new Pool({
    connectionString: normalizeDatabaseUrl(raw),
    max: 2,
    connectionTimeoutMillis: 20_000,
  });

  try {
    const overrides = await pool.query<{
      itemId: string;
      imagePath: string | null;
      imageSquarePath: string | null;
      imageThumbPath: string | null;
    }>(
      `SELECT "itemId", "imagePath", "imageSquarePath", "imageThumbPath"
       FROM "MenuOverride"
       WHERE "imagePath" IS NOT NULL
          OR "imageSquarePath" IS NOT NULL
          OR "imageThumbPath" IS NOT NULL`,
    );

    const customs = await pool.query<{
      id: string;
      imagePath: string | null;
      imageSquarePath: string | null;
      imageThumbPath: string | null;
    }>(
      `SELECT id, "imagePath", "imageSquarePath", "imageThumbPath"
       FROM "MenuCustomItem"
       WHERE "imagePath" IS NOT NULL
          OR "imageSquarePath" IS NOT NULL
          OR "imageThumbPath" IS NOT NULL`,
    );

    const rows: Row[] = [
      ...overrides.rows.map((row) => ({
        kind: "override" as const,
        id: row.itemId,
        imagePath: row.imagePath,
        imageSquarePath: row.imageSquarePath,
        imageThumbPath: row.imageThumbPath,
      })),
      ...customs.rows.map((row) => ({
        kind: "custom" as const,
        id: row.id,
        imagePath: row.imagePath,
        imageSquarePath: row.imageSquarePath,
        imageThumbPath: row.imageThumbPath,
      })),
    ];

    console.log(`Found ${rows.length} menu rows with image fields.`);
    await mkdir(OUT_DIR, { recursive: true });

    let downloaded = 0;
    let rewritten = 0;
    let skipped = 0;
    let failed = 0;

    for (const row of rows) {
      const base = safeId(row.id);
      const targets: {
        field: "imagePath" | "imageSquarePath" | "imageThumbPath";
        url: string | null;
        suffix: string;
      }[] = [
        { field: "imagePath", url: row.imagePath, suffix: "" },
        { field: "imageSquarePath", url: row.imageSquarePath, suffix: "-sq" },
        { field: "imageThumbPath", url: row.imageThumbPath, suffix: "-thumb" },
      ];

      const next: Record<string, string | null> = {
        imagePath: row.imagePath,
        imageSquarePath: row.imageSquarePath,
        imageThumbPath: row.imageThumbPath,
      };

      let changed = false;

      for (const target of targets) {
        if (!target.url) continue;

        if (!isRemote(target.url)) {
          // Already local — leave as-is.
          skipped += 1;
          continue;
        }

        const ext = extensionFromUrl(target.url);
        const file = `${base}${target.suffix}${ext}`;
        const publicPath = `/images/menu/overrides/${file}`;
        const abs = path.join(OUT_DIR, file);
        try {
          if (dryRun) {
            console.log(`[dry-run] ${target.url} → ${publicPath}`);
          } else {
            await download(target.url, abs);
            console.log(`✓ ${row.kind}:${row.id} → ${file}`);
          }
          next[target.field] = publicPath;
          changed = true;
          downloaded += 1;
        } catch (error) {
          failed += 1;
          console.error(
            `✗ ${row.kind}:${row.id} ${target.field}:`,
            error instanceof Error ? error.message : error,
          );
        }
      }

      if (!changed || dryRun) continue;

      if (row.kind === "override") {
        await pool.query(
          `UPDATE "MenuOverride"
           SET "imagePath" = $2,
               "imageSquarePath" = $3,
               "imageThumbPath" = $4,
               "imageSource" = 'uploaded',
               "updatedAt" = NOW()
           WHERE "itemId" = $1`,
          [row.id, next.imagePath, next.imageSquarePath, next.imageThumbPath],
        );
      } else {
        await pool.query(
          `UPDATE "MenuCustomItem"
           SET "imagePath" = $2,
               "imageSquarePath" = $3,
               "imageThumbPath" = $4,
               "imageSource" = 'uploaded',
               "updatedAt" = NOW()
           WHERE id = $1`,
          [row.id, next.imagePath, next.imageSquarePath, next.imageThumbPath],
        );
      }
      rewritten += 1;
    }

    console.log(
      JSON.stringify(
        { dryRun, downloaded, rewritten, skipped, failed, outDir: OUT_DIR },
        null,
        2,
      ),
    );
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
