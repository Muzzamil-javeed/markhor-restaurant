export const ORDER_STATUSES = [
  "received",
  "preparing",
  "ready",
  "out_for_delivery",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const orderStatusLabels: Record<OrderStatus, string> = {
  received: "Received",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out for delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** Pipeline steps shown on the tracking timeline (cancelled is separate). */
export function timelineStatuses(
  orderType: "delivery" | "pickup" | "dinein",
): OrderStatus[] {
  if (orderType === "delivery") {
    return ["received", "preparing", "ready", "out_for_delivery", "completed"];
  }
  return ["received", "preparing", "ready", "completed"];
}

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export function statusIndex(
  status: OrderStatus,
  orderType: "delivery" | "pickup" | "dinein",
): number {
  return timelineStatuses(orderType).indexOf(status);
}
