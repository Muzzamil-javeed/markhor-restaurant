import { prisma } from "@/lib/db";
import { getKarachiParts, karachiLocalDate } from "@/lib/hours";

export type DailyRevenueRow = {
  /** Asia/Karachi calendar day `YYYY-MM-DD`. */
  date: string;
  /** Non-cancelled orders placed that day. */
  ordersPlaced: number;
  completedCount: number;
  cancelledCount: number;
  /** Sum of `total` for completed orders placed that day (PKR integer). */
  revenue: number;
};

export type RevenueHistory = {
  days: DailyRevenueRow[];
  /** Sum of daily completed revenue in the window. */
  periodRevenue: number;
  periodCompleted: number;
  periodCancelled: number;
  periodOrdersPlaced: number;
};

function dayKeyFromParts(parts: {
  year: number;
  month: number;
  day: number;
}): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

function emptyRow(date: string): DailyRevenueRow {
  return {
    date,
    ordersPlaced: 0,
    completedCount: 0,
    cancelledCount: 0,
    revenue: 0,
  };
}

/**
 * Day-by-day revenue for staff (Asia/Karachi).
 * Revenue counts completed orders only — cancelled are listed separately.
 */
export async function revenueHistory(input?: {
  days?: number;
  now?: Date;
}): Promise<RevenueHistory> {
  const days = Math.min(Math.max(input?.days ?? 30, 1), 90);
  const now = input?.now ?? new Date();
  const todayParts = getKarachiParts(now);
  const todayStart = karachiLocalDate(
    todayParts.year,
    todayParts.month,
    todayParts.day,
    0,
    0,
  );
  // Inclusive window: today and the previous (days - 1) Karachi dates.
  const rangeStart = new Date(
    todayStart.getTime() - (days - 1) * 24 * 60 * 60 * 1000,
  );
  const rangeEndExclusive = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: rangeStart,
        lt: rangeEndExclusive,
      },
    },
    select: {
      createdAt: true,
      status: true,
      total: true,
    },
  });

  const byDay = new Map<string, DailyRevenueRow>();
  for (let offset = 0; offset < days; offset += 1) {
    const cursor = new Date(
      rangeStart.getTime() + offset * 24 * 60 * 60 * 1000,
    );
    const key = dayKeyFromParts(getKarachiParts(cursor));
    byDay.set(key, emptyRow(key));
  }

  for (const order of orders) {
    const key = dayKeyFromParts(getKarachiParts(order.createdAt));
    const row = byDay.get(key);
    if (!row) continue;

    if (order.status === "cancelled") {
      row.cancelledCount += 1;
      continue;
    }

    row.ordersPlaced += 1;
    if (order.status === "completed") {
      row.completedCount += 1;
      row.revenue += order.total;
    }
  }

  const rows = [...byDay.values()].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  );

  return {
    days: rows,
    periodRevenue: rows.reduce((sum, row) => sum + row.revenue, 0),
    periodCompleted: rows.reduce((sum, row) => sum + row.completedCount, 0),
    periodCancelled: rows.reduce((sum, row) => sum + row.cancelledCount, 0),
    periodOrdersPlaced: rows.reduce((sum, row) => sum + row.ordersPlaced, 0),
  };
}
