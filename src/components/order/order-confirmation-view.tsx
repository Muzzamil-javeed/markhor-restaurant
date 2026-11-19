"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { OrderActions } from "@/components/order/order-actions";
import { OrderStatusTimeline } from "@/components/order/order-status-timeline";
import { OrderSummaryCard } from "@/components/order/order-summary-card";
import { useOrderPoll } from "@/hooks/use-order-poll";
import { isTerminalOrderStatus } from "@/lib/active-order";
import { orderStatusLabels } from "@/lib/order-status";
import { useActiveOrderStore } from "@/store/active-order";

export function OrderConfirmationView({
  code,
  token,
}: {
  code: string;
  token: string;
}) {
  const reduceMotion = useReducedMotion();
  const setActive = useActiveOrderStore((state) => state.setActive);
  const clearActive = useActiveOrderStore((state) => state.clear);
  const { order, error, loading } = useOrderPoll({ code, token });

  useEffect(() => {
    if (!order) return;
    if (isTerminalOrderStatus(order.status)) {
      clearActive();
      return;
    }
    setActive({ code, trackingToken: token });
  }, [order, code, token, setActive, clearActive]);

  if (loading && !order) {
    return <p className="text-sm text-muted">Loading your order…</p>;
  }

  if (error || !order) {
    return (
      <div className="rounded-2xl border border-line bg-white px-5 py-8 text-center">
        <p className="font-heading text-lg font-semibold text-ink">
          Order not found
        </p>
        <p className="mt-2 text-sm text-muted">
          {error ??
            "Open the link from your confirmation, or track with your code and phone."}
        </p>
        <TransitionLink
          href="/track"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-on-brand"
        >
          Track an order
        </TransitionLink>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="inline-flex size-16 items-center justify-center rounded-full bg-brand text-on-brand"
          aria-hidden
        >
          <Check className="size-8" strokeWidth={2.5} />
        </motion.div>
        <motion.div
          initial={reduceMotion ? false : { y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.35 }}
        >
          <p className="mt-5 text-xs font-medium tracking-[0.18em] text-muted uppercase">
            Order confirmed
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-ink">
            {order.code}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Status: {orderStatusLabels[order.status]} · {order.etaLabel}
          </p>
        </motion.div>
      </div>

      <OrderSummaryCard order={order} />

      <section aria-labelledby="confirmation-status-title">
        <h2
          id="confirmation-status-title"
          className="mb-3 font-heading text-sm font-semibold text-ink"
        >
          Status
        </h2>
        <OrderStatusTimeline order={order} />
        <p className="mt-2 text-xs text-muted">
          Updates every 15 seconds. You can also{" "}
          <TransitionLink
            href={`/track?code=${encodeURIComponent(order.code)}`}
            className="font-medium text-brand underline-offset-2 hover:underline"
          >
            track later
          </TransitionLink>{" "}
          with your phone number.
        </p>
      </section>

      <OrderActions order={order} />
    </div>
  );
}

