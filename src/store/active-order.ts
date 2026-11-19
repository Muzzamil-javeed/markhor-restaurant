"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ActiveOrderRecord = {
  code: string;
  trackingToken: string;
  savedAt: number;
};

type ActiveOrderState = {
  active: ActiveOrderRecord | null;
  setActive: (input: { code: string; trackingToken: string }) => void;
  clear: () => void;
};

export const useActiveOrderStore = create<ActiveOrderState>()(
  persist(
    (set) => ({
      active: null,
      setActive: ({ code, trackingToken }) =>
        set({
          active: {
            code: code.trim().toUpperCase(),
            trackingToken: trackingToken.trim(),
            savedAt: Date.now(),
          },
        }),
      clear: () => set({ active: null }),
    }),
    { name: "markhor-active-order" },
  ),
);
