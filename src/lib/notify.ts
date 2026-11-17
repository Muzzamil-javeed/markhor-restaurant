import { formatPKR } from "@/lib/format";
import { safeOrderLog } from "@/lib/sanitize";

export type OrderNotifyPayload = {
  code: string;
  orderType: string;
  timing: string;
  scheduledFor?: string | null;
  customerName: string;
  customerPhone: string;
  total: number;
  lines: { quantity: number; name: string; lineTotal: number }[];
  address?: string | null;
  note?: string | null;
};

export interface OrderNotifier {
  notify(order: OrderNotifyPayload): Promise<void>;
}

function whatsappNumber(): string {
  return (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ??
    process.env.NEXT_PUBLIC_RESTAURANT_PHONE?.replace(/\D/g, "") ??
    "923322396608"
  ).replace(/\D/g, "");
}

export function buildWhatsAppOrderMessage(order: OrderNotifyPayload): string {
  const lines = order.lines
    .map(
      (line) =>
        `• ${line.quantity}× ${line.name} — ${formatPKR(line.lineTotal)}`,
    )
    .join("\n");

  const when =
    order.timing === "scheduled" && order.scheduledFor
      ? `Scheduled: ${order.scheduledFor}`
      : "ASAP";

  return [
    `New Markhor order ${order.code}`,
    `${order.orderType.toUpperCase()} · ${when}`,
    `${order.customerName} · ${order.customerPhone}`,
    order.address ? `Address: ${order.address}` : null,
    "",
    lines,
    "",
    `Total: ${formatPKR(order.total)}`,
    order.note ? `Note: ${order.note}` : null,
  ]
    .filter((part): part is string => Boolean(part))
    .join("\n");
}

export function buildWhatsAppNotifyUrl(order: OrderNotifyPayload): string {
  const text = encodeURIComponent(buildWhatsAppOrderMessage(order));
  return `https://wa.me/${whatsappNumber()}?text=${text}`;
}

/**
 * Builds the WhatsApp deep link for kitchen ops.
 * Logs only non-PII (order code / type / total) — never the full URL or phone.
 */
export class WhatsAppConsoleNotifier implements OrderNotifier {
  async notify(order: OrderNotifyPayload): Promise<void> {
    // Side-effect: URL is available to callers that swap this notifier.
    void buildWhatsAppNotifyUrl(order);
    console.info(
      "[order-notify:whatsapp]",
      safeOrderLog({
        code: order.code,
        orderType: order.orderType,
        total: order.total,
      }),
    );
  }
}

export const orderNotifier: OrderNotifier = new WhatsAppConsoleNotifier();
