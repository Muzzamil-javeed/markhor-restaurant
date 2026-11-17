import { describe, expect, it } from "vitest";
import { site } from "@/data/site";
import {
  formatTime12,
  getKarachiParts,
  getNextOpenLabel,
  getOpenStatus,
  karachiLocalDate,
  parseTimeToMinutes,
} from "@/lib/hours";

describe("hours", () => {
  it("parses HH:MM into minutes from midnight", () => {
    expect(parseTimeToMinutes("00:30")).toBe(30);
    expect(parseTimeToMinutes("12:30")).toBe(12 * 60 + 30);
    expect(parseTimeToMinutes("01:30")).toBe(90);
  });

  it("maps Date values into Asia/Karachi wall-clock parts", () => {
    const parts = getKarachiParts(karachiLocalDate(2026, 11, 16, 0, 15));
    expect(parts).toMatchObject({
      year: 2026,
      month: 11,
      day: 16,
      dayIndex: 1, // Monday
      hour: 0,
      minute: 15,
      minutesOfDay: 15,
    });
  });

  it("is open mid-afternoon on a weekday", () => {
    const status = getOpenStatus(karachiLocalDate(2026, 11, 16, 15, 0));
    expect(status).toMatchObject({
      isOpen: true,
      label: "Open",
      schedule: { id: "sun-thu" },
    });
  });

  it("is closed before opening on a weekday", () => {
    const status = getOpenStatus(karachiLocalDate(2026, 11, 16, 11, 0));
    expect(status).toEqual({ isOpen: false, label: "Closed", schedule: null });
  });

  it("handles Sun–Thu after-midnight close around Monday 12:30 AM", () => {
    // Monday 00:10 — still Sunday's service (closes 00:30).
    const mon0010 = getOpenStatus(karachiLocalDate(2026, 11, 16, 0, 10));
    expect(mon0010.isOpen).toBe(true);
    expect(mon0010.schedule?.id).toBe("sun-thu");

    // Monday 00:40 — closed until Monday 12:30 PM.
    const mon0040 = getOpenStatus(karachiLocalDate(2026, 11, 16, 0, 40));
    expect(mon0040).toEqual({
      isOpen: false,
      label: "Closed",
      schedule: null,
    });
  });

  it("handles Fri–Sat after-midnight close around Sunday 1:30 AM", () => {
    // Sunday 01:00 — still Saturday's service (closes 01:30).
    const sun0100 = getOpenStatus(karachiLocalDate(2026, 11, 15, 1, 0));
    expect(sun0100.isOpen).toBe(true);
    expect(sun0100.schedule?.id).toBe("fri-sat");

    // Sunday 01:45 — closed until Sunday 12:30 PM.
    const sun0145 = getOpenStatus(karachiLocalDate(2026, 11, 15, 1, 45));
    expect(sun0145).toEqual({
      isOpen: false,
      label: "Closed",
      schedule: null,
    });
  });

  it("keeps Friday service open at Saturday 1:00 AM", () => {
    const sat0100 = getOpenStatus(karachiLocalDate(2026, 11, 14, 1, 0));
    expect(sat0100.isOpen).toBe(true);
    expect(sat0100.schedule?.id).toBe("fri-sat");

    const sat0130 = getOpenStatus(karachiLocalDate(2026, 11, 14, 1, 30));
    expect(sat0130.isOpen).toBe(false);
  });

  it("opens exactly at 12:30 PM and uses site hours by default", () => {
    const atOpen = getOpenStatus(karachiLocalDate(2026, 11, 13, 12, 30));
    expect(atOpen.isOpen).toBe(true);
    expect(site.hours).toHaveLength(2);

    const oneMinuteEarly = getOpenStatus(karachiLocalDate(2026, 11, 13, 12, 29));
    expect(oneMinuteEarly.isOpen).toBe(false);
  });

  it("closes exactly at the published close minute (half-open interval)", () => {
    const thursdayNight = getOpenStatus(karachiLocalDate(2026, 11, 13, 0, 29));
    expect(thursdayNight.isOpen).toBe(true);
    expect(thursdayNight.schedule?.id).toBe("sun-thu");

    const atClose = getOpenStatus(karachiLocalDate(2026, 11, 13, 0, 30));
    expect(atClose.isOpen).toBe(false);
  });

  it("formats the next-open checkout message", () => {
    expect(formatTime12("12:30")).toBe("12:30 PM");
    expect(formatTime12("00:30")).toBe("12:30 AM");
    expect(getNextOpenLabel(karachiLocalDate(2026, 11, 16, 10, 0))).toBe(
      "We open at 12:30 PM",
    );
  });
});

