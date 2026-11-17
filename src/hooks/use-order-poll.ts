"use client";

import { useCallback, useEffect, useState } from "react";
import type { PublicOrder } from "@/lib/order-public";

const POLL_MS = 15_000;

export function useOrderPoll(input: {
  code: string;
  token?: string | null;
  phone?: string | null;
  enabled?: boolean;
}) {
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!input.code) return;
    if (!input.token && !input.phone) {
      setError("Missing tracking details.");
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams();
      if (input.token) params.set("token", input.token);
      if (input.phone) params.set("phone", input.phone);

      const response = await fetch(
        `/api/orders/${encodeURIComponent(input.code)}?${params.toString()}`,
        { cache: "no-store" },
      );
      const data = (await response.json()) as {
        order?: PublicOrder;
        error?: string;
      };

      if (!response.ok || !data.order) {
        setError(data.error ?? "Could not load this order.");
        setOrder(null);
        return;
      }

      setOrder(data.order);
      setError(null);
    } catch {
      setError("Network error — retrying…");
    } finally {
      setLoading(false);
    }
  }, [input.code, input.token, input.phone]);

  useEffect(() => {
    if (input.enabled === false) return;

    // Defer so the effect itself does not synchronously setState.
    const boot = window.setTimeout(() => {
      void load();
    }, 0);
    const id = window.setInterval(() => {
      void load();
    }, POLL_MS);

    return () => {
      window.clearTimeout(boot);
      window.clearInterval(id);
    };
  }, [load, input.enabled]);

  return { order, error, loading, refresh: load };
}
