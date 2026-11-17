"use client";

import Link from "next/link";
import { Ban, Banknote, Flame, ShoppingBag } from "lucide-react";
import { formatPKR } from "@/lib/format";
import { cn } from "@/lib/cn";

export type DailySummaryData = {
  date: string;
  ordersCount: number;
  cancelledCount: number;
  revenue: number;
  topItems: { name: string; qty: number }[];
};

const cardClass =
  "flex items-start gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(36,26,27,0.04)]";

export function DailySummary({ summary }: { summary: DailySummaryData | null }) {
  if (!summary) {
    return (
      <div className="rounded-2xl border border-line bg-white px-4 py-4 text-sm text-muted">
        Loading today’s summary…
      </div>
    );
  }

  return (
    <section
      aria-label="Daily summary"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      <div className={cardClass}>
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-tint text-brand">
          <ShoppingBag className="size-4" aria-hidden />
        </span>
        <div>
          <p className="font-eyebrow text-[10px] tracking-[0.16em] text-muted uppercase">
            Today · {summary.date}
          </p>
          <p className="mt-1.5 font-heading text-lg font-semibold text-ink">
            {summary.ordersCount} orders
          </p>
        </div>
      </div>

      <div className={cardClass}>
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-tint text-brand">
          <Banknote className="size-4" aria-hidden />
        </span>
        <div>
          <p className="font-eyebrow text-[10px] tracking-[0.16em] text-muted uppercase">
            Revenue
          </p>
          <p className="mt-1.5 font-heading text-lg font-semibold tabular-nums text-ink">
            {formatPKR(summary.revenue)}
          </p>
        </div>
      </div>

      <Link
        href="/admin/orders/cancelled"
        className={cn(
          cardClass,
          "group transition-all duration-200 hover:border-brand/25 hover:shadow-[0_8px_20px_rgba(94,15,29,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
        )}
      >
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-tint text-brand transition-colors duration-200 group-hover:bg-brand/10">
          <Ban className="size-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="font-eyebrow text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">
            Cancelled
          </p>
          <p className="mt-1.5 font-heading text-lg font-semibold tabular-nums text-ink">
            {summary.cancelledCount}{" "}
            {summary.cancelledCount === 1 ? "order" : "orders"}
          </p>
        </div>
      </Link>

      <div className={cardClass}>
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-tint text-brand">
          <Flame className="size-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="font-eyebrow text-[10px] tracking-[0.16em] text-muted uppercase">
            Top items
          </p>
          {summary.topItems.length > 0 ? (
            <p className="mt-1.5 line-clamp-2 text-sm text-ink">
              {summary.topItems
                .map((item) => `${item.name} (${item.qty})`)
                .join(" · ")}
            </p>
          ) : (
            <p className="mt-1.5 text-sm text-muted">No completed sales yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
