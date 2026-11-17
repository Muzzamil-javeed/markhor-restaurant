import { describe, expect, it } from "vitest";
import { computeCartTotals } from "@/lib/cart-totals";
import { karachiLocalDate } from "@/lib/hours";

describe("cart totals hand calculations", () => {
  it("gst = round((subtotal - discount) * rate); delivery added after gst", () => {
    // subtotal 2000, discount 0, delivery 100, rate 0.15
    // gst = round(2000 * 0.15) = 300
    // total = 2000 - 0 + 300 + 100 = 2400
    const totals = computeCartTotals({
      lines: [
        { unitPrice: 1200, quantity: 1 },
        { unitPrice: 400, quantity: 2 },
      ],
      orderType: "delivery",
      voucherCode: null,
      gstRate: 0.15,
      deliveryFee: 100,
    });

    expect(totals.subtotal).toBe(2000);
    expect(totals.discount).toBe(0);
    expect(totals.gst).toBe(300);
    expect(totals.deliveryFee).toBe(100);
    expect(totals.total).toBe(2400);
  });

  it("applies deliver20 before GST and keeps delivery outside the GST base", () => {
    // subtotal 2000, deliver20 → discount 400
    // gst = round(1600 * 0.15) = 240
    // total = 2000 - 400 + 240 + 100 = 1940
    const totals = computeCartTotals({
      lines: [{ unitPrice: 2000, quantity: 1 }],
      orderType: "delivery",
      voucherCode: "deliver20",
      gstRate: 0.15,
      deliveryFee: 100,
      now: karachiLocalDate(2026, 11, 16, 18, 0),
    });

    expect(totals.discount).toBe(400);
    expect(totals.gst).toBe(240);
    expect(totals.deliveryFee).toBe(100);
    expect(totals.total).toBe(1940);
    expect(totals.voucherCode).toBe("deliver20");
    expect(totals.voucherError).toBeNull();
  });

  it("applies lunch25 before GST with no delivery on pickup", () => {
    // subtotal 1800, lunch25 → discount 450
    // gst = round(1350 * 0.15) = 203
    // total = 1800 - 450 + 203 + 0 = 1553
    const totals = computeCartTotals({
      lines: [{ unitPrice: 900, quantity: 2 }],
      orderType: "pickup",
      voucherCode: "lunch25",
      gstRate: 0.15,
      deliveryFee: 250,
      now: karachiLocalDate(2026, 11, 16, 14, 0),
    });

    expect(totals.subtotal).toBe(1800);
    expect(totals.discount).toBe(450);
    expect(totals.gst).toBe(203);
    expect(totals.deliveryFee).toBe(0);
    expect(totals.total).toBe(1553);
  });

  it("ignores a failed voucher and still charges GST on full subtotal", () => {
    // lunch25 at 4:00 PM fails → discount 0
    // gst = round(1000 * 0.15) = 150
    // total = 1000 + 150 = 1150
    const totals = computeCartTotals({
      lines: [{ unitPrice: 1000, quantity: 1 }],
      orderType: "dinein",
      voucherCode: "lunch25",
      gstRate: 0.15,
      now: karachiLocalDate(2026, 11, 16, 16, 0),
    });

    expect(totals.discount).toBe(0);
    expect(totals.gst).toBe(150);
    expect(totals.total).toBe(1150);
    expect(totals.voucherCode).toBeNull();
    expect(totals.voucherError).toBe("Valid only between 1 PM and 4 PM.");
  });

  it("rounds GST to the nearest rupee", () => {
    // subtotal 1010 → gst = round(151.5) = 152
    const totals = computeCartTotals({
      lines: [{ unitPrice: 1010, quantity: 1 }],
      orderType: "pickup",
      gstRate: 0.15,
    });
    expect(totals.gst).toBe(152);
    expect(totals.total).toBe(1162);
  });
});
