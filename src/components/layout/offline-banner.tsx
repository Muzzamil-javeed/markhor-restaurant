"use client";

import { useEffect, useState } from "react";

/** Cart is localStorage-backed; show a quiet banner when the network drops. */
export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className="border-b border-line bg-tint px-4 py-2 text-center text-sm text-ink"
    >
      You are offline. Your cart stays saved on this device — reconnect to
      checkout.
    </div>
  );
}
