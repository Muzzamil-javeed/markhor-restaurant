import { formatTime12, getKarachiParts } from "@/lib/hours";

export type EtaInput = {
  orderType: "delivery" | "pickup" | "dinein";
  timing: "asap" | "scheduled";
  scheduledFor?: Date | string | null;
  createdAt?: Date | string;
};

const ASAP_WINDOWS: Record<
  EtaInput["orderType"],
  { min: number; max: number }
> = {
  delivery: { min: 45, max: 60 },
  pickup: { min: 25, max: 35 },
  dinein: { min: 20, max: 30 },
};

function asDate(value?: Date | string | null): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatKarachiClock(date: Date): string {
  const parts = getKarachiParts(date);
  const hhmm = `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
  return formatTime12(hhmm);
}

/** Human ETA copy for confirmation / tracking. */
export function estimateOrderReadyLabel(input: EtaInput): string {
  if (input.timing === "scheduled") {
    const when = asDate(input.scheduledFor);
    if (when) {
      const parts = getKarachiParts(when);
      const day = `${parts.day}/${parts.month}/${parts.year}`;
      return `Scheduled for ${day} at ${formatKarachiClock(when)}`;
    }
    return "Scheduled — we will confirm the time";
  }

  const window = ASAP_WINDOWS[input.orderType];
  if (input.orderType === "delivery") {
    return `About ${window.min}–${window.max} minutes`;
  }
  if (input.orderType === "pickup") {
    return `Ready in about ${window.min}–${window.max} minutes`;
  }
  return `At your table in about ${window.min}–${window.max} minutes`;
}
