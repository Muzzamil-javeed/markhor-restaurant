"use client";

import { create } from "zustand";
import type { MenuItem } from "@/data/menu-types";

type CustomiseState = {
  itemId: string | null;
  itemSnapshot: MenuItem | null;
  open: (itemId: string, item?: MenuItem) => void;
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
