import type { OrderType } from "@/lib/vouchers";
import {
  isOrderStatus,
  type OrderStatus,
} from "@/lib/order-status";

const TERMINAL: ReadonlySet<OrderStatus> = new Set([
  "completed",
  "cancelled",
]);

/**
 * Allowed next statuses for kitchen/admin transitions.
 * Cancel is allowed from any non-terminal state.
 */
export function allowedNextStatuses(
  current: OrderStatus,
  orderType: OrderType,
): OrderStatus[] {
  if (TERMINAL.has(current)) return [];

  const next: OrderStatus[] = ["cancelled"];

  switch (current) {
    case "received":
      next.unshift("preparing");
      break;
    case "preparing":
      next.unshift("ready");
      break;
    case "ready":
      if (orderType === "delivery") {
        next.unshift("out_for_delivery");
      } else {
        next.unshift("completed");
      }
      break;
    case "out_for_delivery":
      next.unshift("completed");
      break;
    default:
      break;
  }

  return next;
}

export function canTransitionStatus(input: {
  from: string;
  to: string;
  orderType: string;
}): { ok: true } | { ok: false; reason: string } {
  if (!isOrderStatus(input.from) || !isOrderStatus(input.to)) {
    return { ok: false, reason: "Unknown order status." };
  }

  const orderType = input.orderType as OrderType;
  if (
    orderType !== "delivery" &&
    orderType !== "pickup" &&
    orderType !== "dinein"
  ) {
    return { ok: false, reason: "Unknown order type." };
  }

  if (input.from === input.to) {
    return { ok: false, reason: "Order is already in that status." };
  }

  const allowed = allowedNextStatuses(input.from, orderType);
  if (!allowed.includes(input.to)) {
    return {
      ok: false,
      reason: `Cannot move from ${input.from} to ${input.to}.`,
    };
  }

  if (input.to === "out_for_delivery" && orderType !== "delivery") {
    return {
      ok: false,
      reason: "Out for delivery is only valid for delivery orders.",
    };
  }

  return { ok: true };
}
