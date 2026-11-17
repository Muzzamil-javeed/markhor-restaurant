import { getKarachiParts } from "@/lib/hours";

/** Build a Google Calendar template URL for a scheduled order. */
export function googleCalendarUrl(input: {
  code: string;
  title?: string;
  scheduledFor: Date;
  durationMinutes?: number;
  details?: string;
  location?: string;
}): string {
  const start = input.scheduledFor;
  const end = new Date(
    start.getTime() + (input.durationMinutes ?? 60) * 60_000,
  );

  const fmt = (date: Date) => {
    // Google expects UTC timestamps as YYYYMMDDTHHMMSSZ
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  };

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title ?? `Markhor order ${input.code}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: input.details ?? `Order ${input.code}`,
  });
  if (input.location) params.set("location", input.location);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Downloadable ICS content for scheduled orders. */
export function buildOrderIcs(input: {
  code: string;
  scheduledFor: Date;
  durationMinutes?: number;
  description?: string;
  location?: string;
}): string {
  const start = input.scheduledFor;
  const end = new Date(
    start.getTime() + (input.durationMinutes ?? 60) * 60_000,
  );
  const stamp = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

  const parts = getKarachiParts(start);
  const summary = `Markhor order ${input.code}`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Markhor Restaurant//Order//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${input.code}-${parts.year}${parts.month}${parts.day}@markhorsmokedmeat.com`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${(input.description ?? summary).replace(/\n/g, "\\n")}`,
    input.location ? `LOCATION:${input.location}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}
