"use client";

import { TransitionLink } from "@/components/transition/TransitionLink";
import { useSearchParams } from "next/navigation";
import { OrderConfirmationView } from "@/components/order/order-confirmation-view";
import { useOrderPoll } from "@/hooks/use-order-poll";
import { OrderActions } from "@/components/order/order-actions";
import { OrderStatusTimeline } from "@/components/order/order-status-timeline";
import { OrderSummaryCard } from "@/components/order/order-summary-card";
import { orderStatusLabels } from "@/lib/order-status";

export function OrderPageClient({ code }: { code: string }) {
  const params = useSearchParams();
  const token = params.get("token");
  const phone = params.get("phone");

  if (token) {
    return <OrderConfirmationView code={code} token={token} />;
  }

  if (phone) {
    return <OrderPhoneView code={code} phone={phone} />;
  }

  return (
    <div className="rounded-2xl border border-line bg-white px-5 py-8 text-center">
      <p className="font-heading text-lg font-semibold text-ink">
        Secure access required
      </p>
      <p className="mt-2 text-sm text-muted">
        Open the confirmation link from checkout, or track with your order code
        and phone.
      </p>
      <TransitionLink
        href={`/track?code=${encodeURIComponent(code)}`}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-on-brand"
      >
        Go to track order
      </TransitionLink>
    </div>
  );
}

function OrderPhoneView({ code, phone }: { code: string; phone: string }) {
  const { order, error, loading } = useOrderPoll({ code, phone });

  if (loading && !order) {
    return <p className="text-sm text-muted">Loading your order…</p>;
  }

  if (error || !order) {
    return (
      <div className="rounded-2xl border border-line bg-white px-5 py-8 text-center">
        <p className="font-heading text-lg font-semibold text-ink">
          Order not found
        </p>
        <p className="mt-2 text-sm text-muted">{error}</p>
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
      <div className="text-center">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
          Your order
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-ink">
          {order.code}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {orderStatusLabels[order.status]} · {order.etaLabel}
        </p>
      </div>
      <OrderStatusTimeline order={order} />
      <OrderSummaryCard order={order} />
      <OrderActions order={order} />
    </div>
  );
}

