/**
 * Offline dark dummy photos for every menu dish (no Pexels key needed).
 *
 * - Uses existing public/images/menu/<slug>.jpg when present (graded)
 * - Otherwise cycles dark stock plates + dish-name overlay
 * - Shared groups (sauces/drinks/etc.) share the same base plate
 *
 *   npm run images:dummy
 *   npm run images:dummy -- --force
 */

import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { menu } from "../src/data/menu";
import { sharedGroupForSlug } from "../src/data/image-queries";
import {
  applyDarkGrade,
  toBlurPlaceholder,
} from "../src/lib/dark-grade";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "images", "menu");
const STOCK = path.join(ROOT, "public", "images", "stock");
const BLUR = path.join(ROOT, "src", "data", "image-blur.json");

const force = process.argv.includes("--force");

async function exists(file: string) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h + slug.charCodeAt(i) * (i + 1)) % 997;
  return h;
}

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function titleOverlay(name: string, w: number, h: number) {
  const lines = name.length > 28 ? [name.slice(0, 26) + "…"] : [name];
  const y = Math.round(h * 0.78);
  return Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#140D0E" stop-opacity="0"/>
      <stop offset="55%" stop-color="#140D0E" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#140D0E" stop-opacity="0.82"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="${y}" text-anchor="middle" font-family="Georgia, serif" font-size="${Math.round(w * 0.045)}" fill="#F3EADB" opacity="0.92">${escapeXml(lines[0]!)}</text>
  <text x="50%" y="${y + Math.round(h * 0.055)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(w * 0.022)}" fill="#e87830" letter-spacing="4" opacity="0.85">MARKHOR</text>
</svg>`);
}

async function loadStock(index: number): Promise<Buffer> {
  const n = (index % 25) + 1;
  return readFile(path.join(STOCK, `dark-${n}.jpg`));
}

async function writeVariants(
  slug: string,
  base: Buffer,
  name: string,
  opts: { labelOverlay: boolean },
) {
  let landscapeIn = await sharp(base)
    .rotate()
    .resize(1600, 1067, { fit: "cover", position: "attention" })
    .toBuffer();

  // Only stamp name on generic stock plates — never on real dish JPGs
  if (opts.labelOverlay) {
    landscapeIn = await sharp(landscapeIn)
      .composite([{ input: titleOverlay(name, 1600, 1067), blend: "over" }])
      .toBuffer();
  }

  const landscape = await applyDarkGrade(landscapeIn, {
    width: 1600,
    height: 1067,
  });
  const square = await applyDarkGrade(base, {
    width: 800,
    height: 800,
    square: true,
  });
  const thumb = await applyDarkGrade(base, {
    width: 320,
    height: 320,
    square: true,
  });

  await writeFile(path.join(OUT, `${slug}.webp`), landscape);
  await writeFile(path.join(OUT, `${slug}-sq.webp`), square);
  await writeFile(path.join(OUT, `${slug}-thumb.webp`), thumb);

  return toBlurPlaceholder(landscape);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const blurMap: Record<string, { blur: string; source: string }> = {};
  try {
    Object.assign(blurMap, JSON.parse(await readFile(BLUR, "utf8")));
  } catch {
    /* empty */
  }

  const groupBase = new Map<string, Buffer>();
  let done = 0;
  let skipped = 0;

  const items = menu.flatMap((c) =>
    c.items.map((item) => ({ ...item, categoryId: c.id })),
  );

  console.log(`Generating dummy dark images for ${items.length} dishes…`);

  for (const item of items) {
    const out = path.join(OUT, `${item.slug}.webp`);
    if (!force && (await exists(out))) {
      skipped++;
      continue;
    }

    const localJpg = path.join(OUT, `${item.slug}.jpg`);
    let base: Buffer;
    let source: string;
    let labelOverlay = true;

    if (await exists(localJpg)) {
      base = await readFile(localJpg);
      source = "local-jpg";
      labelOverlay = false;
    } else {
      const group = sharedGroupForSlug(item.slug);
      if (group && groupBase.has(group)) {
        base = groupBase.get(group)!;
        source = `shared:${group}`;
      } else {
        const idx = hashSlug(group ?? item.slug);
        base = await loadStock(idx);
        if (group) groupBase.set(group, base);
        source = `stock-dark-${(idx % 25) + 1}`;
      }
    }

    const blur = await writeVariants(item.slug, base, item.name, {
      labelOverlay,
    });
    blurMap[item.slug] = { blur, source };
    done++;
    if (done % 10 === 0) console.log(`  …${done}/${items.length}`);
  }

  await writeFile(BLUR, JSON.stringify(blurMap, null, 2));
  console.log(`\nDone: ${done} written, ${skipped} skipped`);
  console.log(`Blur map → ${BLUR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
