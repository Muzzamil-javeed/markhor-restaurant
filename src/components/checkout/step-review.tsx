"use client";

import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Banknote,
  Check,
  CreditCard,
  FileCheck2,
  ShoppingBag,
  Store,
  type LucideIcon,
} from "lucide-react";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { computeCartTotals } from "@/lib/cart-totals";
import { cn } from "@/lib/cn";
import type { CheckoutFormInput } from "@/lib/checkout-schema";
import { formatPKR } from "@/lib/format";
import {
  isEnabledPaymentMethod,
  paymentProviders,
  type PaymentMethodId,
} from "@/lib/payment";
import { syncPaymentDefault } from "@/store/checkout-draft";
import { site } from "@/data/site";
import { orderTypeLabels, type CartLine } from "@/store/cart";

type Props = {
  form: UseFormReturn<CheckoutFormInput>;
  lines: CartLine[];
  voucherCode: string | null;
  total: number;
};

const PAYMENT_ICONS: Record<PaymentMethodId, LucideIcon> = {
  cash: Banknote,
  counter: Store,
  online: CreditCard,
};

export function StepReview({ form, lines, voucherCode, total }: Props) {
  const {
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

  // Draft / stale state can leave a disabled method selected — snap back.
  useEffect(() => {
    const type = orderType ?? "delivery";
    if (paymentMethod && isEnabledPaymentMethod(paymentMethod)) return;
    setValue("paymentMethod", syncPaymentDefault(type, paymentMethod), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [orderType, paymentMethod, setValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5"
    >
      <div>
        <p className="font-heading text-lg font-semibold tracking-tight text-ink sm:text-xl">
          Payment & review
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Confirm the bag, then place the order.
        </p>
      </div>

      <div>
        <p className="font-eyebrow mb-2 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">
          <Banknote className="size-3 text-brand" aria-hidden />
          Payment
        </p>
        <div
          role="radiogroup"
          aria-label="Payment method"
          className="flex flex-col gap-2"
        >
          {paymentProviders.map((provider) => {
            const selected = paymentMethod === provider.id;
            const Icon = PAYMENT_ICONS[provider.id];
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
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-50",
                  selected
                    ? "border-brand bg-tint shadow-[0_6px_18px_rgba(94,15,29,0.08)]"
                    : "border-line bg-white hover:border-brand/30 hover:bg-[#faf7f5]",
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-250",
                    selected
                      ? "bg-brand text-on-brand"
                      : "bg-[#faf7f5] text-brand group-hover:bg-tint",
                    !provider.enabled && "text-muted",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1 pr-6">
                  <span
                    className={cn(
                      "block text-sm font-semibold",
                      selected ? "text-brand" : "text-ink",
                    )}
                  >
                    {provider.label}
                  </span>
                  {provider.description ? (
                    <span className="mt-0.5 block text-[11px] leading-snug text-muted">
                      {provider.description}
                    </span>
                  ) : null}
                </span>
                {selected ? (
                  <span className="absolute top-1/2 right-2.5 inline-flex size-4 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-on-brand">
                    <Check className="size-2.5" aria-hidden />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        {errors.paymentMethod ? (
          <p className="mt-2 text-xs text-destructive" role="alert">
            {errors.paymentMethod.message}
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-line bg-white px-3.5 py-3.5">
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
            <ShoppingBag className="size-3.5 text-brand" aria-hidden />
            {orderTypeLabels[orderType ?? "delivery"]} order
          </p>
          {voucherCode ? (
            <span className="rounded-full bg-tint px-2 py-0.5 text-[11px] font-medium text-brand">
              {voucherCode}
            </span>
          ) : null}
        </div>
        <ul className="flex flex-col gap-1.5 border-b border-line pb-2.5">
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
                  <span className="mt-0.5 block text-[11px] text-muted">
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
        <dl className="mt-2.5 flex flex-col gap-1 text-sm">
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
          <div className="mt-1 flex justify-between gap-3 border-t border-line pt-2 font-heading text-[15px] font-semibold">
            <dt>Total</dt>
            <dd className="tabular-nums text-brand">{formatPKR(total)}</dd>
          </div>
        </dl>
        <p className="mt-2 text-[11px] leading-snug text-muted">
          {site.footer.note}
        </p>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line bg-[#faf7f5] px-3 py-2.5 text-sm text-ink has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/40">
        <input
          type="checkbox"
          className="size-4 shrink-0 rounded border-line text-brand"
          checked={Boolean(watch("acceptTerms"))}
          onChange={(event) => {
            setValue("acceptTerms", event.target.checked, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
          }}
        />
        <FileCheck2 className="size-3.5 shrink-0 text-brand" aria-hidden />
        <span>
          I agree to the{" "}
          <TransitionLink
            href="/terms"
            className="font-medium text-brand underline-offset-2 hover:underline"
            onClick={(event) => event.stopPropagation()}
          >
            terms of service
          </TransitionLink>
          .
        </span>
      </label>
      {errors.acceptTerms ? (
        <p className="-mt-3 text-xs text-destructive" role="alert">
          {errors.acceptTerms.message}
        </p>
      ) : null}
    </motion.div>
  );
}
