import { menu } from "@/data/menu";
import { imageQueries } from "@/data/image-queries";
import { stockImageForSlug } from "@/data/menu-photos";
import blurMap from "@/data/image-blur.json";

export type ImageSource = "uploaded" | "stock" | "fallback" | "gradient";

export type ItemImage = {
  src: string;
  square: string;
  thumb: string;
  blurDataURL?: string;
  alt: string;
  source: ImageSource;
};

type BlurEntry = { blur: string; photoId?: number | string };

const blurBySlug = blurMap as Record<string, BlurEntry>;

/** Brand gradient when nothing else exists. */
export const BRAND_GRADIENT =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="533" viewBox="0 0 800 533">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1A1112"/>
          <stop offset="55%" stop-color="#5E0F1D"/>
          <stop offset="100%" stop-color="#140D0E"/>
        </linearGradient>
      </defs>
      <rect width="800" height="533" fill="url(#g)"/>
    </svg>`,
  );

export function allMenuSlugs(): string[] {
  return menu.flatMap((category) => category.items.map((item) => item.slug));
}

export function altForDish(name: string): string {
  return name;
}

function stockPaths(slug: string) {
  const base = `/images/menu/${slug}`;
  return {
    src: `${base}.webp`,
    square: `${base}-sq.webp`,
    thumb: `${base}-thumb.webp`,
  };
}

/**
 * Resolve display images for a dish.
 * uploaded (DB) → stock webp → legacy jpg → hashed stock dark → gradient
 */
export function getItemImage(input: {
  slug: string;
  name: string;
  imageSrc?: string | null;
  imageSquareSrc?: string | null;
  imageThumbSrc?: string | null;
  hasStockWebp?: boolean;
}): ItemImage {
  const alt = altForDish(input.name);
  const blur = blurBySlug[input.slug]?.blur;

  if (input.imageSrc?.trim()) {
    const src = input.imageSrc.trim();
    return {
      src,
      square: input.imageSquareSrc?.trim() || src,
      thumb: input.imageThumbSrc?.trim() || src,
      blurDataURL: blur,
      alt,
      source: "uploaded",
    };
  }

  if (input.hasStockWebp || imageQueries[input.slug]) {
    const paths = stockPaths(input.slug);
    return {
      ...paths,
      blurDataURL: blur,
      alt,
      source: "stock",
    };
  }

  const fallback = stockImageForSlug(input.slug);
  return {
    src: fallback,
    square: fallback,
    thumb: fallback,
    blurDataURL: blur,
    alt,
    source: "fallback",
  };
}

/** True when a slug has a query mapping (required for stock pipeline). */
export function hasImageQuery(slug: string): boolean {
  return Boolean(imageQueries[slug]);
}
