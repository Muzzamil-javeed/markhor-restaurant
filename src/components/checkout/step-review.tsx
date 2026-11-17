"use client";

import { TransitionLink } from "@/components/transition/TransitionLink";
import type { UseFormReturn } from "react-hook-form";
import { computeCartTotals } from "@/lib/cart-totals";
import { cn } from "@/lib/cn";
import type { CheckoutFormInput } from "@/lib/checkout-schema";
import { formatPKR } from "@/lib/format";
import { paymentProviders } from "@/lib/payment";
import { site } from "@/data/site";
import { orderTypeLabels, type CartLine } from "@/store/cart";

type Props = {
  form: UseFormReturn<CheckoutFormInput>;
  lines: CartLine[];
  voucherCode: string | null;
  total: number;
};

export function StepReview({ form, lines, voucherCode, total }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const orderType = watch("orderType");
  const paymentMethod = watch("paymentMethod");
  const totals = computeCartTotals({
    lines,
    orderType: orderType ?? "delivery",
    voucherCode,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-heading text-lg font-semibold text-ink">
          Payment & review
        </p>
        <p className="mt-1 text-sm text-muted">
          Confirm the bag, then place the order.
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label="Payment method"
        className="flex flex-col gap-2"
      >
        {paymentProviders.map((provider) => {
          const selected = paymentMethod === provider.id;
          return (
            <button
              key={provider.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={!provider.enabled}
              onClick={() => {
                if (!provider.enabled) return;
                setValue("paymentMethod", provider.id, {
                  shouldValidate: true,
                });
              }}
              className={cn(
                "rounded-2xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-55",
                selected
                  ? "border-brand bg-tint text-brand"
                  : "border-line bg-white text-ink",
              )}
            >
              <span className="block text-sm font-semibold">
                {provider.label}
              </span>
              {provider.description ? (
                <span className="mt-0.5 block text-xs text-muted">
                  {provider.description}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {errors.paymentMethod ? (
        <p className="text-xs text-destructive" role="alert">
          {errors.paymentMethod.message}
        </p>
      ) : null}

      <div className="rounded-2xl border border-line bg-white px-4 py-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="font-heading text-sm font-semibold text-ink">
            {orderTypeLabels[orderType ?? "delivery"]} order
          </p>
          {voucherCode ? (
            <span className="text-xs font-medium text-brand">{voucherCode}</span>
          ) : null}
        </div>
        <ul className="flex flex-col gap-2 border-b border-line pb-3">
          {lines.map((line) => (
            <li
              key={line.key}
              className="flex items-start justify-between gap-3 text-sm"
            >
              <span>
                <span className="font-medium text-ink">
                  {line.quantity}× {line.name}
                </span>
                {line.summary ? (
                  <span className="mt-0.5 block text-xs text-muted">
                    {line.summary}
                  </span>
                ) : null}
              </span>
              <span className="shrink-0 tabular-nums text-ink">
                {formatPKR(line.unitPrice * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Subtotal</dt>
            <dd className="tabular-nums">{formatPKR(totals.subtotal)}</dd>
          </div>
          {totals.discount > 0 ? (
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Voucher</dt>
              <dd className="tabular-nums">−{formatPKR(totals.discount)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-3">
            <dt className="text-muted">GST</dt>
            <dd className="tabular-nums">{formatPKR(totals.gst)}</dd>
          </div>
          {orderType === "delivery" ? (
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Delivery</dt>
              <dd className="tabular-nums">
                {totals.deliveryFee === 0
                  ? "Free"
                  : formatPKR(totals.deliveryFee)}
              </dd>
            </div>
          ) : null}
          <div className="mt-1 flex justify-between gap-3 font-heading font-semibold">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatPKR(total)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-muted">{site.footer.note}</p>
      </div>

      <label className="flex items-start gap-3 text-sm text-ink">
        <input
          type="checkbox"
          className="mt-1 size-4 rounded border-line text-brand focus-visible:ring-2 focus-visible:ring-brand/40"
          {...register("acceptTerms")}
        />
        <span>
          I agree to the{" "}
          <TransitionLink
            href="/terms"
            className="font-medium text-brand underline-offset-2 hover:underline"
          >
            terms of service
          </TransitionLink>
          .
        </span>
      </label>
      {errors.acceptTerms ? (
        <p className="text-xs text-destructive" role="alert">
          {errors.acceptTerms.message}
        </p>
      ) : null}
    </div>
  );
}

