"use client";

import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { computeCartTotals } from "@/lib/cart-totals";
import { formatPKR } from "@/lib/format";
import { useCartStore } from "@/store/cart";

export function CartSummary({ tone = "light" }: { tone?: "light" | "dark" }) {
  const lines = useCartStore((state) => state.lines);
  const orderType = useCartStore((state) => state.orderType);
  const voucherCode = useCartStore((state) => state.voucherCode);
  const dark = tone === "dark";

  const totals = computeCartTotals({
    lines,
    orderType,
    voucherCode,
  });

  const rows: { label: string; value: string; emphasize?: boolean }[] = [
    { label: "Subtotal", value: formatPKR(totals.subtotal) },
  ];

  if (totals.discount > 0) {
    rows.push({
      label: "Voucher discount",
      value: `−${formatPKR(totals.discount)}`,
    });
  }

  rows.push({ label: "GST", value: formatPKR(totals.gst) });

  if (orderType === "delivery") {
    rows.push({
      label: "Delivery fee",
      value:
        totals.deliveryFee === 0
          ? "Free"
          : formatPKR(totals.deliveryFee),
    });
  }

  rows.push({
    label: "Total",
    value: formatPKR(totals.total),
    emphasize: true,
  });

  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-4",
        dark ? "border-cream/12 bg-cream/5" : "border-line bg-white",
      )}
    >
      <dl className="flex flex-col gap-2.5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <dt
              className={cn(
                row.emphasize
                  ? "font-heading font-semibold"
                  : undefined,
                dark
                  ? row.emphasize
                    ? "text-cream"
                    : "text-cream/50"
                  : row.emphasize
                    ? "text-ink"
                    : "text-muted",
              )}
            >
              {row.label}
            </dt>
            <dd
              className={cn(
                "tabular-nums",
                row.emphasize && "font-heading font-semibold",
                dark ? "text-cream" : "text-ink",
              )}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      <p
        className={cn(
          "mt-3 text-xs",
          dark ? "text-cream/40" : "text-muted",
        )}
      >
        {site.footer.note}
      </p>
    </div>
  );
}
