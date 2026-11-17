import { afterAll, describe, expect, it } from "vitest";
import { createOrder } from "@/lib/create-order";
import { prisma } from "@/lib/db";
import { karachiLocalDate } from "@/lib/hours";
import { transitionOrderStatus } from "@/lib/admin-orders";

describe("create order + status events", () => {
  const createdCodes: string[] = [];

  afterAll(async () => {
    if (createdCodes.length) {
      await prisma.order.deleteMany({
        where: { code: { in: createdCodes } },
      });
    }
    await prisma.$disconnect();
  });

  it("creates an order with server totals and a received status event", async () => {
    const result = await createOrder({
      orderType: "pickup",
      timing: "scheduled",
      scheduledFor: karachiLocalDate(2026, 11, 17, 13, 0),
      customerName: "Module Ten",
      phone: "+923001112233",
      paymentMethod: "counter",
      lines: [{ itemId: "soft-drink", quantity: 2 }],
      now: karachiLocalDate(2026, 11, 16, 18, 0),
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    createdCodes.push(result.orderCode);

    expect(result.total).toBe(483);

    const order = await prisma.order.findUniqueOrThrow({
      where: { code: result.orderCode },
      include: { items: true, statusEvents: true },
    });

    expect(order.type).toBe("pickup");
    expect(order.phone).toBe("+923001112233");
    expect(order.paymentStatus).toBe("unpaid");
    expect(order.items[0]?.qty).toBe(2);
    expect(order.items[0]?.unitPrice).toBe(210);
    expect(order.statusEvents.map((event) => event.status)).toEqual([
      "received",
    ]);
  });

  it("records status transitions with rules enforced", async () => {
    const created = await createOrder({
      orderType: "delivery",
      timing: "scheduled",
      scheduledFor: karachiLocalDate(2026, 11, 17, 14, 0),
      customerName: "Transition Guest",
      phone: "+923009998877",
      address: "DHA Phase 6",
      area: "Nishat",
      paymentMethod: "cash",
      lines: [{ itemId: "soft-drink", quantity: 1 }],
      now: karachiLocalDate(2026, 11, 16, 18, 0),
    });
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    createdCodes.push(created.orderCode);

    const skip = await transitionOrderStatus({
      code: created.orderCode,
      status: "ready",
    });
    expect(skip.ok).toBe(false);

    const preparing = await transitionOrderStatus({
      code: created.orderCode,
      status: "preparing",
    });
    expect(preparing.ok).toBe(true);

    const ready = await transitionOrderStatus({
      code: created.orderCode,
      status: "ready",
    });
    expect(ready.ok).toBe(true);

    const out = await transitionOrderStatus({
      code: created.orderCode,
      status: "out_for_delivery",
    });
    expect(out.ok).toBe(true);

    const done = await transitionOrderStatus({
      code: created.orderCode,
      status: "completed",
    });
    expect(done.ok).toBe(true);
    if (!done.ok) return;
    expect(done.order.statusEvents.map((event) => event.status)).toEqual([
      "received",
      "preparing",
      "ready",
      "out_for_delivery",
      "completed",
    ]);
  });
});
