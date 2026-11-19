"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  lookupMenuImage,
  type MenuImageEntry,
  type MenuImageMap,
} from "@/lib/menu-image-map-types";

const MenuImageMapContext = createContext<MenuImageMap>({});

export function MenuImageMapProvider({
  map,
  children,
}: {
  map: MenuImageMap;
  children: ReactNode;
}) {
  const value = useMemo(() => map ?? {}, [map]);
  return (
    <MenuImageMapContext.Provider value={value}>
      {children}
    </MenuImageMapContext.Provider>
  );
}

export function useMenuImageMap(): MenuImageMap {
  return useContext(MenuImageMapContext);
}

/**
 * Resolve admin upload for a dish.
 * Live map wins over sticky props (e.g. cart localStorage) so Replace updates everywhere.
 */
export function useResolvedMenuImage(input: {
  id?: string | null;
  slug?: string | null;
  imageSrc?: string | null;
  imageSquareSrc?: string | null;
  imageThumbSrc?: string | null;
}): MenuImageEntry | null {
  const map = useMenuImageMap();
  return useMemo(() => {
    const fromMap = lookupMenuImage(map, { id: input.id, slug: input.slug });
    if (fromMap) return fromMap;
    if (input.imageSrc?.trim()) {
      return {
        imageSrc: input.imageSrc.trim(),
        imageSquareSrc: input.imageSquareSrc ?? null,
        imageThumbSrc: input.imageThumbSrc ?? null,
      };
    }
    return null;
  }, [
    input.id,
    input.slug,
    input.imageSrc,
    input.imageSquareSrc,
    input.imageThumbSrc,
    map,
  ]);
}
