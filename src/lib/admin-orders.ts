import type { Order, OrderItem, OrderStatusEvent } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { canTransitionStatus } from "@/lib/order-transitions";
import { toPublicOrder } from "@/lib/order-public";

type OrderWithRelations = Order & {
  items: OrderItem[];
  statusEvents: OrderStatusEvent[];
};

export type AdminOrder = ReturnType<typeof toPublicOrder> & {
  id: string;
  phone: string;
  email: string | null;
  trackingToken: string;
  cancelReason: string | null;
  mapPinUrl: string | null;
  deliveryInstructions: string | null;
  statusEvents: { status: string; at: string }[];
};

function toAdminOrder(order: OrderWithRelations): AdminOrder {
  return {
    ...toPublicOrder(order),
    id: order.id,
    phone: order.phone,
    email: order.email,
    trackingToken: order.trackingToken,
    cancelReason: order.cancelReason,
    mapPinUrl: order.mapPinUrl,
    deliveryInstructions: order.deliveryInstructions,
    statusEvents: order.statusEvents.map((event) => ({
      status: event.status,
      at: event.at.toISOString(),
    })),
  };
}

const includeRelations = {
  items: true,
  statusEvents: { orderBy: { at: "asc" as const } },
};

export async function listAdminOrders(input?: {
  status?: string;
  take?: number;
}): Promise<AdminOrder[]> {
  const orders = await prisma.order.findMany({
    where: input?.status ? { status: input.status } : undefined,
    include: includeRelations,
    orderBy: { createdAt: "desc" },
    take: input?.take ?? 100,
  });

  return orders.map(toAdminOrder);
}

export async function getAdminOrderById(
  id: string,
): Promise<AdminOrder | null> {
  const order = await prisma.order.findUnique({
    where: { id },
    include: includeRelations,
  });
  if (!order) return null;
  return toAdminOrder(order);
}

export async function transitionOrderStatus(input: {
  code?: string;
  id?: string;
  status: string;
  paymentStatus?: string;
  cancelReason?: string;
}): Promise<
  | { ok: true; order: AdminOrder }
  | { ok: false; reason: string; status: 400 | 404 }
> {
  if (!input.code && !input.id) {
    return { ok: false, reason: "Provide order id or code.", status: 400 };
  }

  const existing = await prisma.order.findFirst({
    where: input.id ? { id: input.id } : { code: input.code!.toUpperCase() },
    include: includeRelations,
  });

  if (!existing) {
    return { ok: false, reason: "Order not found.", status: 404 };
  }

  if (input.status === "cancelled") {
    const reason = input.cancelReason?.trim();
    if (!reason) {
      return {
        ok: false,
        reason: "Cancel reason is required.",
        status: 400,
      };
    }
  }

  if (input.status !== existing.status) {
    const check = canTransitionStatus({
      from: existing.status,
      to: input.status,
      orderType: existing.type,
    });
    if (!check.ok) {
      return { ok: false, reason: check.reason, status: 400 };
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: existing.id },
      data: {
        status: input.status,
        ...(input.paymentStatus
          ? { paymentStatus: input.paymentStatus }
          : {}),
        ...(input.status === "cancelled"
          ? { cancelReason: input.cancelReason!.trim() }
          : {}),
      },
    });

    if (input.status !== existing.status) {
      await tx.orderStatusEvent.create({
        data: {
          orderId: existing.id,
          status: input.status,
        },
      });
    }

    return tx.order.findUniqueOrThrow({
      where: { id: existing.id },
      include: includeRelations,
    });
  });

  return { ok: true, order: toAdminOrder(updated) };
}

export async function dailySummary(now: Date = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const [orders, cancelledCount, completedCount] = await Promise.all([
    prisma.order.findMany({
      where: {
        createdAt: { gte: start, lt: end },
        status: { not: "cancelled" },
      },
      include: { items: true },
    }),
    prisma.order.count({
      where: {
        createdAt: { gte: start, lt: end },
        status: "cancelled",
      },
    }),
    prisma.order.count({
      where: {
        createdAt: { gte: start, lt: end },
        status: "completed",
      },
    }),
  ]);

  const itemCounts = new Map<string, { name: string; qty: number }>();
  let revenue = 0;

  for (const order of orders) {
    revenue += order.total;
    for (const item of order.items) {
      const current = itemCounts.get(item.itemId) ?? {
        name: item.name,
        qty: 0,
      };
      current.qty += item.qty;
      itemCounts.set(item.itemId, current);
    }
  }

  const topItems = [...itemCounts.values()]
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return {
    date: start.toISOString().slice(0, 10),
    ordersCount: orders.length,
    cancelledCount,
    completedCount,
    revenue,
    topItems,
  };
}
