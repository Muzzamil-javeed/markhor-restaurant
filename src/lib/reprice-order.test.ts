import { describe, expect, it } from "vitest";
import { karachiLocalDate } from "@/lib/hours";
import { repriceOrderSync } from "@/lib/reprice-order";

describe("server reprice", () => {
  it("computes totals from menu.ts and ignores client unit prices", () => {
    const result = repriceOrderSync({
      lines: [
        {
          itemId: "soft-drink",
          quantity: 2,
        },
      ],
      orderType: "pickup",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.lines[0]?.unitPrice).toBe(210);
    expect(result.totals.subtotal).toBe(420);
    expect(result.totals.gst).toBe(63);
    expect(result.totals.total).toBe(483);
  });

  it("rejects unavailable items via override", () => {
    const result = repriceOrderSync({
      lines: [{ itemId: "soft-drink", quantity: 1 }],
      orderType: "delivery",
      overrides: new Map([
        ["soft-drink", { available: false, priceOverride: null }],
      ]),
    });
    expect(result.ok).toBe(false);
  });

  it("applies deliver20 on delivery only", () => {
    const now = karachiLocalDate(2026, 11, 16, 18, 0);
    const ok = repriceOrderSync({
      lines: [{ itemId: "soft-drink", quantity: 10 }],
      orderType: "delivery",
      voucherCode: "deliver20",
      now,
    });
    expect(ok.ok).toBe(true);
    if (ok.ok) {
      expect(ok.totals.discount).toBe(420);
    }

    const bad = repriceOrderSync({
      lines: [{ itemId: "soft-drink", quantity: 10 }],
      orderType: "pickup",
      voucherCode: "deliver20",
      now,
    });
    expect(bad.ok).toBe(false);
  });
});
