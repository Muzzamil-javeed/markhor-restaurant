import type { Order, OrderItem } from "@/generated/prisma/client";
import { estimateOrderReadyLabel } from "@/lib/order-eta";
import {
  isOrderStatus,
  type OrderStatus,
} from "@/lib/order-status";
import type { OrderType } from "@/lib/vouchers";

export type PublicOrderItem = {
  name: string;
  summary: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  note: string | null;
};

export type PublicOrder = {
  code: string;
  status: OrderStatus;
  orderType: OrderType;
  timing: "asap" | "scheduled";
  scheduledFor: string | null;
  customerName: string;
  customerPhoneMasked: string;
  address: string | null;
  areaLandmark: string | null;
  tableNumber: string | null;
  partySize: number | null;
  note: string | null;
  paymentMethod: string;
  paymentStatus: string;
  voucherCode: string | null;
  subtotal: number;
  discount: number;
  gst: number;
  deliveryFee: number;
  total: number;
  etaLabel: string;
  items: PublicOrderItem[];
  createdAt: string;
  updatedAt: string;
};

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "••••";
  return `+${digits.slice(0, 2)}******${digits.slice(-4)}`;
}

function itemSummary(item: OrderItem): string | null {
  const parts: string[] = [];
  if (item.variantLabel) parts.push(item.variantLabel);
  try {
    const choices = JSON.parse(item.choices) as unknown;
    if (Array.isArray(choices) && choices.length) {
      parts.push(choices.map(String).join(", "));
    }
  } catch {
    /* ignore */
  }
  try {
    const addOns = JSON.parse(item.addOns) as unknown;
    if (Array.isArray(addOns) && addOns.length) {
      parts.push(addOns.map(String).join(", "));
    }
  } catch {
    /* ignore */
  }
  return parts.length ? parts.join(" · ") : null;
}

export function toPublicOrder(
  order: Order & { items: OrderItem[] },
): PublicOrder {
  const orderType = order.type as OrderType;
  const timing = order.timing === "scheduled" ? "scheduled" : "asap";
  const status: OrderStatus = isOrderStatus(order.status)
    ? order.status
    : "received";

  return {
    code: order.code,
    status,
    orderType,
    timing,
    scheduledFor: order.scheduledFor?.toISOString() ?? null,
    customerName: order.customerName,
    customerPhoneMasked: maskPhone(order.phone),
    address: order.address,
    areaLandmark: order.area,
    tableNumber: order.tableNo,
    partySize: order.partySize,
    note: order.note,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    voucherCode: order.voucherCode,
    subtotal: order.subtotal,
    discount: order.discount,
    gst: order.gst,
    deliveryFee: order.deliveryFee,
    total: order.total,
    etaLabel: estimateOrderReadyLabel({
      orderType,
      timing,
      scheduledFor: order.scheduledFor,
      createdAt: order.createdAt,
    }),
    items: order.items.map((item) => ({
      name: item.name,
      summary: itemSummary(item),
      quantity: item.qty,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
      note: item.note,
    })),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}
