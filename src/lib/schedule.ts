import type { DayHours } from "@/data/site";
import { site } from "@/data/site";
import {
  getKarachiParts,
  getOpenStatus,
  karachiLocalDate,
  parseTimeToMinutes,
} from "@/lib/hours";

export const SCHEDULE_MIN_LEAD_MINUTES = 45;
export const SCHEDULE_SLOT_MINUTES = 15;

function scheduleForDay(
  hours: readonly DayHours[],
  dayIndex: number,
): DayHours | undefined {
  return hours.find((entry) => entry.dayIndexes.includes(dayIndex));
}

/** True when `date` falls inside published opening hours (Asia/Karachi). */
export function isMomentOpen(
  date: Date,
  hours: readonly DayHours[] = site.hours,
): boolean {
  return getOpenStatus(date, hours).isOpen;
}

/**
 * Earliest allowed scheduled datetime: first open slot at least 45 minutes ahead.
 */
export function earliestSchedulableAt(
  now: Date = new Date(),
  hours: readonly DayHours[] = site.hours,
): Date | null {
  return listScheduleSlots(now, hours, 3)[0] ?? null;
}

/** Generate open-hour slots (Karachi wall clock) for the next `days` calendar days. */
export function listScheduleSlots(
  now: Date = new Date(),
  hours: readonly DayHours[] = site.hours,
  days = 2,
): Date[] {
  const slots: Date[] = [];
  const minLeadMs = now.getTime() + SCHEDULE_MIN_LEAD_MINUTES * 60_000;
  const startParts = getKarachiParts(now);
  const startNoon = karachiLocalDate(
    startParts.year,
    startParts.month,
    startParts.day,
    12,
    0,
  );

  for (let dayOffset = 0; dayOffset < days; dayOffset += 1) {
    const dayDate = new Date(startNoon.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    const dayParts = getKarachiParts(dayDate);
    const schedule = scheduleForDay(hours, dayParts.dayIndex);
    if (!schedule) continue;

    const opens = parseTimeToMinutes(schedule.opens);
    let closesExclusive = parseTimeToMinutes(schedule.closes);
    if (schedule.closesNextDay) {
      closesExclusive += 24 * 60;
    }

    for (
      let minute = opens;
      minute < closesExclusive;
      minute += SCHEDULE_SLOT_MINUTES
    ) {
      const dayAdd = Math.floor(minute / (24 * 60));
      const tod = minute % (24 * 60);
      const hour = Math.floor(tod / 60);
      const min = tod % 60;

      const slotDay = new Date(
        karachiLocalDate(
          dayParts.year,
          dayParts.month,
          dayParts.day,
          12,
          0,
        ).getTime() +
          dayAdd * 24 * 60 * 60 * 1000,
      );
      const slotDayParts = getKarachiParts(slotDay);
      const slot = karachiLocalDate(
        slotDayParts.year,
        slotDayParts.month,
        slotDayParts.day,
        hour,
        min,
      );

      if (slot.getTime() < minLeadMs) continue;
      if (!getOpenStatus(slot, hours).isOpen) continue;
      slots.push(slot);
    }
  }

  return slots;
}

export function isValidScheduledTime(
  scheduledFor: Date,
  now: Date = new Date(),
  hours: readonly DayHours[] = site.hours,
): { ok: true } | { ok: false; reason: string } {
  const leadMs = SCHEDULE_MIN_LEAD_MINUTES * 60_000;
  if (scheduledFor.getTime() < now.getTime() + leadMs) {
    return {
      ok: false,
      reason: `Scheduled time must be at least ${SCHEDULE_MIN_LEAD_MINUTES} minutes from now.`,
    };
  }
  if (!getOpenStatus(scheduledFor, hours).isOpen) {
    return {
      ok: false,
      reason: "Scheduled time must fall within opening hours.",
    };
  }
  return { ok: true };
}

/** datetime-local value in Asia/Karachi wall clock. */
export function toDatetimeLocalValue(date: Date): string {
  const parts = getKarachiParts(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
}

export function fromDatetimeLocalValue(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  if ([year, month, day, hour, minute].some((n) => Number.isNaN(n))) {
    return null;
  }
  return karachiLocalDate(year, month, day, hour, minute);
}
