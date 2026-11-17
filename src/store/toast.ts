"use client";

import { create } from "zustand";

type ToastState = {
  message: string | null;
  show: (message: string) => void;
  clear: () => void;
};

let clearTimer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  show: (message) => {
    if (clearTimer) clearTimeout(clearTimer);
    set({ message });
    clearTimer = setTimeout(() => set({ message: null }), 2200);
  },
  clear: () => {
    if (clearTimer) clearTimeout(clearTimer);
    set({ message: null });
  },
}));
