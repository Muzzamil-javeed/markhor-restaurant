"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { OrderActions } from "@/components/order/order-actions";
import { OrderStatusTimeline } from "@/components/order/order-status-timeline";
import { OrderSummaryCard } from "@/components/order/order-summary-card";
import { useOrderPoll } from "@/hooks/use-order-poll";
import { fieldClassName } from "@/components/checkout/field";
import { orderStatusLabels } from "@/lib/order-status";

export function TrackOrderClient() {
  const params = useSearchParams();
  const [code, setCode] = useState(() => params.get("code") ?? "");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState<{
    code: string;
    phone: string;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const { order, error, loading, refresh } = useOrderPoll({
    code: submitted?.code ?? "",
    phone: submitted?.phone ?? "",
    enabled: Boolean(submitted),
  });

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);
    const normalisedCode = code.trim().toUpperCase();
    if (!/^MK-\d{4}$/i.test(normalisedCode)) {
      setFormError("Enter a code like MK-4821.");
      return;
    }
    if (!phone.trim()) {
      setFormError("Enter the phone number used on the order.");
      return;
    }
    setSubmitted({ code: normalisedCode, phone: phone.trim() });
  };

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-line bg-white p-4 sm:p-5"
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="track-code" className="text-sm font-medium text-ink">
              Order code
            </label>
            <input
              id="track-code"
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              placeholder="MK-4821"
              className={fieldClassName()}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="track-phone"
              className="text-sm font-medium text-ink"
            >
              Phone on the order
            </label>
            <input
              id="track-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="03XX XXXXXXX"
              inputMode="tel"
              className={fieldClassName()}
              autoComplete="tel"
            />
          </div>
        </div>
        {(formError || (submitted && error)) && (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {formError ?? error}
          </p>
        )}
        <button
          type="submit"
          className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-brand px-5 text-sm font-semibold text-on-brand hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:w-auto"
        >
          {loading && submitted ? "Looking up…" : "Track order"}
        </button>
      </form>

      {order ? (
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
              Live status
            </p>
            <h2 className="mt-1 font-heading text-2xl font-semibold text-ink">
              {order.code}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {orderStatusLabels[order.status]} · {order.etaLabel}
            </p>
            <button
              type="button"
              onClick={() => void refresh()}
              className="mt-2 text-xs font-medium text-brand underline-offset-2 hover:underline"
            >
              Refresh now
            </button>
          </div>
          <OrderStatusTimeline order={order} />
          <OrderSummaryCard order={order} />
          <OrderActions order={order} />
        </div>
      ) : null}
    </div>
  );
}
