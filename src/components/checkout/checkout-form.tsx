"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckoutProgress } from "@/components/checkout/checkout-progress";
import { StepDetails } from "@/components/checkout/step-details";
import { StepOrderType } from "@/components/checkout/step-order-type";
import { StepReview } from "@/components/checkout/step-review";
import { computeCartTotals } from "@/lib/cart-totals";
import {
  checkoutFormSchema,
  checkoutStep1Schema,
  checkoutStep2Schema,
  type CheckoutFormInput,
} from "@/lib/checkout-schema";
import { formatPKR } from "@/lib/format";
import { defaultPaymentMethod } from "@/lib/payment";
import {
  selectItemCount,
  useCartStore,
} from "@/store/cart";
import {
  syncPaymentDefault,
  useCheckoutDraftStore,
  type CheckoutStep,
} from "@/store/checkout-draft";
import { useOptionalTransitionNav } from "@/components/transition/TransitionProvider";
import { useToastStore } from "@/store/toast";
import { useCartHydration } from "@/store/use-cart-hydration";

export function CheckoutForm() {
  const router = useRouter();
  const transition = useOptionalTransitionNav();
  const hydrated = useCartHydration();
  const lines = useCartStore((state) => state.lines);
  const orderType = useCartStore((state) => state.orderType);
  const voucherCode = useCartStore((state) => state.voucherCode);
  const cartNote = useCartStore((state) => state.note);
  const setOrderType = useCartStore((state) => state.setOrderType);
  const clearCart = useCartStore((state) => state.clear);

  const draftStep = useCheckoutDraftStore((state) => state.step);
  const draftValues = useCheckoutDraftStore((state) => state.values);
  const setDraftStep = useCheckoutDraftStore((state) => state.setStep);
  const patchDraft = useCheckoutDraftStore((state) => state.patchValues);
  const resetDraft = useCheckoutDraftStore((state) => state.reset);

  const showToast = useToastStore((state) => state.show);
  const [step, setStep] = useState<CheckoutStep>(draftStep);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      timing: "asap",
      scheduledFor: "",
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      address: "",
      areaLandmark: "",
      mapPinUrl: "",
      deliveryInstructions: "",
      tableNumber: "",
      note: cartNote || "",
      paymentMethod: defaultPaymentMethod(orderType),
      acceptTerms: false,
      company: "",
      ...draftValues,
      orderType: (draftValues.orderType as typeof orderType) ?? orderType,
      voucherCode,
      lines,
    },
    mode: "onSubmit",
  });

  const watchedType = form.watch("orderType");
  const totals = useMemo(
    () =>
      computeCartTotals({
        lines,
        orderType: watchedType ?? orderType,
        voucherCode,
      }),
    [lines, watchedType, orderType, voucherCode],
  );

  useEffect(() => {
    form.setValue("lines", lines);
    form.setValue("voucherCode", voucherCode);
  }, [form, lines, voucherCode]);

  useEffect(() => {
    if (!watchedType) return;
    setOrderType(watchedType);
    const nextPay = syncPaymentDefault(
      watchedType,
      form.getValues("paymentMethod"),
    );
    form.setValue("paymentMethod", nextPay);
  }, [watchedType, setOrderType, form]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      patchDraft({
        ...values,
        lines: undefined,
        company: "",
      } as Partial<CheckoutFormInput>);
    });
    return () => subscription.unsubscribe();
  }, [form, patchDraft]);

  const count = hydrated ? selectItemCount(lines) : 0;

  if (!hydrated) {
    return <p className="text-sm text-muted">Loading checkout…</p>;
  }

  if (count === 0) {
    return (
      <div className="rounded-2xl border border-line bg-white px-5 py-8">
        <p className="font-heading text-lg font-semibold text-ink">
          Your cart is empty
        </p>
        <p className="mt-1 text-sm text-muted">
          Add something from the menu before checking out.
        </p>
        <a
          href="/menu"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-on-brand"
        >
          Browse menu
        </a>
      </div>
    );
  }

  const goNext = async () => {
    setSubmitError(null);
    const values = form.getValues();
    if (step === 1) {
      const result = checkoutStep1Schema.safeParse({
        orderType: values.orderType,
        timing: values.timing,
        scheduledFor: values.scheduledFor,
      });
      if (!result.success) {
        for (const issue of result.error.issues) {
          const path = issue.path[0];
          if (typeof path === "string") {
            form.setError(path as keyof CheckoutFormInput, {
              message: issue.message,
            });
          }
        }
        return;
      }
      setStep(2);
      setDraftStep(2);
      return;
    }

    if (step === 2) {
      const result = checkoutStep2Schema.safeParse({
        orderType: values.orderType,
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        customerEmail: values.customerEmail,
        address: values.address,
        areaLandmark: values.areaLandmark,
        mapPinUrl: values.mapPinUrl,
        deliveryInstructions: values.deliveryInstructions,
        tableNumber: values.tableNumber,
        partySize: values.partySize,
        note: values.note,
      });
      if (!result.success) {
        for (const issue of result.error.issues) {
          const path = issue.path[0];
          if (typeof path === "string") {
            form.setError(path as keyof CheckoutFormInput, {
              message: issue.message,
            });
          }
        }
        return;
      }
      // Apply normalised phone into the form for later submit
      form.setValue("customerPhone", result.data.customerPhone);
      setStep(3);
      setDraftStep(3);
    }
  };

  const goBack = () => {
    setSubmitError(null);
    const next = (step - 1) as CheckoutStep;
    setStep(next);
    setDraftStep(next);
  };

  const onPlaceOrder = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        ...values,
        lines,
        voucherCode,
        company: values.company ?? "",
      };
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        error?: string;
        orderCode?: string;
        trackingToken?: string;
      };
      if (!response.ok || !data.orderCode || !data.trackingToken) {
        const message = data.error ?? "Could not place the order.";
        setSubmitError(message);
        showToast(message);
        return;
      }
      // Clear cart only after a successful order response.
      clearCart();
      resetDraft();
      const next = `/order/${encodeURIComponent(data.orderCode)}?token=${encodeURIComponent(data.trackingToken)}`;
      if (transition) transition.navigate(next, "Order");
      else router.push(next);
    } catch {
      const message = "Network error — please try again.";
      setSubmitError(message);
      showToast(message);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onPlaceOrder} className="flex flex-col gap-6" noValidate>
      <CheckoutProgress step={step} />

      {step === 1 ? <StepOrderType form={form} /> : null}
      {step === 2 ? <StepDetails form={form} /> : null}
      {step === 3 ? (
        <StepReview
          form={form}
          lines={lines}
          voucherCode={voucherCode}
          total={totals.total}
        />
      ) : null}

      {submitError ? (
        <p className="text-sm text-destructive" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-line px-5 text-sm font-semibold text-ink hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            Back
          </button>
        ) : (
          <span />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-on-brand hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-on-brand hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-60"
          >
            {submitting
              ? "Placing order…"
              : `Place order · ${formatPKR(totals.total)}`}
          </button>
        )}
      </div>
    </form>
  );
}
