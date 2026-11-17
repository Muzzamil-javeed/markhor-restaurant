"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import {
  CheckCircle2,
  ChefHat,
  Inbox,
  Package,
  RefreshCw,
  Truck,
  type LucideProps,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  DailySummary,
  type DailySummaryData,
} from "@/components/admin/daily-summary";
import { AdminOrderCard } from "@/components/admin/order-card";
import { playNewOrderChime } from "@/lib/admin-chime";
import type { AdminOrder } from "@/lib/admin-orders";
import type { OrderStatus } from "@/lib/order-status";
import { useToastStore } from "@/store/toast";
import { cn } from "@/lib/cn";

const COLUMNS: {
  key: OrderStatus;
  label: string;
  Icon: ComponentType<LucideProps>;
}[] = [
  { key: "received", label: "New", Icon: Inbox },
  { key: "preparing", label: "Preparing", Icon: ChefHat },
  { key: "ready", label: "Ready", Icon: Package },
  { key: "out_for_delivery", label: "Out", Icon: Truck },
  { key: "completed", label: "Completed", Icon: CheckCircle2 },
];

const POLL_MS = 10_000;

export function OrdersBoard() {
  const router = useRouter();
  const showToast = useToastStore((state) => state.show);
  const reduce = useReducedMotion();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [summary, setSummary] = useState<DailySummaryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const knownIds = useRef<Set<string> | null>(null);
  const primed = useRef(false);

  const load = useCallback(async () => {
    try {
      const [ordersRes, summaryRes] = await Promise.all([
        fetch("/api/admin/orders?take=100", { cache: "no-store" }),
        fetch("/api/admin/summary", { cache: "no-store" }),
      ]);

      if (ordersRes.status === 401 || summaryRes.status === 401) {
        router.replace("/admin/login?next=/admin/orders");
        return;
      }

      const ordersData = (await ordersRes.json()) as {
        orders?: AdminOrder[];
        error?: string;
      };
      const summaryData = (await summaryRes.json()) as {
        summary?: DailySummaryData;
      };

      if (!ordersRes.ok || !ordersData.orders) {
        setError(ordersData.error ?? "Could not load orders.");
        return;
      }

      const nextOrders = ordersData.orders;
      const nextIds = new Set(nextOrders.map((order) => order.id));

      if (primed.current && knownIds.current) {
        const fresh = nextOrders.filter(
          (order) =>
            order.status === "received" && !knownIds.current!.has(order.id),
        );
        if (fresh.length > 0) playNewOrderChime();
      }

      knownIds.current = nextIds;
      primed.current = true;
      setOrders(nextOrders);
      setSummary(summaryData.summary ?? null);
      setError(null);
    } catch {
      setError("Network error — retrying…");
    }
  }, [router]);

  useEffect(() => {
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
  }, [load]);

  const onStatus = async (
    order: AdminOrder,
    status: OrderStatus,
    cancelReason?: string,
  ) => {
    setBusyId(order.id);
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.id,
          status,
          cancelReason,
        }),
      });
      const data = (await response.json()) as {
        order?: AdminOrder;
        error?: string;
      };
      if (!response.ok || !data.order) {
        const message = data.error ?? "Update failed.";
        setError(message);
        showToast(message);
        return;
      }
      setOrders((current) =>
        current.map((entry) =>
          entry.id === data.order!.id ? data.order! : entry,
        ),
      );
      void load();
    } catch {
      const message = "Network error — status not updated.";
      setError(message);
      showToast(message);
    } finally {
      setBusyId(null);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-eyebrow text-[10px] font-semibold tracking-[0.18em] text-brand uppercase">
            Kitchen board
          </p>
          <h1 className="font-display mt-1 text-3xl tracking-tight text-ink uppercase">
            Live orders
          </h1>
          <p className="mt-1 text-sm text-muted">
            Auto-refreshes every 10 seconds. New orders chime.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink transition-colors hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          <RefreshCw
            className={cn("size-4", refreshing && "animate-spin")}
            aria-hidden
          />
          Refresh
        </button>
      </div>

      <DailySummary summary={summary} />

      {error ? (
        <p
          className="rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div
        className={cn(
          "flex gap-4 overflow-x-auto scroll-smooth pb-3",
          /* Soft scrollbar so staff know more columns exist */
          "snap-x snap-mandatory",
          "[scrollbar-color:rgba(94,15,29,0.35)_transparent] [scrollbar-width:thin]",
          "[&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-brand/35",
        )}
      >
        {COLUMNS.map((column) => {
          const columnOrders = orders.filter(
            (order) => order.status === column.key,
          );
          const Icon = column.Icon;
          return (
            <section
              key={column.key}
              /* 4 columns fit the board; 5th scrolls into view */
              className="flex w-[19rem] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_10px_28px_rgba(36,26,27,0.05)]"
              aria-label={column.label}
            >
              <div className="flex items-center justify-between gap-2 border-b border-line bg-[#faf7f5] px-3.5 py-3">
                <p className="inline-flex min-w-0 items-center gap-2 font-heading text-sm font-semibold text-ink">
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-tint text-brand">
                    <Icon className="size-3.5" aria-hidden />
                  </span>
                  <span className="truncate">{column.label}</span>
                </p>
                <span className="shrink-0 rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-cream">
                  {columnOrders.length}
                </span>
              </div>

              <div className="flex max-h-[min(70vh,42rem)] flex-1 flex-col gap-3 overflow-y-auto p-3 [-ms-overflow-style:none] [scrollbar-width:thin]">
                {columnOrders.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-line bg-[#faf7f5]/80 px-4 py-10 text-center text-xs text-muted">
                    No orders here
                  </div>
                ) : (
                  columnOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: reduce ? 0.15 : 0.35,
                        delay: reduce ? 0 : Math.min(index, 6) * 0.04,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <AdminOrderCard
                        order={order}
                        busy={busyId === order.id}
                        onStatus={onStatus}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
