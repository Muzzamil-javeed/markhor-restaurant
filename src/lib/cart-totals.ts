import { pricingConfig } from "@/lib/config";
import {
  applyVoucherCode,
  normaliseVoucherCode,
  type OrderType,
} from "@/lib/vouchers";

export type CartLineTotalsInput = {
  unitPrice: number;
  quantity: number;
};

export type CartTotals = {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  gst: number;
  total: number;
  voucherCode: string | null;
  voucherError: string | null;
};

export function linesSubtotal(lines: CartLineTotalsInput[]): number {
  return lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}

/**
 * Cart totals in whole rupees (shared client/server; server re-checks at checkout).
 *
 * subtotal = sum(lineTotals)
 * discount = voucher on subtotal BEFORE GST
 * gst      = round((subtotal - discount) * GST_RATE)
 * delivery = orderType === "delivery" ? DELIVERY_FEE : 0
 * total    = subtotal - discount + gst + delivery
 */
export function computeCartTotals(input: {
  lines: CartLineTotalsInput[];
  orderType: OrderType;
  voucherCode?: string | null;
  now?: Date;
  gstRate?: number;
  deliveryFee?: number;
}): CartTotals {
  const subtotal = linesSubtotal(input.lines);
  const deliveryFee =
    input.orderType === "delivery"
      ? (input.deliveryFee ?? pricingConfig.deliveryFee)
      : 0;
  const gstRate = input.gstRate ?? pricingConfig.gstRate;

  let discount = 0;
  let voucherCode: string | null = null;
  let voucherError: string | null = null;

  if (input.voucherCode?.trim()) {
    const result = applyVoucherCode(
      input.voucherCode,
      subtotal,
      input.orderType,
      input.now ?? new Date(),
    );
    if (result.ok) {
      discount = result.discount;
      voucherCode = normaliseVoucherCode(input.voucherCode);
    } else {
      voucherError = result.reason;
    }
  }

  const afterDiscount = Math.max(0, subtotal - discount);
  const gst = Math.round(afterDiscount * gstRate);
  const total = afterDiscount + gst + deliveryFee;

  return {
    subtotal,
    discount,
    deliveryFee,
    gst,
    total,
    voucherCode,
    voucherError,
  };
}
