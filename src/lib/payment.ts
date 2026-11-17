export type PaymentMethodId = "cash" | "counter" | "online";

/**
 * Pluggable payment provider contract.
 * JazzCash / Easypaisa / card can implement this later.
 */
export interface PaymentProvider {
  id: PaymentMethodId;
  label: string;
  description?: string;
  /** false = shown but disabled (coming soon). */
  enabled: boolean;
}

export const paymentProviders: readonly PaymentProvider[] = [
  {
    id: "cash",
    label: "Cash on Delivery",
    description: "Pay the rider when your order arrives.",
    enabled: true,
  },
  {
    id: "counter",
    label: "Pay at counter",
    description: "Pay when you collect or at your table.",
    enabled: true,
  },
  {
    id: "online",
    label: "Online payment (coming soon)",
    description: "JazzCash, Easypaisa, and cards will land here.",
    enabled: false,
  },
] as const;

export function defaultPaymentMethod(
  orderType: "delivery" | "pickup" | "dinein",
): PaymentMethodId {
  return orderType === "delivery" ? "cash" : "counter";
}

export function isEnabledPaymentMethod(id: string): id is PaymentMethodId {
  return paymentProviders.some(
    (provider) => provider.id === id && provider.enabled,
  );
}
