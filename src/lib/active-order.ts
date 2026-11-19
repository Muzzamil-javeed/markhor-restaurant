import type { OrderStatus } from "@/lib/order-status";

/** Statuses that mean the guest no longer needs the “active order” reminder. */
export function isTerminalOrderStatus(status: OrderStatus): boolean {
  return status === "completed" || status === "cancelled";
}

export function activeOrderHref(code: string, trackingToken: string): string {
  return `/order/${encodeURIComponent(code)}?token=${encodeURIComponent(trackingToken)}`;
}
