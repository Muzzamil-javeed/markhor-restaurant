"use client";

import { create } from "zustand";
import type { MenuItem } from "@/data/menu-types";

/** MenuItem plus optional admin upload paths from getRuntimeMenu. */
type CustomiseItem = MenuItem & {
  imageSrc?: string | null;
  imageSquareSrc?: string | null;
  imageThumbSrc?: string | null;
};

type CustomiseState = {
  itemId: string | null;
  itemSnapshot: CustomiseItem | null;
  open: (itemId: string, item?: CustomiseItem) => void;
  close: () => void;
};

/** Controls the item customise sheet (Module 6). */
export const useCustomiseStore = create<CustomiseState>((set) => ({
  itemId: null,
  itemSnapshot: null,
  open: (itemId, item) =>
    set({ itemId, itemSnapshot: item ?? null }),
  close: () => set({ itemId: null, itemSnapshot: null }),
}));
