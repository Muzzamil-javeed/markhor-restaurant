"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useResolvedMenuImage } from "@/components/menu/menu-image-map-provider";
import { getItemImage } from "@/data/images";
import { menuPhotoSlugs, stockImageForSlug } from "@/data/menu-photos";
import { slugify } from "@/data/slug";
import { cn } from "@/lib/cn";

type MenuImageProps = {
  name: string;
  slug?: string;
  /** Static menu id (usually same as slug). Helps resolve admin uploads. */
  itemId?: string;
  /** Admin / runtime override (uploaded). */
  imageSrc?: string | null;
  imageSquareSrc?: string | null;
  imageThumbSrc?: string | null;
  className?: string;
  rounded?: string;
  /** 16:10 cards / modal, 1:1 thumbs */
  ratio?: "card" | "square";
  priority?: boolean;
  sizes?: string;
  /** Soft bottom vignette (default on). Turn off for light cards. */
  overlay?: boolean;
};

/**
 * Dish photo: admin upload → stock webp → legacy jpg → stock dark.
 */
export function MenuImage({
  name,
  slug,
  itemId,
  imageSrc,
  imageSquareSrc,
  imageThumbSrc,
  className,
  rounded = "rounded-2xl",
  ratio = "card",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  overlay = true,
}: MenuImageProps) {
  const resolvedSlug = slug ?? slugify(name);
  const resolvedId = itemId ?? resolvedSlug;
  const upload = useResolvedMenuImage({
    id: resolvedId,
    slug: resolvedSlug,
    imageSrc,
    imageSquareSrc,
    imageThumbSrc,
  });

  const image = getItemImage({
    slug: resolvedSlug,
    name,
    imageSrc: upload?.imageSrc,
    imageSquareSrc: upload?.imageSquareSrc,
    imageThumbSrc: upload?.imageThumbSrc,
    hasStockWebp: true,
  });
  const [attempt, setAttempt] = useState(0);

  const candidates = useMemo(() => {
    const preferred =
      ratio === "square"
        ? image.thumb || image.square || image.src
        : image.src;
    const list = [preferred];
    if (upload?.imageSrc) {
      if (upload.imageSquareSrc) list.push(upload.imageSquareSrc);
      if (upload.imageThumbSrc) list.push(upload.imageThumbSrc);
      // Legacy fixed override paths (pre unique-stamp uploads).
      list.push(`/images/menu/overrides/${resolvedId}.webp`);
      list.push(`/images/menu/overrides/${resolvedSlug}.webp`);
    }
    if (menuPhotoSlugs.has(resolvedSlug)) {
      list.push(`/images/menu/${resolvedSlug}.jpg`);
    }
    list.push(stockImageForSlug(resolvedSlug));
    return [...new Set(list.filter(Boolean))];
  }, [image.src, image.square, image.thumb, upload, ratio, resolvedSlug]);

  const src = candidates[Math.min(attempt, candidates.length - 1)]!;

  return (
    <div
      className={cn(
        "group/menu-image relative overflow-hidden bg-[#1A1112]",
        "ring-1 ring-inset ring-[rgba(246,244,242,0.08)]",
        ratio === "square" ? "aspect-square" : "aspect-[16/10]",
        rounded,
        className,
      )}
    >
      <Image
        key={src}
        src={src}
        alt={image.alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-500 ease-out group-hover/menu-image:scale-[1.04]"
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        placeholder={image.blurDataURL ? "blur" : "empty"}
        blurDataURL={image.blurDataURL}
        onError={() =>
          setAttempt((current) =>
            current < candidates.length - 1 ? current + 1 : current,
          )
        }
      />
      {overlay ? (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140D0E]/70 via-[#140D0E]/15 to-transparent"
          aria-hidden
        />
      ) : null}
    </div>
  );
}
