"use client";

import { useSyncExternalStore } from "react";
import { useCartStore } from "@/store/cart";

/** Avoid SSR/localStorage mismatch for cart badges. */
export function useCartHydration() {
  return useSyncExternalStore(
    (onStoreChange) => useCartStore.persist.onFinishHydration(onStoreChange),
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
}
