import { NextResponse } from "next/server";
import { z } from "zod";
import { assertAdmin } from "@/lib/admin-auth";
import {
  listAdminOrders,
  transitionOrderStatus,
} from "@/lib/admin-orders";
import { ORDER_STATUSES } from "@/lib/order-status";

export async function GET(request: Request) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? undefined;
  const takeRaw = url.searchParams.get("take");
  const take = takeRaw ? Number(takeRaw) : 100;

  const orders = await listAdminOrders({
    status,
    take: Number.isFinite(take) ? Math.min(200, Math.max(1, take)) : 100,
  });

  return NextResponse.json({ orders });
}

const patchSchema = z.object({
  id: z.string().optional(),
  code: z.string().optional(),
  status: z.enum(ORDER_STATUSES),
  cancelReason: z.string().trim().min(2).max(240).optional(),
  paymentStatus: z
    .enum(["unpaid", "pending", "paid", "failed", "refunded"])
    .optional(),
});

export async function PATCH(request: Request) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload." },
      { status: 400 },
    );
  }

  const result = await transitionOrderStatus(parsed.data);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.reason },
      { status: result.status },
    );
  }

  return NextResponse.json({ order: result.order });
}
