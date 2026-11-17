"use client";

import { useSyncExternalStore } from "react";
import { getNextOpenLabel, getOpenStatus } from "@/lib/hours";

function subscribe(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 60_000);
  window.addEventListener("focus", onStoreChange);
  return () => {
    window.clearInterval(id);
    window.removeEventListener("focus", onStoreChange);
  };
}

/** Client-only open status; SSR snapshot is null to avoid timezone mismatch. */
export function useOpenNow(): {
  ready: boolean;
  isOpen: boolean;
  closedMessage: string;
} {
  const label = useSyncExternalStore(
    subscribe,
    () => getOpenStatus().label,
    () => null,
  );
  const closedMessage = useSyncExternalStore(
    subscribe,
    () => getNextOpenLabel(),
    () => "We open at 12:30 PM",
  );

  return {
    ready: label !== null,
    isOpen: label === "Open",
    closedMessage,
  };
}
