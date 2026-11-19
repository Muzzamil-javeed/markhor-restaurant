"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Package, X } from "lucide-react";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { useOrderPoll } from "@/hooks/use-order-poll";
import {
  activeOrderHref,
  isTerminalOrderStatus,
} from "@/lib/active-order";
import { cn } from "@/lib/cn";
import { orderStatusLabels } from "@/lib/order-status";
import { useActiveOrderStore } from "@/store/active-order";
import { useActiveOrderHydration } from "@/store/use-active-order-hydration";

const COLLAPSED_KEY = "markhor-active-order-collapsed";

function readCollapsed(): boolean {
  try {
    return window.sessionStorage.getItem(COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

function writeCollapsed(value: boolean) {
  try {
    if (value) window.sessionStorage.setItem(COLLAPSED_KEY, "1");
    else window.sessionStorage.removeItem(COLLAPSED_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Active-order card after checkout. Close / Later collapses to a right-edge
 * status tab so the guest can reopen without remembering code/phone.
 */
export function ActiveOrderReminder() {
  const hydrated = useActiveOrderHydration();
  const active = useActiveOrderStore((state) => state.active);
  const clear = useActiveOrderStore((state) => state.clear);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(readCollapsed());
  }, []);

  const onOrderPage =
    Boolean(active) &&
    pathname?.toLowerCase().startsWith(`/order/${active!.code.toLowerCase()}`);

  const { order, error } = useOrderPoll({
    code: active?.code ?? "",
    token: active?.trackingToken ?? "",
    enabled: hydrated && Boolean(active) && !onOrderPage,
  });

  useEffect(() => {
    if (!active) return;
    if (order && isTerminalOrderStatus(order.status)) {
      writeCollapsed(false);
      setCollapsed(false);
      clear();
      return;
    }
    if (error && /not found|invalid|missing/i.test(error)) {
      writeCollapsed(false);
      setCollapsed(false);
      clear();
    }
  }, [active, order, error, clear]);

  const hasLiveOrder =
    hydrated &&
    active &&
    !onOrderPage &&
    order &&
    !isTerminalOrderStatus(order.status);

  const onCollapse = () => {
    writeCollapsed(true);
    setCollapsed(true);
  };

  const onExpand = () => {
    writeCollapsed(false);
    setCollapsed(false);
  };

  return (
    <AnimatePresence mode="wait">
      {hasLiveOrder && active && order && !collapsed ? (
        <motion.div
          key={`card-${active.code}`}
          initial={reduce ? false : { y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? undefined : { y: 12, opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className={cn(
            "pointer-events-none fixed inset-x-0 bottom-0 z-[45] p-3",
            "md:inset-x-auto md:right-4 md:bottom-4 md:w-[22rem] md:p-0",
          )}
          role="status"
          aria-live="polite"
        >
          <div
            className={cn(
              "pointer-events-auto overflow-hidden rounded-2xl border border-brand/40",
              "bg-[#1A1314] text-[#F6F4F2]",
              "shadow-[0_16px_40px_rgba(94,15,29,0.45),0_0_0_1px_rgba(94,15,29,0.25)]",
            )}
          >
            <div className="flex items-start gap-3 p-4">
              <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-on-brand">
                <Package className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-eyebrow text-[10px] font-semibold tracking-[0.16em] text-[#E87830] uppercase">
                  Active order
                </p>
                <p className="mt-1 font-display text-lg leading-tight tracking-wide uppercase">
                  {order.code}
                </p>
                <p className="mt-1 text-sm text-[#F6F4F2]/55">
                  {orderStatusLabels[order.status]} · {order.etaLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={onCollapse}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[#F6F4F2]/55 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label="Minimize order status"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <div className="flex gap-2 border-t border-white/10 px-4 py-3">
              <TransitionLink
                href={activeOrderHref(active.code, active.trackingToken)}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-brand text-sm font-semibold text-on-brand transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                Track order
              </TransitionLink>
              <button
                type="button"
                onClick={onCollapse}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/20 px-4 text-sm font-medium text-[#F6F4F2]/80 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                Later
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}

      {hasLiveOrder && active && order && collapsed ? (
        <motion.div
          key={`tab-${active.code}`}
          initial={reduce ? false : { x: 48, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={reduce ? undefined : { x: 36, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 30 }}
          className="pointer-events-none fixed top-[28%] right-0 z-[45] -translate-y-1/2 sm:top-[32%]"
        >
          <button
            type="button"
            onClick={onExpand}
            className={cn(
              "pointer-events-auto flex max-w-[9.5rem] items-center gap-2 rounded-l-2xl rounded-r-none",
              "border border-r-0 border-brand/50 bg-[#1A1314] py-3 pr-2.5 pl-3",
              "text-left text-[#F6F4F2]",
              "shadow-[-8px_12px_28px_rgba(94,15,29,0.4)]",
              "transition-colors hover:bg-[#22181A]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50",
            )}
            aria-label={`Open order status for ${order.code}`}
          >
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-on-brand">
              <Package className="size-3.5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="font-eyebrow block text-[9px] font-semibold tracking-[0.14em] text-[#E87830] uppercase">
                Order status
              </span>
              <span className="mt-0.5 block truncate font-display text-xs tracking-wide uppercase">
                {order.code}
              </span>
              <span className="mt-0.5 block truncate text-[10px] text-[#F6F4F2]/55">
                {orderStatusLabels[order.status]}
              </span>
            </span>
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
