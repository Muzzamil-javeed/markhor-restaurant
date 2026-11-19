"use client";

import { useSyncExternalStore } from "react";
import { useActiveOrderStore } from "@/store/active-order";

/** Avoid SSR/localStorage mismatch for the active-order reminder. */
export function useActiveOrderHydration() {
  return useSyncExternalStore(
    (onStoreChange) =>
      useActiveOrderStore.persist.onFinishHydration(onStoreChange),
    () => useActiveOrderStore.persist.hasHydrated(),
    () => false,
  );
}
