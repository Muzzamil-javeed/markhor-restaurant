"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, RefreshCw } from "lucide-react";
import type { DailyRevenueRow, RevenueHistory } from "@/lib/admin-revenue";
import { cn } from "@/lib/cn";
import { formatPKR } from "@/lib/format";

const DAY_OPTIONS = [7, 14, 30, 60] as const;

function formatDayLabel(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  try {
    return new Intl.DateTimeFormat("en-PK", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Karachi",
    }).format(new Date(Date.UTC(year, month - 1, day, 7, 0, 0)));
  } catch {
    return isoDate;
  }
}

function PeriodCards({ history }: { history: RevenueHistory }) {
  const cards = [
    {
      label: "Completed revenue",
      value: formatPKR(history.periodRevenue),
    },
    {
      label: "Completed orders",
      value: String(history.periodCompleted),
    },
    {
      label: "Orders placed",
      value: String(history.periodOrdersPlaced),
    },
    {
      label: "Cancelled",
      value: String(history.periodCancelled),
    },
  ] as const;

  return (
    <section
      aria-label="Period totals"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex items-start gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 shadow-[0_8px_22px_rgba(36,26,27,0.05)]"
        >
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-tint text-brand">
            <Banknote className="size-4" aria-hidden />
          </span>
          <div>
            <p className="font-eyebrow text-[10px] tracking-[0.16em] text-muted uppercase">
              {card.label}
            </p>
            <p className="mt-1.5 font-heading text-lg font-semibold tabular-nums text-ink">
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}

function DayTable({ rows }: { rows: DailyRevenueRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-line bg-white px-4 py-8 text-center text-sm text-muted">
        No days in this window.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_8px_22px_rgba(36,26,27,0.05)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-[#faf7f5] text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
              <th className="px-4 py-3 font-medium">Day</th>
              <th className="px-4 py-3 text-right font-medium">Placed</th>
              <th className="px-4 py-3 text-right font-medium">Completed</th>
              <th className="px-4 py-3 text-right font-medium">Cancelled</th>
              <th className="px-4 py-3 text-right font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.date}
                className="border-b border-line/70 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-ink">
                  {formatDayLabel(row.date)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink">
                  {row.ordersPlaced}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink">
                  {row.completedCount}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted">
                  {row.cancelledCount}
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-ink">
                  {row.revenue > 0 ? formatPKR(row.revenue) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RevenueHistoryPanel() {
  const router = useRouter();
  const [days, setDays] = useState<(typeof DAY_OPTIONS)[number]>(30);
  const [history, setHistory] = useState<RevenueHistory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/revenue?days=${days}`, {
        cache: "no-store",
      });
      if (response.status === 401) {
        router.replace("/admin/login?next=/admin/revenue");
        return;
      }
      const data = (await response.json()) as {
        history?: RevenueHistory;
        error?: string;
      };
      if (!response.ok || !data.history) {
        setError(data.error ?? "Could not load revenue history.");
        return;
      }
      setHistory(data.history);
      setError(null);
    } catch {
      setError("Network error — try refresh.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [days, router]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(id);
  }, [load]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-eyebrow text-[10px] font-semibold tracking-[0.18em] text-brand uppercase">
            History
          </p>
          <h1 className="font-display mt-1 text-3xl tracking-tight text-ink uppercase">
            Daily revenue
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Completed sales by Asia/Karachi day. Orders stay in Completed /
            Cancelled — nothing is deleted.
          </p>
          <p className="mt-1 text-xs text-muted">
            Prices are exclusive of GST. Items are subject to availability.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex rounded-full border border-line bg-white p-1 shadow-sm"
            role="group"
            aria-label="Days to show"
          >
            {DAY_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  if (option === days) return;
                  setHistory(null);
                  setLoading(true);
                  setDays(option);
                }}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                  days === option
                    ? "bg-brand text-on-brand"
                    : "text-ink/75 hover:bg-tint hover:text-ink",
                )}
              >
                {option}d
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              void load();
            }}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink transition-colors hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <RefreshCw
              className={cn("size-4", refreshing && "animate-spin")}
              aria-hidden
            />
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}

      {loading && !history ? (
        <p className="rounded-2xl border border-line bg-white px-4 py-8 text-center text-sm text-muted">
          Loading revenue…
        </p>
      ) : history ? (
        <>
          <PeriodCards history={history} />
          <DayTable rows={history.days} />
        </>
      ) : null}
    </div>
  );
}
