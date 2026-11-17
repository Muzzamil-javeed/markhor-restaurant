"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { useCartStore } from "@/store/cart";
import { useToastStore } from "@/store/toast";

export function CartVoucher({ tone = "light" }: { tone?: "light" | "dark" }) {
  const voucherCode = useCartStore((state) => state.voucherCode);
  const voucherError = useCartStore((state) => state.voucherError);
  const applyVoucher = useCartStore((state) => state.applyVoucher);
  const removeVoucher = useCartStore((state) => state.removeVoucher);
  const showToast = useToastStore((state) => state.show);
  const [draft, setDraft] = useState("");
  const dark = tone === "dark";

  const tryApply = () => {
    const result = applyVoucher(draft);
    if (!result.ok) {
      showToast(result.reason ?? "Could not apply voucher.");
      return;
    }
    showToast(`Voucher ${draft.trim()} applied`);
  };

  if (voucherCode) {
    return (
      <div
        className={cn(
          "rounded-2xl border px-4 py-3",
          dark
            ? "border-cream/12 bg-cream/5"
            : "border-line bg-white",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p
              className={cn(
                "text-xs font-medium tracking-wide uppercase",
                dark ? "text-cream/45" : "text-muted",
              )}
            >
              Voucher applied
            </p>
            <p
              className={cn(
                "mt-0.5 font-heading text-sm font-semibold",
                dark ? "text-cream" : "text-brand",
              )}
            >
              {voucherCode}
            </p>
          </div>
          <button
            type="button"
            onClick={removeVoucher}
            className={cn(
              "rounded-full border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2",
              dark
                ? "border-cream/25 text-cream/80 hover:bg-cream/10 focus-visible:ring-cream/40"
                : "border-line text-ink hover:bg-tint focus-visible:ring-brand/40",
            )}
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3",
        dark ? "border-cream/12 bg-cream/5" : "border-line bg-white",
      )}
    >
      <label
        htmlFor="cart-voucher"
        className={cn(
          "text-xs font-medium tracking-wide uppercase",
          dark ? "text-cream/45" : "text-muted",
        )}
      >
        Voucher code
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="cart-voucher"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              tryApply();
            }
          }}
          placeholder="lunch25"
          className={cn(
            "h-10 min-w-0 flex-1 rounded-full border px-3 text-sm outline-none focus-visible:ring-2",
            dark
              ? "border-cream/20 bg-[#140D0E] text-cream placeholder:text-cream/35 focus-visible:ring-cream/40"
              : "border-line bg-background text-ink placeholder:text-muted focus-visible:ring-brand/40",
          )}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="button"
          onClick={tryApply}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-brand px-4 text-sm font-semibold text-on-brand hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          Apply
        </button>
      </div>
      {voucherError ? (
        <p
          className={cn(
            "mt-2 text-xs",
            dark ? "text-red-300" : "text-destructive",
          )}
          role="alert"
        >
          {voucherError}
        </p>
      ) : null}
    </div>
  );
}
