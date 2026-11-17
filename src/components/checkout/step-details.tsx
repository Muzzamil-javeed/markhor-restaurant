"use client";

import type { UseFormReturn } from "react-hook-form";
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
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-heading text-lg font-semibold text-ink">
          Your details
        </p>
        <p className="mt-1 text-sm text-muted">
          We use these to confirm the order — phone is required.
        </p>
      </div>

      <Field
        label="Name"
        htmlFor="customerName"
        error={errors.customerName?.message}
      >
        <input
          id="customerName"
          className={fieldClassName}
          autoComplete="name"
          {...register("customerName")}
        />
      </Field>

      <Field
        label="Phone"
        htmlFor="customerPhone"
        error={errors.customerPhone?.message}
        hint="03XXXXXXXXX or +923XXXXXXXXX"
      >
        <input
          id="customerPhone"
          className={fieldClassName}
          inputMode="tel"
          autoComplete="tel"
          placeholder="03XX XXXXXXX"
          {...register("customerPhone")}
        />
      </Field>

      <Field
        label="Email (optional)"
        htmlFor="customerEmail"
        error={errors.customerEmail?.message}
      >
        <input
          id="customerEmail"
          type="email"
          className={fieldClassName}
          autoComplete="email"
          {...register("customerEmail")}
        />
      </Field>

      {orderType === "delivery" ? (
        <>
          <Field
            label="Full address"
            htmlFor="address"
            error={errors.address?.message}
          >
            <textarea
              id="address"
              className={textareaClassName}
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
              className={fieldClassName}
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
              className={fieldClassName}
              placeholder="https://maps.google.com/…"
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
              className={textareaClassName}
              {...register("deliveryInstructions")}
            />
          </Field>
        </>
      ) : null}

      {orderType === "dinein" ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Table number (optional)"
            htmlFor="tableNumber"
            error={errors.tableNumber?.message}
          >
            <input
              id="tableNumber"
              className={fieldClassName}
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
              className={fieldClassName}
              {...register("partySize")}
            />
          </Field>
        </div>
      ) : null}

      <Field
        label="Order note (optional)"
        htmlFor="note"
        error={errors.note?.message}
      >
        <textarea
          id="note"
          className={textareaClassName}
          placeholder="Allergies, cutlery, etc."
          {...register("note")}
        />
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
    </div>
  );
}
