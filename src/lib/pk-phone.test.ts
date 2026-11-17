import { describe, expect, it } from "vitest";
import { normalisePkPhone } from "@/lib/pk-phone";

describe("Pakistan phone normalisation", () => {
  it("accepts 03XXXXXXXXX and +923XXXXXXXXX", () => {
    expect(normalisePkPhone("03322396608")).toBe("+923322396608");
    expect(normalisePkPhone("+92 332 2396608")).toBe("+923322396608");
    expect(normalisePkPhone("923322396608")).toBe("+923322396608");
  });

  it("rejects invalid numbers", () => {
    expect(normalisePkPhone("0211234567")).toBeNull();
    expect(normalisePkPhone("123")).toBeNull();
    expect(normalisePkPhone("")).toBeNull();
  });
});
