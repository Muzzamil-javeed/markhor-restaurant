"use client";

import Image from "next/image";
import { menuPhotoSlugs, stockImageForSlug } from "@/data/menu-photos";
import { slugify } from "@/data/slug";
import { cn } from "@/lib/cn";

type MenuImageProps = {
  name: string;
  slug?: string;
  /** Admin / runtime override path. */
  imageSrc?: string | null;
  className?: string;
  rounded?: string;
  /** Eager-load above-the-fold images. */
  priority?: boolean;
};

/**
 * Real menu photo when registered; otherwise a dark stock food plate.
 * Never shows a letter placeholder.
 */
export function MenuImage({
  name,
  slug,
  imageSrc,
  className,
  rounded = "rounded-2xl",
  priority = false,
}: MenuImageProps) {
  const resolvedSlug = slug ?? slugify(name);
  const src =
    imageSrc?.trim() ||
    (menuPhotoSlugs.has(resolvedSlug)
      ? `/images/menu/${resolvedSlug}.jpg`
      : stockImageForSlug(resolvedSlug));

  return (
    <div
      className={cn(
        "relative aspect-[4/3] overflow-hidden bg-[#1a0c0e]",
        rounded,
        className,
      )}
    >
      <Image
        key={src}
        src={src}
        alt={name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover"
        priority={priority}
        loading={priority ? "eager" : "lazy"}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140D0E]/45 via-transparent to-transparent"
        aria-hidden
      />
    </div>
  );
}
