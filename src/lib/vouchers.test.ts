import { describe, expect, it } from "vitest";
import { karachiLocalDate } from "@/lib/hours";
import { applyVoucherCode } from "@/lib/vouchers";

describe("voucher rules", () => {
  it("is case-insensitive and discounts lunch25 by 25%", () => {
    const result = applyVoucherCode(
      "LUNCH25",
      2000,
      "pickup",
      karachiLocalDate(2026, 11, 16, 13, 0),
    );
    expect(result).toEqual({ ok: true, discount: 500 });
  });

  it("accepts lunch25 at the 1:00 PM boundary and rejects 12:59 PM", () => {
    const atStart = applyVoucherCode(
      "lunch25",
      1000,
      "dinein",
      karachiLocalDate(2026, 11, 16, 13, 0),
    );
    expect(atStart).toEqual({ ok: true, discount: 250 });

    const before = applyVoucherCode(
      "lunch25",
      1000,
      "dinein",
      karachiLocalDate(2026, 11, 16, 12, 59),
    );
    expect(before.ok).toBe(false);
    if (!before.ok) {
      expect(before.reason).toBe("Valid only between 1 PM and 4 PM.");
    }
  });

  it("accepts lunch25 at 3:59 PM and rejects the 4:00 PM boundary", () => {
    const beforeEnd = applyVoucherCode(
      "lunch25",
      1000,
      "delivery",
      karachiLocalDate(2026, 11, 16, 15, 59),
    );
    expect(beforeEnd).toEqual({ ok: true, discount: 250 });

    const atEnd = applyVoucherCode(
      "lunch25",
      1000,
      "delivery",
      karachiLocalDate(2026, 11, 16, 16, 0),
    );
    expect(atEnd.ok).toBe(false);
    if (!atEnd.ok) {
      expect(atEnd.reason).toBe("Valid only between 1 PM and 4 PM.");
    }
  });

  it("applies deliver20 only on delivery orders", () => {
    const now = karachiLocalDate(2026, 11, 16, 18, 0);
    const delivery = applyVoucherCode("Deliver20", 2500, "delivery", now);
    expect(delivery).toEqual({ ok: true, discount: 500 });

    const pickup = applyVoucherCode("deliver20", 2500, "pickup", now);
    expect(pickup.ok).toBe(false);
    if (!pickup.ok) {
      expect(pickup.reason).toMatch(/delivery/i);
    }

    const dinein = applyVoucherCode("deliver20", 2500, "dinein", now);
    expect(dinein.ok).toBe(false);
  });

  it("rejects unknown codes and empty carts with clear reasons", () => {
    const unknown = applyVoucherCode(
      "nope",
      1000,
      "delivery",
      karachiLocalDate(2026, 11, 16, 14, 0),
    );
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) {
      expect(unknown.reason).toBe("That voucher code is not valid.");
    }

    const empty = applyVoucherCode(
      "lunch25",
      0,
      "delivery",
      karachiLocalDate(2026, 11, 16, 14, 0),
    );
    expect(empty.ok).toBe(false);
    if (!empty.ok) {
      expect(empty.reason).toBe("Add items before applying a voucher.");
    }
  });
});
