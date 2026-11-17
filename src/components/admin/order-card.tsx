"use client";

import Link from "next/link";
import { useState, type ComponentType } from "react";
import {
  Bike,
  Clock3,
  MapPin,
  Phone,
  ShoppingBag,
  StickyNote,
  Ticket,
  Utensils,
  X,
  type LucideProps,
} from "lucide-react";
import type { AdminOrder } from "@/lib/admin-orders";
import { formatPKR } from "@/lib/format";
import { allowedNextStatuses } from "@/lib/order-transitions";
import { orderStatusLabels, type OrderStatus } from "@/lib/order-status";
import { orderTypeLabels, type OrderType } from "@/store/cart";
import { cn } from "@/lib/cn";

type Props = {
  order: AdminOrder;
  onStatus: (
    order: AdminOrder,
    status: OrderStatus,
    cancelReason?: string,
  ) => Promise<void>;
  busy?: boolean;
};

const typeIcon: Record<OrderType, ComponentType<LucideProps>> = {
  delivery: Bike,
  pickup: ShoppingBag,
  dinein: Utensils,
};

export function AdminOrderCard({ order, onStatus, busy }: Props) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState("");
  const next = allowedNextStatuses(
    order.status as OrderStatus,
    order.orderType,
  ).filter((status) => status !== "cancelled");
  const TypeIcon = typeIcon[order.orderType];

  const mapsUrl =
    order.mapPinUrl ||
    (order.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          [order.address, order.areaLandmark].filter(Boolean).join(", "),
        )}`
      : null);

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-line bg-[#faf7f5] p-3.5">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-heading text-base font-semibold tracking-tight text-ink">
            {order.code}
          </p>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <TypeIcon className="size-3.5 text-brand" aria-hidden />
              {orderTypeLabels[order.orderType]}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="size-3.5" aria-hidden />
              {order.etaLabel}
            </span>
          </p>
        </div>
        <p className="shrink-0 font-heading text-sm font-semibold tabular-nums text-ink">
          {formatPKR(order.total)}
        </p>
      </header>

      <ul className="space-y-2 border-t border-line pt-3 text-sm">
        {order.items.map((item, index) => (
          <li key={`${item.name}-${index}`} className="leading-snug">
            <span className="font-medium text-ink">
              {item.quantity}× {item.name}
            </span>
            {item.summary ? (
              <span className="mt-0.5 block text-xs text-muted">
                {item.summary}
              </span>
            ) : null}
            {item.note ? (
              <span className="mt-0.5 block text-xs italic text-muted">
                Note: {item.note}
              </span>
            ) : null}
          </li>
        ))}
      </ul>

      {order.note ? (
        <p className="flex items-start gap-2 rounded-xl bg-tint px-3 py-2.5 text-xs text-ink">
          <StickyNote
            className="mt-0.5 size-3.5 shrink-0 text-brand"
            aria-hidden
          />
          <span>
            <span className="font-semibold">Order note: </span>
            {order.note}
          </span>
        </p>
      ) : null}

      <div className="space-y-2 border-t border-line pt-3 text-sm">
        <a
          href={`tel:${order.phone}`}
          className="flex items-start gap-2 font-medium text-brand transition-colors hover:text-brand/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          <Phone className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span className="min-w-0 break-words">
            {order.customerName} · {order.phone}
          </span>
        </a>
        {order.orderType === "delivery" && order.address ? (
          mapsUrl ? (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              <MapPin
                className="mt-0.5 size-3.5 shrink-0 text-brand"
                aria-hidden
              />
              <span className="min-w-0 break-words">
                {order.address}
                {order.areaLandmark ? ` · ${order.areaLandmark}` : ""}
              </span>
            </a>
          ) : (
            <p className="flex items-start gap-2 text-muted">
              <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span className="min-w-0 break-words">{order.address}</span>
            </p>
          )
        ) : null}
        {order.cancelReason ? (
          <p className="text-xs text-destructive">
            Cancelled: {order.cancelReason}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-line pt-3">
        {next.map((status) => (
          <button
            key={status}
            type="button"
            disabled={busy}
            onClick={() => void onStatus(order, status)}
            className="inline-flex h-9 items-center rounded-full bg-brand px-3.5 text-xs font-semibold text-on-brand transition-colors hover:bg-brand/90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            {orderStatusLabels[status]}
          </button>
        ))}
        {order.status !== "cancelled" && order.status !== "completed" ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => setCancelOpen((open) => !open)}
            className="inline-flex h-9 items-center gap-1 rounded-full border border-destructive/35 px-3.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/5 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30"
          >
            <X className="size-3.5" aria-hidden />
            Cancel
          </button>
        ) : null}
        <Link
          href={`/admin/orders/${order.id}`}
          className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-3.5 text-xs font-semibold text-ink transition-colors hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          <Ticket className="size-3.5" aria-hidden />
          Ticket
        </Link>
      </div>

      {cancelOpen ? (
        <div className="rounded-xl border border-line bg-[#faf7f5] p-3">
          <label
            htmlFor={`cancel-${order.id}`}
            className="text-xs font-medium text-ink"
          >
            Cancel reason
          </label>
          <input
            id={`cancel-${order.id}`}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className="mt-1.5 h-10 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            placeholder="Out of stock, customer request…"
          />
          <button
            type="button"
            disabled={busy || reason.trim().length < 2}
            onClick={() => void onStatus(order, "cancelled", reason.trim())}
            className={cn(
              "mt-2 inline-flex h-9 items-center rounded-full bg-destructive px-3.5 text-xs font-semibold text-white",
              "disabled:opacity-50",
            )}
          >
            Confirm cancel
          </button>
        </div>
      ) : null}
    </article>
  );
}
