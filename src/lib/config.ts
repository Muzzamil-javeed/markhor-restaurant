/** Shared pricing defaults (match `.env.example`). Overridable on the server via env. */
function readNumber(name: string, fallback: number): number {
  const raw =
    typeof process !== "undefined"
      ? process.env[name] ?? process.env[`NEXT_PUBLIC_${name}`]
      : undefined;
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

export const pricingConfig = {
  gstRate: readNumber("GST_RATE", 0.15),
  deliveryFee: readNumber("DELIVERY_FEE", 0),
  minOrderDelivery: readNumber("MIN_ORDER_DELIVERY", 0),
} as const;
