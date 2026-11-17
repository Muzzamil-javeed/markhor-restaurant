import { prisma } from "@/lib/db";
import { normalisePkPhone } from "@/lib/pk-phone";
import { toPublicOrder, type PublicOrder } from "@/lib/order-public";

const GENERIC_NOT_FOUND =
  "We could not find an order with those details. Check the code and try again.";

export type OrderAccessResult =
  | { ok: true; order: PublicOrder }
  | { ok: false; error: string; status: 404 | 400 };

function normaliseCode(code: string): string {
  return code.trim().toUpperCase();
}

/**
 * Load a public order only when the tracking token OR phone matches.
 * Failures always look the same — no order enumeration.
 */
export async function accessOrder(input: {
  code: string;
  token?: string | null;
  phone?: string | null;
}): Promise<OrderAccessResult> {
  const code = normaliseCode(input.code);
  if (!/^MK-\d{4}$/.test(code)) {
    return { ok: false, error: GENERIC_NOT_FOUND, status: 404 };
  }

  const token = input.token?.trim() || null;
  const phone = input.phone ? normalisePkPhone(input.phone) : null;

  if (!token && !phone) {
    return {
      ok: false,
      error: "Enter your order code and phone, or open the confirmation link.",
      status: 400,
    };
  }

  const order = await prisma.order.findUnique({
    where: { code },
    include: { items: true },
  });

  if (!order) {
    return { ok: false, error: GENERIC_NOT_FOUND, status: 404 };
  }

  const tokenOk = Boolean(token && token === order.trackingToken);
  const phoneOk = Boolean(phone && phone === order.phone);

  if (!tokenOk && !phoneOk) {
    return { ok: false, error: GENERIC_NOT_FOUND, status: 404 };
  }

  return { ok: true, order: toPublicOrder(order) };
}
