"use client";

import type { UseFormReturn } from "react-hook-form";
import { Field, fieldClassName } from "@/components/checkout/field";
import { useOpenNow } from "@/hooks/use-open-now";
import { cn } from "@/lib/cn";
import type { CheckoutFormInput } from "@/lib/checkout-schema";
import { formatTime12 } from "@/lib/hours";
import {
  listScheduleSlots,
  toDatetimeLocalValue,
} from "@/lib/schedule";
import {
  ORDER_TYPES,
  orderTypeLabels,
  type OrderType,
} from "@/store/cart";

type Props = {
  form: UseFormReturn<CheckoutFormInput>;
};

export function StepOrderType({ form }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const orderType = watch("orderType");
  const timing = watch("timing");
  const { ready, isOpen, closedMessage } = useOpenNow();
  const slots = listScheduleSlots(new Date(), undefined, 2);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-heading text-lg font-semibold text-ink">
          How are you ordering?
        </p>
        <p className="mt-1 text-sm text-muted">
          Delivery, pickup, or dine-in — then ASAP or a scheduled time.
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label="Order type"
        className="grid gap-2 sm:grid-cols-3"
      >
        {ORDER_TYPES.map((type) => {
          const selected = orderType === type;
          return (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() =>
                setValue("orderType", type as OrderType, {
                  shouldValidate: true,
                })
              }
              className={cn(
                "rounded-2xl border px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                selected
                  ? "border-brand bg-tint text-brand"
                  : "border-line bg-white text-ink hover:border-brand/40",
              )}
            >
              <span className="font-heading text-sm font-semibold">
                {orderTypeLabels[type]}
              </span>
            </button>
          );
        })}
      </div>
      {errors.orderType ? (
        <p className="text-xs text-destructive" role="alert">
          {errors.orderType.message}
        </p>
      ) : null}

      <div
        role="radiogroup"
        aria-label="When"
        className="grid gap-2 sm:grid-cols-2"
      >
        {(
          [
            {
              id: "asap" as const,
              label: "ASAP",
              hint: ready && !isOpen ? closedMessage : "As soon as we can",
              disabled: ready && !isOpen,
            },
            {
              id: "scheduled" as const,
              label: "Schedule for later",
              hint: "At least 45 minutes ahead",
              disabled: false,
            },
          ] as const
        ).map((option) => {
          const selected = timing === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={option.disabled}
              onClick={() => {
                setValue("timing", option.id, { shouldValidate: true });
                if (option.id === "asap") {
                  setValue("scheduledFor", "", { shouldValidate: true });
                } else if (!watch("scheduledFor") && slots[0]) {
                  setValue("scheduledFor", toDatetimeLocalValue(slots[0]), {
                    shouldValidate: true,
                  });
                }
              }}
              className={cn(
                "rounded-2xl border px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-50",
                selected
                  ? "border-brand bg-tint text-brand"
                  : "border-line bg-white text-ink hover:border-brand/40",
              )}
            >
              <span className="font-heading text-sm font-semibold">
                {option.label}
              </span>
              <span className="mt-1 block text-xs text-muted">
                {option.hint}
              </span>
            </button>
          );
        })}
      </div>

      {timing === "scheduled" ? (
        <Field
          label="Scheduled time"
          htmlFor="scheduledFor"
          error={errors.scheduledFor?.message}
          hint="Times are Asia/Karachi, within opening hours."
        >
          <select
            id="scheduledFor"
            className={fieldClassName}
            {...register("scheduledFor")}
          >
            <option value="">Select a time</option>
            {slots.map((slot) => {
              const value = toDatetimeLocalValue(slot);
              const parts = value.split("T");
              const time = parts[1] ?? "";
              const label = `${parts[0]} · ${formatTime12(time)}`;
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        </Field>
      ) : null}
    </div>
  );
}
