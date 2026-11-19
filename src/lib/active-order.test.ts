import { describe, expect, it } from "vitest";
import { activeOrderHref, isTerminalOrderStatus } from "@/lib/active-order";

describe("active-order helpers", () => {
  it("treats completed and cancelled as terminal", () => {
    expect(isTerminalOrderStatus("completed")).toBe(true);
    expect(isTerminalOrderStatus("cancelled")).toBe(true);
    expect(isTerminalOrderStatus("preparing")).toBe(false);
    expect(isTerminalOrderStatus("ready")).toBe(false);
  });

  it("builds a secure order href", () => {
    expect(activeOrderHref("MK-1234", "tok&en")).toBe(
      "/order/MK-1234?token=tok%26en",
    );
  });
});
