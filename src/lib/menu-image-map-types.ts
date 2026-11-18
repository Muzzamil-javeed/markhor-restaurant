export type MenuImageEntry = {
  imageSrc: string;
  imageSquareSrc?: string | null;
  imageThumbSrc?: string | null;
};

/** itemId + slug → admin-uploaded paths */
export type MenuImageMap = Record<string, MenuImageEntry>;

export function lookupMenuImage(
  map: MenuImageMap,
  keys: { id?: string | null; slug?: string | null },
): MenuImageEntry | null {
  if (keys.id && map[keys.id]) return map[keys.id]!;
  if (keys.slug && map[keys.slug]) return map[keys.slug]!;
  return null;
}
