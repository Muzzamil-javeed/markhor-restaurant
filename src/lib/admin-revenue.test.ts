import { describe, expect, it } from "vitest";
import { karachiLocalDate } from "@/lib/hours";

describe("admin revenue day window helpers", () => {
  it("builds stable Karachi midnights for grouping", () => {
    const start = karachiLocalDate(2026, 11, 1, 0, 0);
    const next = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    expect(start.toISOString()).toContain("2026-10-31T19:00:00");
    expect(next.getTime() - start.getTime()).toBe(86_400_000);
  });
});
