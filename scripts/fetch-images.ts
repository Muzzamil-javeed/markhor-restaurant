/**
 * Fetch dark-style stock photos for every menu dish (Pexels).
 *
 *   PEXELS_API_KEY=... npm run images
 *   npm run images -- --force   # re-download
 *   npm run images -- --slug=beef-brisket
 *
 * Outputs under public/images/menu/:
 *   <slug>.webp (1600×1067), <slug>-sq.webp (800), <slug>-thumb.webp (320)
 * Blur map: src/data/image-blur.json
 * Credits: public/images/CREDITS.md
 */

import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { menu } from "../src/data/menu";
import {
  CATEGORY_FALLBACK_QUERY,
  imageQueries,
  sharedGroupForSlug,
} from "../src/data/image-queries";
import {
  applyDarkGrade,
  meanLuminance,
  toBlurPlaceholder,
} from "./lib/dark-grade";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "images", "menu");
const STATE_PATH = path.join(ROOT, ".cache", "image-fetch-state.json");
const BLUR_PATH = path.join(ROOT, "src", "data", "image-blur.json");
const CREDITS_PATH = path.join(ROOT, "public", "images", "CREDITS.md");
const MANIFEST_PATH = path.join(ROOT, "src", "data", "image-manifest.json");
const LUMINANCE_MAX = 95;
const CANDIDATES = 15;

type Credit = {
  slug: string;
  photoId: number;
  photographer: string;
  url: string;
  source: "pexels";
  sharedGroup?: string | null;
};

type State = {
  usedPhotoIds: number[];
  groupPhotoId: Record<string, number>;
  credits: Credit[];
  done: string[];
  failed: string[];
};

type PexelsPhoto = {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  src: { large2x?: string; large?: string; original?: string };
};

function parseArgs() {
  const force = process.argv.includes("--force");
  const slugArg = process.argv.find((a) => a.startsWith("--slug="));
  const slug = slugArg?.slice("--slug=".length) || null;
  return { force, slug };
}

async function exists(file: string) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function loadState(): Promise<State> {
  try {
    const raw = await readFile(STATE_PATH, "utf8");
    return JSON.parse(raw) as State;
  } catch {
    return {
      usedPhotoIds: [],
      groupPhotoId: {},
      credits: [],
      done: [],
      failed: [],
    };
  }
}

async function saveState(state: State) {
  await mkdir(path.dirname(STATE_PATH), { recursive: true });
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2));
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function pexelsSearch(
  key: string,
  query: string,
  page = 1,
): Promise<PexelsPhoto[]> {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(CANDIDATES));
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("size", "large");
  url.searchParams.set("page", String(page));

  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(url, {
      headers: { Authorization: key },
    });
    if (res.status === 429) {
      const wait = 1500 * 2 ** attempt;
      console.warn(`  rate limited — wait ${wait}ms`);
      await sleep(wait);
      continue;
    }
    if (!res.ok) {
      throw new Error(`Pexels ${res.status}: ${await res.text()}`);
    }
    const data = (await res.json()) as { photos?: PexelsPhoto[] };
    return data.photos ?? [];
  }
  return [];
}

async function download(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function pickPhoto(
  key: string,
  slug: string,
  categoryId: string,
  used: Set<number>,
  allowReuseId?: number,
): Promise<{ photo: PexelsPhoto; buffer: Buffer } | null> {
  if (allowReuseId) {
    // Re-fetch details via search pages is awkward; download from credit url later.
    // For shared groups we store the buffer path from first member.
  }

  const queries = imageQueries[slug];
  const list = [
    queries?.primary,
    queries?.dark,
    queries?.category,
    CATEGORY_FALLBACK_QUERY[categoryId],
    `${slug.replace(/-/g, " ")} dark food`,
  ].filter(Boolean) as string[];

  type Scored = { photo: PexelsPhoto; buffer: Buffer; score: number };
  const scored: Scored[] = [];

  for (const query of list) {
    const photos = await pexelsSearch(key, query);
    for (const photo of photos) {
      if (used.has(photo.id) && photo.id !== allowReuseId) continue;
      const src =
        photo.src.large2x || photo.src.large || photo.src.original || "";
      if (!src) continue;
      try {
        const buffer = await download(src);
        const lum = await meanLuminance(buffer);
        const darkBonus = lum <= LUMINANCE_MAX ? 40 : Math.max(0, 40 - (lum - LUMINANCE_MAX));
        const aspect = photo.width / Math.max(photo.height, 1);
        const aspectScore = Math.abs(aspect - 1.5) < 0.35 ? 10 : 0;
        scored.push({
          photo,
          buffer,
          score: darkBonus + aspectScore - lum * 0.05,
        });
      } catch {
        /* skip bad download */
      }
    }
    if (scored.some((s) => s.score >= 35)) break;
  }

  scored.sort((a, b) => b.score - a.score);
  return scored[0] ? { photo: scored[0].photo, buffer: scored[0].buffer } : null;
}

async function writeOutputs(slug: string, buffer: Buffer, applyGrade: boolean) {
  const graded = applyGrade ? await applyDarkGrade(buffer) : buffer;
  const landscape = applyGrade
    ? graded
    : await applyDarkGrade(buffer, { width: 1600, height: 1067 });
  const square = await applyDarkGrade(buffer, {
    width: 800,
    height: 800,
    square: true,
  });
  const thumb = await applyDarkGrade(buffer, {
    width: 320,
    height: 320,
    square: true,
  });

  await writeFile(path.join(OUT_DIR, `${slug}.webp`), landscape);
  await writeFile(path.join(OUT_DIR, `${slug}-sq.webp`), square);
  await writeFile(path.join(OUT_DIR, `${slug}-thumb.webp`), thumb);

  return toBlurPlaceholder(landscape);
}

async function main() {
  const { force, slug: onlySlug } = parseArgs();
  const key = process.env.PEXELS_API_KEY?.trim();

  if (!key) {
    console.error(`
PEXELS_API_KEY is not set.

Get a free key: https://www.pexels.com/api/
Add to .env:
  PEXELS_API_KEY=your_key_here

Then run: npm run images
`);
    process.exit(0);
  }

  await mkdir(OUT_DIR, { recursive: true });
  const state = await loadState();
  const used = new Set<number>(state.usedPhotoIds);
  const blurMap: Record<string, { blur: string; photoId: number }> = {};
  try {
    Object.assign(blurMap, JSON.parse(await readFile(BLUR_PATH, "utf8")));
  } catch {
    /* empty */
  }

  const items = menu.flatMap((category) =>
    category.items.map((item) => ({
      slug: item.slug,
      name: item.name,
      categoryId: category.id,
    })),
  );

  const queue = onlySlug
    ? items.filter((i) => i.slug === onlySlug)
    : items;

  let done = 0;
  let skipped = 0;
  let failed = 0;

  console.log(`Fetching ${queue.length} dishes → ${OUT_DIR}`);

  // First pass: non-shared, then shared groups can copy
  for (const item of queue) {
    const outMain = path.join(OUT_DIR, `${item.slug}.webp`);
    const group = sharedGroupForSlug(item.slug);

    if (!force && (await exists(outMain))) {
      console.log(`skip  ${item.slug} (exists)`);
      skipped++;
      if (!state.done.includes(item.slug)) state.done.push(item.slug);
      continue;
    }

    // Uploaded owner files: if .uploaded marker exists, never overwrite
    if (await exists(path.join(OUT_DIR, `${item.slug}.uploaded`))) {
      console.log(`skip  ${item.slug} (owner uploaded)`);
      skipped++;
      continue;
    }

    try {
      let allowReuse: number | undefined;
      if (group && state.groupPhotoId[group]) {
        allowReuse = state.groupPhotoId[group];
      }

      // Shared group: copy from first completed member if we already have files
      if (group && allowReuse && !force) {
        const donor = state.credits.find((c) => c.photoId === allowReuse);
        if (donor && (await exists(path.join(OUT_DIR, `${donor.slug}.webp`)))) {
          const buf = await readFile(path.join(OUT_DIR, `${donor.slug}.webp`));
          // Re-grade from original is better; for shared we re-download once per group in first member
          const blur = await toBlurPlaceholder(buf);
          await writeFile(path.join(OUT_DIR, `${item.slug}.webp`), buf);
          const sq = await readFile(path.join(OUT_DIR, `${donor.slug}-sq.webp`)).catch(() => null);
          const th = await readFile(path.join(OUT_DIR, `${donor.slug}-thumb.webp`)).catch(() => null);
          if (sq) await writeFile(path.join(OUT_DIR, `${item.slug}-sq.webp`), sq);
          if (th) await writeFile(path.join(OUT_DIR, `${item.slug}-thumb.webp`), th);
          blurMap[item.slug] = { blur, photoId: allowReuse };
          state.credits = state.credits.filter((c) => c.slug !== item.slug);
          state.credits.push({
            slug: item.slug,
            photoId: allowReuse,
            photographer: donor.photographer,
            url: donor.url,
            source: "pexels",
            sharedGroup: group,
          });
          console.log(`share ${item.slug} ← ${donor.slug}`);
          done++;
          state.done.push(item.slug);
          await saveState(state);
          continue;
        }
      }

      const picked = await pickPhoto(
        key,
        item.slug,
        item.categoryId,
        used,
        allowReuse,
      );
      if (!picked) {
        console.error(`fail  ${item.slug} — no candidate`);
        failed++;
        state.failed.push(item.slug);
        await saveState(state);
        continue;
      }

      const blur = await writeOutputs(item.slug, picked.buffer, true);
      used.add(picked.photo.id);
      state.usedPhotoIds = [...used];
      if (group) state.groupPhotoId[group] = picked.photo.id;
      blurMap[item.slug] = { blur, photoId: picked.photo.id };
      state.credits = state.credits.filter((c) => c.slug !== item.slug);
      state.credits.push({
        slug: item.slug,
        photoId: picked.photo.id,
        photographer: picked.photo.photographer,
        url: picked.photo.url,
        source: "pexels",
        sharedGroup: group,
      });
      if (!state.done.includes(item.slug)) state.done.push(item.slug);
      state.failed = state.failed.filter((s) => s !== item.slug);
      console.log(
        `done  ${item.slug}  photo=${picked.photo.id}  by ${picked.photo.photographer}`,
      );
      done++;
      await saveState(state);
      await sleep(350);
    } catch (error) {
      console.error(`fail  ${item.slug}`, error);
      failed++;
      if (!state.failed.includes(item.slug)) state.failed.push(item.slug);
      await saveState(state);
    }
  }

  await writeFile(BLUR_PATH, JSON.stringify(blurMap, null, 2));
  await writeFile(
    MANIFEST_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        credits: state.credits,
        groupPhotoId: state.groupPhotoId,
      },
      null,
      2,
    ),
  );

  const lines = [
    "# Menu image credits (Pexels)",
    "",
    "Temporary licensed stock photos. Replace from admin when ready.",
    "",
    "| Dish | Photo ID | Photographer | Link |",
    "| --- | --- | --- | --- |",
    ...state.credits
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map(
        (c) =>
          `| ${c.slug} | ${c.photoId} | ${c.photographer} | [Pexels](${c.url}) |`,
      ),
    "",
  ];
  await writeFile(CREDITS_PATH, lines.join("\n"));

  console.log("\n—— Summary ——");
  console.log(`done: ${done}  skipped: ${skipped}  failed: ${failed}`);
  console.log(`blur → ${BLUR_PATH}`);
  console.log(`credits → ${CREDITS_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
