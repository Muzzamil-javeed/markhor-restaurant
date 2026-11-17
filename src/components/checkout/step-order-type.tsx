"use client";

import type { UseFormReturn } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bike,
  CalendarClock,
  Check,
  Clock3,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import { Field, fieldClassName } from "@/components/checkout/field";
import { useOpenNow } from "@/hooks/use-open-now";
import { cn } from "@/lib/cn";
import type { CheckoutFormInput } from "@/lib/checkout-schema";
import { formatTime12 } from "@/lib/hours";
import { listScheduleSlots, toDatetimeLocalValue } from "@/lib/schedule";
import {
  ORDER_TYPES,
  orderTypeLabels,
  type OrderType,
} from "@/store/cart";

type Props = {
  form: UseFormReturn<CheckoutFormInput>;
};

const TYPE_META: Record<
  OrderType,
  { Icon: typeof Bike; hint: string }
> = {
  delivery: {
    Icon: Bike,
    hint: "To your door in DHA Phase 6",
  },
  pickup: {
    Icon: Store,
    hint: "Collect from the counter",
  },
  dinein: {
    Icon: UtensilsCrossed,
    hint: "We’ll bring it to your table",
  },
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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5"
    >
      <div>
        <p className="font-heading text-lg font-semibold tracking-tight text-ink sm:text-xl">
          How are you ordering?
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Pick delivery, pickup, or dine-in — then ASAP or a scheduled time.
        </p>
      </div>

      <div>
        <p className="font-eyebrow mb-2 text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">
          Order type
        </p>
        <div
          role="radiogroup"
          aria-label="Order type"
          className="grid gap-2 sm:grid-cols-3"
        >
          {ORDER_TYPES.map((type) => {
            const selected = orderType === type;
            const { Icon, hint } = TYPE_META[type];
            return (
              <button
                key={type}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() =>
                  setValue("orderType", type as OrderType, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                className={cn(
                  "group relative flex items-start gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                  selected
                    ? "border-brand bg-tint shadow-[0_6px_18px_rgba(94,15,29,0.08)]"
                    : "border-line bg-white hover:border-brand/30 hover:bg-[#faf7f5]",
                )}
              >
                {selected ? (
                  <span className="absolute top-2.5 right-2.5 inline-flex size-4 items-center justify-center rounded-full bg-brand text-on-brand">
                    <Check className="size-2.5" aria-hidden />
                  </span>
                ) : null}
                <span
                  className={cn(
                    "inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-250",
                    selected
                      ? "bg-brand text-on-brand"
                      : "bg-[#faf7f5] text-brand group-hover:bg-tint",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                </span>
                <span className="min-w-0 pr-4">
                  <span
                    className={cn(
                      "block text-sm font-semibold",
                      selected ? "text-brand" : "text-ink",
                    )}
                  >
                    {orderTypeLabels[type]}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-muted">
                    {hint}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {errors.orderType ? (
          <p className="mt-2 text-xs text-destructive" role="alert">
            {errors.orderType.message}
          </p>
        ) : null}
      </div>

      <div>
        <p className="font-eyebrow mb-2 text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">
          Timing
        </p>
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
                Icon: Clock3,
              },
              {
                id: "scheduled" as const,
                label: "Schedule for later",
                hint: "At least 45 minutes ahead",
                disabled: false,
                Icon: CalendarClock,
              },
            ] as const
          ).map((option) => {
            const selected = timing === option.id;
            const Icon = option.Icon;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={option.disabled}
                onClick={() => {
                  setValue("timing", option.id, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  if (option.id === "asap") {
                    setValue("scheduledFor", "", {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  } else if (!watch("scheduledFor") && slots[0]) {
                    setValue("scheduledFor", toDatetimeLocalValue(slots[0]), {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }
                }}
                className={cn(
                  "group relative flex items-start gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-50",
                  selected
                    ? "border-brand bg-tint shadow-[0_6px_18px_rgba(94,15,29,0.08)]"
                    : "border-line bg-white hover:border-brand/30 hover:bg-[#faf7f5]",
                )}
              >
                {selected ? (
                  <span className="absolute top-2.5 right-2.5 inline-flex size-4 items-center justify-center rounded-full bg-brand text-on-brand">
                    <Check className="size-2.5" aria-hidden />
                  </span>
                ) : null}
                <span
                  className={cn(
                    "inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-250",
                    selected
                      ? "bg-brand text-on-brand"
                      : "bg-[#faf7f5] text-brand group-hover:bg-tint",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                </span>
                <span className="min-w-0 pr-4">
                  <span
                    className={cn(
                      "block text-sm font-semibold",
                      selected ? "text-brand" : "text-ink",
                    )}
                  >
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-muted">
                    {option.hint}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {timing === "scheduled" ? (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-line bg-white p-3.5">
              <Field
                label="Scheduled time"
                htmlFor="scheduledFor"
                error={errors.scheduledFor?.message}
                hint="Times are Asia/Karachi, within opening hours."
              >
                <select
                  id="scheduledFor"
                  className={fieldClassName(Boolean(errors.scheduledFor))}
                  aria-invalid={Boolean(errors.scheduledFor)}
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
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
