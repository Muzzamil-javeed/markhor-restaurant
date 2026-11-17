import { site } from "@/data/site";
import { getKarachiParts, parseTimeToMinutes } from "@/lib/hours";

export type OrderType = "delivery" | "pickup" | "dinein";

export type VoucherResult =
  | { ok: true; discount: number }
  | { ok: false; reason: string };

function findOffer(code: string) {
  const normalised = code.trim().toLowerCase();
  return site.offers.find((offer) => offer.code.toLowerCase() === normalised);
}

function inOfferWindow(
  window: { start: string; end: string },
  now: Date,
): boolean {
  const parts = getKarachiParts(now);
  const start = parseTimeToMinutes(window.start);
  const end = parseTimeToMinutes(window.end);
  // Half-open [start, end) in Asia/Karachi minutes-of-day.
  return parts.minutesOfDay >= start && parts.minutesOfDay < end;
}

/** Canonical offer code when the voucher is valid, else null. */
export function normaliseVoucherCode(code: string): string | null {
  return findOffer(code)?.code ?? null;
}

/**
 * Validate and price a voucher against the current cart context.
 * Discount is whole rupees, applied on subtotal before GST.
 */
export function applyVoucherCode(
  code: string,
  subtotal: number,
  orderType: OrderType,
  now: Date = new Date(),
): VoucherResult {
  const trimmed = code.trim();
  if (!trimmed) {
    return { ok: false, reason: "Enter a voucher code." };
  }
  if (subtotal <= 0) {
    return { ok: false, reason: "Add items before applying a voucher." };
  }

  const offer = findOffer(trimmed);
  if (!offer) {
    return { ok: false, reason: "That voucher code is not valid." };
  }

  if (offer.appliesTo === "delivery" && orderType !== "delivery") {
    return {
      ok: false,
      reason: "This voucher is only valid on delivery orders.",
    };
  }

  if (offer.window && !inOfferWindow(offer.window, now)) {
    return {
      ok: false,
      reason: "Valid only between 1 PM and 4 PM.",
    };
  }

  const discount = Math.round((subtotal * offer.percentOff) / 100);
  return { ok: true, discount };
}
