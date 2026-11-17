"use client";

import { TransitionLink } from "@/components/transition/TransitionLink";
import { CalendarPlus, Phone, RotateCcw } from "lucide-react";
import { site } from "@/data/site";
import { buildOrderIcs, googleCalendarUrl } from "@/lib/calendar";
import { displayPhone, telHref } from "@/lib/phone";
import type { PublicOrder } from "@/lib/order-public";

export function OrderActions({ order }: { order: PublicOrder }) {
  const phone = displayPhone();
  const scheduled =
    order.timing === "scheduled" && order.scheduledFor
      ? new Date(order.scheduledFor)
      : null;

  const addToCalendar = () => {
    if (!scheduled) return;
    const ics = buildOrderIcs({
      code: order.code,
      scheduledFor: scheduled,
      description: `Markhor ${order.orderType} order ${order.code}`,
      location: site.address,
    });
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `markhor-${order.code}.ics`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <a
        href={telHref()}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-line bg-white px-4 text-sm font-semibold text-ink hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        <Phone className="size-4" aria-hidden />
        Call restaurant
        <span className="sr-only"> at {phone}</span>
      </a>
      <TransitionLink
        href="/menu"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-line bg-white px-4 text-sm font-semibold text-ink hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        <RotateCcw className="size-4" aria-hidden />
        Order again
      </TransitionLink>
      {scheduled ? (
        <>
          <button
            type="button"
            onClick={addToCalendar}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-line bg-white px-4 text-sm font-semibold text-ink hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <CalendarPlus className="size-4" aria-hidden />
            Add to calendar
          </button>
          <a
            href={googleCalendarUrl({
              code: order.code,
              scheduledFor: scheduled,
              details: `Markhor ${order.orderType} order ${order.code}`,
              location: site.address,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-brand px-4 text-sm font-semibold text-on-brand hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            Google Calendar
          </a>
        </>
      ) : null}
    </div>
  );
}

