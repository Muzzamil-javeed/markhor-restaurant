import { describe, expect, it } from "vitest";
import {
  allowedNextStatuses,
  canTransitionStatus,
} from "@/lib/order-transitions";

describe("order status transitions", () => {
  it("allows the happy path for pickup", () => {
    expect(allowedNextStatuses("received", "pickup")).toEqual([
      "preparing",
      "cancelled",
    ]);
    expect(allowedNextStatuses("preparing", "pickup")).toEqual([
      "ready",
      "cancelled",
    ]);
    expect(allowedNextStatuses("ready", "pickup")).toEqual([
      "completed",
      "cancelled",
    ]);
    expect(allowedNextStatuses("completed", "pickup")).toEqual([]);
  });

  it("requires out_for_delivery before completed for delivery", () => {
    expect(allowedNextStatuses("ready", "delivery")).toEqual([
      "out_for_delivery",
      "cancelled",
    ]);
    expect(
      canTransitionStatus({
        from: "ready",
        to: "completed",
        orderType: "delivery",
      }).ok,
    ).toBe(false);
    expect(
      canTransitionStatus({
        from: "out_for_delivery",
        to: "completed",
        orderType: "delivery",
      }).ok,
    ).toBe(true);
  });

  it("blocks skipping and terminal rewrites", () => {
    expect(
      canTransitionStatus({
        from: "received",
        to: "ready",
        orderType: "dinein",
      }).ok,
    ).toBe(false);
    expect(
      canTransitionStatus({
        from: "cancelled",
        to: "preparing",
        orderType: "pickup",
      }).ok,
    ).toBe(false);
  });
});
