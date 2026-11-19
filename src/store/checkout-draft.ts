"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CheckoutFormInput } from "@/lib/checkout-schema";
import { defaultPaymentMethod } from "@/lib/payment";

export type CheckoutStep = 1 | 2 | 3;

type CheckoutDraftState = {
  step: CheckoutStep;
  values: Partial<CheckoutFormInput>;
  setStep: (step: CheckoutStep) => void;
  patchValues: (patch: Partial<CheckoutFormInput>) => void;
  reset: () => void;
};

const emptyValues: Partial<CheckoutFormInput> = {
  timing: "asap",
  paymentMethod: "cash",
  acceptTerms: false,
  company: "",
  customerEmail: "",
  note: "",
  partySize: undefined,
};

export const useCheckoutDraftStore = create<CheckoutDraftState>()(
  persist(
    (set) => ({
      step: 1,
      values: emptyValues,
      setStep: (step) => set({ step }),
      patchValues: (patch) =>
        set((state) => ({
          values: { ...state.values, ...patch },
        })),
      reset: () => set({ step: 1, values: emptyValues }),
    }),
    {
      name: "markhor-checkout-v1",
      partialize: (state) => ({
        step: state.step,
        values: {
          ...state.values,
          // never persist honeypot / lines (lines come from cart)
          company: "",
          lines: undefined,
        },
      }),
    },
  ),
);

export function syncPaymentDefault(
  orderType: "delivery" | "pickup" | "dinein",
  current?: string,
): string {
  if (current === "cash" || current === "counter") return current;
  return defaultPaymentMethod(orderType);
}
