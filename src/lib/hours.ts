import type { DayHours } from "@/data/site";
import { site } from "@/data/site";

export type OpenStatus = {
  isOpen: boolean;
  label: "Open" | "Closed";
  /** Schedule that covers this moment, when open. */
  schedule: DayHours | null;
};

export type KarachiParts = {
  year: number;
  month: number;
  day: number;
  /** 0 = Sunday … 6 = Saturday. */
  dayIndex: number;
  hour: number;
  minute: number;
  minutesOfDay: number;
};

const WEEKDAY_TO_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** Parse `HH:MM` into minutes from midnight. */
export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new Error(`Invalid time: ${time}`);
  }
  return hours * 60 + minutes;
}

export function getKarachiParts(
  date: Date,
  timeZone: string = site.timezone,
): KarachiParts {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value;

  const weekday = read("weekday");
  const dayIndex = weekday ? WEEKDAY_TO_INDEX[weekday] : undefined;
  if (dayIndex === undefined) {
    throw new Error(`Could not resolve weekday for ${date.toISOString()}`);
  }

  const year = Number(read("year"));
  const month = Number(read("month"));
  const day = Number(read("day"));
  const hour = Number(read("hour"));
  const minute = Number(read("minute"));

  if ([year, month, day, hour, minute].some((value) => Number.isNaN(value))) {
    throw new Error(`Could not resolve Karachi parts for ${date.toISOString()}`);
  }

  return {
    year,
    month,
    day,
    dayIndex,
    hour,
    minute,
    minutesOfDay: hour * 60 + minute,
  };
}

function scheduleForDay(
  hours: readonly DayHours[],
  dayIndex: number,
): DayHours | undefined {
  return hours.find((entry) => entry.dayIndexes.includes(dayIndex));
}

/**
 * Open/closed for a wall-clock moment in Asia/Karachi.
 * Handles after-midnight closes (Sun–Thu 12:30 AM, Fri–Sat 1:30 AM).
 */
export function getOpenStatus(
  date: Date = new Date(),
  hours: readonly DayHours[] = site.hours,
  timeZone: string = site.timezone,
): OpenStatus {
  const parts = getKarachiParts(date, timeZone);
  const today = scheduleForDay(hours, parts.dayIndex);
  const yesterday = scheduleForDay(hours, (parts.dayIndex + 6) % 7);

  if (
    yesterday?.closesNextDay &&
    parts.minutesOfDay < parseTimeToMinutes(yesterday.closes)
  ) {
    return { isOpen: true, label: "Open", schedule: yesterday };
  }

  if (today) {
    const opensAt = parseTimeToMinutes(today.opens);
    if (today.closesNextDay) {
      if (parts.minutesOfDay >= opensAt) {
        return { isOpen: true, label: "Open", schedule: today };
      }
    } else {
      const closesAt = parseTimeToMinutes(today.closes);
      if (parts.minutesOfDay >= opensAt && parts.minutesOfDay < closesAt) {
        return { isOpen: true, label: "Open", schedule: today };
      }
    }
  }

  return { isOpen: false, label: "Closed", schedule: null };
}

export function isOpenNow(
  date: Date = new Date(),
  hours: readonly DayHours[] = site.hours,
  timeZone: string = site.timezone,
): boolean {
  return getOpenStatus(date, hours, timeZone).isOpen;
}

/**
 * Build a Date whose Asia/Karachi wall clock matches the given local parts.
 * Karachi is UTC+5 with no daylight saving.
 */
export function karachiLocalDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  const pad = (value: number) => String(value).padStart(2, "0");
  return new Date(
    `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00+05:00`,
  );
}

/** Format `HH:MM` (24h) as `12:30 PM`. */
export function formatTime12(time: string): string {
  const minutes = parseTimeToMinutes(time);
  const hour24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

/**
 * Next daily open time for checkout gating.
 * Restaurant opens at the same wall-clock time every day.
 */
export function getNextOpenLabel(
  date: Date = new Date(),
  hours: readonly DayHours[] = site.hours,
  timeZone: string = site.timezone,
): string {
  const parts = getKarachiParts(date, timeZone);
  const today = scheduleForDay(hours, parts.dayIndex);
  const opens = today?.opens ?? hours[0]?.opens ?? "12:30";
  return `We open at ${formatTime12(opens)}`;
}
