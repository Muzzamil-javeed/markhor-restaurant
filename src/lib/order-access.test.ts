import { describe, expect, it } from "vitest";
import { estimateOrderReadyLabel } from "@/lib/order-eta";
import { timelineStatuses } from "@/lib/order-status";

describe("order tracking helpers", () => {
  it("includes out for delivery only for delivery orders", () => {
    expect(timelineStatuses("delivery")).toContain("out_for_delivery");
    expect(timelineStatuses("pickup")).not.toContain("out_for_delivery");
    expect(timelineStatuses("dinein")).not.toContain("out_for_delivery");
  });

  it("describes scheduled and ASAP ETAs", () => {
    expect(
      estimateOrderReadyLabel({
        orderType: "delivery",
        timing: "asap",
      }),
    ).toMatch(/45–60/);

    expect(
      estimateOrderReadyLabel({
        orderType: "pickup",
        timing: "scheduled",
        scheduledFor: new Date("2026-11-16T17:00:00+05:00"),
      }),
    ).toMatch(/Scheduled for/);
  });
});
