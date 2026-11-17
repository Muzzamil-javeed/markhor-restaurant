import { describe, expect, it } from "vitest";
import { karachiLocalDate } from "@/lib/hours";
import {
  isValidScheduledTime,
  listScheduleSlots,
  SCHEDULE_MIN_LEAD_MINUTES,
} from "@/lib/schedule";

describe("schedule slots", () => {
  it("only returns slots at least 45 minutes ahead during open hours", () => {
    const now = karachiLocalDate(2026, 11, 16, 13, 0); // Monday 1 PM open
    const slots = listScheduleSlots(now, undefined, 1);
    expect(slots.length).toBeGreaterThan(0);
    const lead = now.getTime() + SCHEDULE_MIN_LEAD_MINUTES * 60_000;
    expect(slots.every((slot) => slot.getTime() >= lead)).toBe(true);
  });

  it("rejects times inside the 45-minute lead window", () => {
    const now = karachiLocalDate(2026, 11, 16, 18, 0);
    const tooSoon = karachiLocalDate(2026, 11, 16, 18, 30);
    const result = isValidScheduledTime(tooSoon, now);
    expect(result.ok).toBe(false);
  });

  it("rejects times while closed", () => {
    const now = karachiLocalDate(2026, 11, 16, 10, 0);
    const closedSlot = karachiLocalDate(2026, 11, 16, 11, 0);
    const result = isValidScheduledTime(closedSlot, now);
    expect(result.ok).toBe(false);
  });
});
