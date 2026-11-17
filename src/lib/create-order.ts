import { prisma } from "@/lib/db";
import { allocateOrderCode, createTrackingToken } from "@/lib/order-code";
import { repriceOrder, type ClientCartLine } from "@/lib/reprice-order";
import { sanitizeText } from "@/lib/sanitize";
import type { OrderType } from "@/lib/vouchers";

export type CreateOrderInput = {
  orderType: OrderType;
  timing: "asap" | "scheduled";
  scheduledFor?: Date | null;
  customerName: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  area?: string | null;
  mapPinUrl?: string | null;
  deliveryInstructions?: string | null;
  tableNo?: string | null;
  partySize?: number | null;
  note?: string | null;
  paymentMethod: string;
  voucherCode?: string | null;
  lines: ClientCartLine[];
  now?: Date;
};

export type CreateOrderResult =
  | {
      ok: true;
      orderCode: string;
      trackingToken: string;
      total: number;
    }
  | { ok: false; reason: string };

/** Persist a repriced order + initial status event. */
export async function createOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const priced = await repriceOrder({
    lines: input.lines,
    orderType: input.orderType,
    voucherCode: input.voucherCode,
    now: input.now ?? new Date(),
  });
  if (!priced.ok) {
    return { ok: false, reason: priced.reason };
  }

  const code = await allocateOrderCode();
  const trackingToken = createTrackingToken();

  const customerName = sanitizeText(input.customerName, 80);
  const address =
    input.orderType === "delivery"
      ? sanitizeText(input.address ?? "", 240) || null
      : null;
  const area =
    input.orderType === "delivery"
      ? sanitizeText(input.area ?? "", 120) || null
      : null;
  const mapPinUrl =
    input.orderType === "delivery"
      ? sanitizeText(input.mapPinUrl ?? "", 500) || null
      : null;
  const deliveryInstructions =
    input.orderType === "delivery"
      ? sanitizeText(input.deliveryInstructions ?? "", 240) || null
      : null;
  const tableNo =
    input.orderType === "dinein"
      ? sanitizeText(input.tableNo ?? "", 20) || null
      : null;
  const note = sanitizeText(input.note ?? "", 300) || null;

  const order = await prisma.order.create({
    data: {
      code,
      trackingToken,
      status: "received",
      type: input.orderType,
      timing: input.timing,
      scheduledFor: input.scheduledFor ?? null,
      customerName,
      phone: input.phone,
      email: input.email || null,
      address,
      area,
      mapPinUrl,
      deliveryInstructions,
      tableNo,
      partySize: input.orderType === "dinein" ? (input.partySize ?? null) : null,
      note,
      paymentMethod: input.paymentMethod,
      paymentStatus: "unpaid",
      voucherCode: priced.totals.voucherCode,
      subtotal: priced.totals.subtotal,
      discount: priced.totals.discount,
      gst: priced.totals.gst,
      deliveryFee: priced.totals.deliveryFee,
      total: priced.totals.total,
      items: {
        create: priced.lines.map((line) => ({
          itemId: line.itemId,
          name: line.name,
          variantLabel: line.variantLabel,
          choices: JSON.stringify(line.choiceIds),
          addOns: JSON.stringify(line.addOnIds),
          unitPrice: line.unitPrice,
          qty: line.quantity,
          lineTotal: line.lineTotal,
          note: line.note,
        })),
      },
      statusEvents: {
        create: { status: "received" },
      },
    },
  });

  return {
    ok: true,
    orderCode: order.code,
    trackingToken: order.trackingToken,
    total: order.total,
  };
}
