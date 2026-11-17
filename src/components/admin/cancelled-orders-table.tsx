"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, RefreshCw } from "lucide-react";
import type { AdminOrder } from "@/lib/admin-orders";
import { cn } from "@/lib/cn";

function menuLabel(order: AdminOrder): string {
  return order.items
    .map((item) => `${item.quantity}× ${item.name}`)
    .join(", ");
}

export function CancelledOrdersTable() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/orders?status=cancelled&take=100", {
        cache: "no-store",
      });
      if (response.status === 401) {
        router.replace("/admin/login?next=/admin/orders/cancelled");
        return;
      }
      const data = (await response.json()) as {
        orders?: AdminOrder[];
        error?: string;
      };
      if (!response.ok || !data.orders) {
        setError(data.error ?? "Could not load cancelled orders.");
        return;
      }
      setOrders(data.orders);
      setError(null);
    } catch {
      setError("Network error — try refresh.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(id);
  }, [load]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-eyebrow text-[10px] font-semibold tracking-[0.18em] text-brand uppercase">
            Archive
          </p>
          <h1 className="font-display mt-1 text-3xl tracking-tight text-ink uppercase">
            Cancelled orders
          </h1>
          <p className="mt-1 text-sm text-muted">
            Order ID, customer, menu items, and cancel reason.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setRefreshing(true);
            void load();
          }}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink transition-colors hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          <RefreshCw
            className={cn("size-4", refreshing && "animate-spin")}
            aria-hidden
          />
          Refresh
        </button>
      </div>

      {error ? (
        <p
          className="rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_10px_28px_rgba(36,26,27,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="bg-[#faf7f5]">
              <tr className="border-b border-line">
                <th className="px-4 py-3 font-heading text-xs font-semibold tracking-wide text-ink uppercase">
                  Order ID
                </th>
                <th className="px-4 py-3 font-heading text-xs font-semibold tracking-wide text-ink uppercase">
                  Name
                </th>
                <th className="px-4 py-3 font-heading text-xs font-semibold tracking-wide text-ink uppercase">
                  Menu
                </th>
                <th className="px-4 py-3 font-heading text-xs font-semibold tracking-wide text-ink uppercase">
                  Reason
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-muted"
                  >
                    Loading cancelled orders…
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-14 text-center">
                    <span className="inline-flex flex-col items-center gap-2 text-muted">
                      <Ban className="size-6 text-brand/50" aria-hidden />
                      No cancelled orders yet.
                    </span>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-line last:border-b-0 transition-colors hover:bg-tint/40"
                  >
                    <td className="px-4 py-3.5 align-top font-heading font-semibold text-ink">
                      {order.code}
                    </td>
                    <td className="px-4 py-3.5 align-top text-ink">
                      <span className="font-medium">{order.customerName}</span>
                      <span className="mt-0.5 block text-xs text-muted">
                        {order.phone}
                      </span>
                    </td>
                    <td className="max-w-xs px-4 py-3.5 align-top text-ink">
                      <span className="line-clamp-3">{menuLabel(order)}</span>
                    </td>
                    <td className="max-w-sm px-4 py-3.5 align-top text-muted">
                      {order.cancelReason?.trim() || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
