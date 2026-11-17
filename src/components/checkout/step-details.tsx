"use client";

import type { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import { MapPinned, Phone, StickyNote, User, Users } from "lucide-react";
import {
  Field,
  fieldClassName,
  textareaClassName,
} from "@/components/checkout/field";
import type { CheckoutFormInput } from "@/lib/checkout-schema";

type Props = {
  form: UseFormReturn<CheckoutFormInput>;
};

export function StepDetails({ form }: Props) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const orderType = watch("orderType");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col gap-5"
    >
      <div>
        <p className="font-heading text-lg font-semibold tracking-tight text-ink sm:text-xl">
          Your details
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          We use these to confirm the order — phone is required.
        </p>
      </div>

      <section className="rounded-xl border border-line bg-[#faf7f5] px-3.5 py-3.5">
        <p className="font-eyebrow mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">
          <User className="size-3 text-brand" aria-hidden />
          Contact
        </p>
        <div className="flex flex-col gap-3.5">
          <Field
            label="Name"
            htmlFor="customerName"
            error={errors.customerName?.message}
          >
            <input
              id="customerName"
              className={fieldClassName(Boolean(errors.customerName))}
              autoComplete="name"
              aria-invalid={Boolean(errors.customerName)}
              {...register("customerName")}
            />
          </Field>

          <Field
            label="Phone"
            htmlFor="customerPhone"
            error={errors.customerPhone?.message}
            hint="03XXXXXXXXX or +923XXXXXXXXX"
          >
            <div className="relative">
              <Phone
                className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted"
                aria-hidden
              />
              <input
                id="customerPhone"
                className={`${fieldClassName(Boolean(errors.customerPhone))} pl-9`}
                inputMode="tel"
                autoComplete="tel"
                placeholder="03XX XXXXXXX"
                aria-invalid={Boolean(errors.customerPhone)}
                {...register("customerPhone")}
              />
            </div>
          </Field>

          <Field
            label="Email (optional)"
            htmlFor="customerEmail"
            error={errors.customerEmail?.message}
          >
            <input
              id="customerEmail"
              type="email"
              className={fieldClassName(Boolean(errors.customerEmail))}
              autoComplete="email"
              aria-invalid={Boolean(errors.customerEmail)}
              {...register("customerEmail")}
            />
          </Field>
        </div>
      </section>

      {orderType === "delivery" ? (
        <section className="rounded-xl border border-line bg-white px-3.5 py-3.5">
          <p className="font-eyebrow mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">
            <MapPinned className="size-3 text-brand" aria-hidden />
            Delivery address
          </p>
          <div className="flex flex-col gap-3.5">
            <Field
              label="Full address"
              htmlFor="address"
              error={errors.address?.message}
            >
              <textarea
                id="address"
                className={textareaClassName(Boolean(errors.address))}
                aria-invalid={Boolean(errors.address)}
                {...register("address")}
              />
            </Field>
            <Field
              label="Area / landmark"
              htmlFor="areaLandmark"
              error={errors.areaLandmark?.message}
            >
              <input
                id="areaLandmark"
                className={fieldClassName(Boolean(errors.areaLandmark))}
                aria-invalid={Boolean(errors.areaLandmark)}
                {...register("areaLandmark")}
              />
            </Field>
            <Field
              label="Map pin link (optional)"
              htmlFor="mapPinUrl"
              error={errors.mapPinUrl?.message}
            >
              <input
                id="mapPinUrl"
                className={fieldClassName(Boolean(errors.mapPinUrl))}
                placeholder="https://maps.google.com/…"
                aria-invalid={Boolean(errors.mapPinUrl)}
                {...register("mapPinUrl")}
              />
            </Field>
            <Field
              label="Delivery instructions (optional)"
              htmlFor="deliveryInstructions"
              error={errors.deliveryInstructions?.message}
            >
              <textarea
                id="deliveryInstructions"
                className={textareaClassName(
                  Boolean(errors.deliveryInstructions),
                )}
                aria-invalid={Boolean(errors.deliveryInstructions)}
                {...register("deliveryInstructions")}
              />
            </Field>
          </div>
        </section>
      ) : null}

      {orderType === "dinein" ? (
        <section className="rounded-xl border border-line bg-white px-3.5 py-3.5">
          <p className="font-eyebrow mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">
            <Users className="size-3 text-brand" aria-hidden />
            Table
          </p>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <Field
              label="Table number (optional)"
              htmlFor="tableNumber"
              error={errors.tableNumber?.message}
            >
              <input
                id="tableNumber"
                className={fieldClassName(Boolean(errors.tableNumber))}
                aria-invalid={Boolean(errors.tableNumber)}
                {...register("tableNumber")}
              />
            </Field>
            <Field
              label="Party size (optional)"
              htmlFor="partySize"
              error={errors.partySize?.message as string | undefined}
            >
              <input
                id="partySize"
                type="number"
                min={1}
                max={30}
                className={fieldClassName(Boolean(errors.partySize))}
                aria-invalid={Boolean(errors.partySize)}
                {...register("partySize")}
              />
            </Field>
          </div>
        </section>
      ) : null}

      <Field
        label="Order note (optional)"
        htmlFor="note"
        error={errors.note?.message}
      >
        <div className="relative">
          <StickyNote
            className="pointer-events-none absolute top-3 left-3 size-3.5 text-muted"
            aria-hidden
          />
          <textarea
            id="note"
            className={`${textareaClassName(Boolean(errors.note))} pl-9`}
            placeholder="Allergies, cutlery, etc."
            aria-invalid={Boolean(errors.note)}
            {...register("note")}
          />
        </div>
      </Field>

      {/* Honeypot — hidden from people, visible to bots */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="company">Company</label>
        <input
          id="company"
          tabIndex={-1}
          autoComplete="off"
          {...register("company")}
        />
      </div>
    </motion.div>
  );
}
