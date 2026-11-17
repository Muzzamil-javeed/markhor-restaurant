import { NextResponse } from "next/server";
import { checkoutFormSchema } from "@/lib/checkout-schema";
import { createOrder } from "@/lib/create-order";
import { isOpenNow } from "@/lib/hours";
import { orderNotifier } from "@/lib/notify";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  fromDatetimeLocalValue,
  isValidScheduledTime,
} from "@/lib/schedule";

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limited = rateLimit({
    key: `orders:${ip}`,
    limit: 8,
    windowMs: 15 * 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many orders from this network. Please wait and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(limited.retryAfterMs / 1000)),
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = checkoutFormSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      {
        error: first?.message ?? "Invalid order payload.",
        issues: parsed.error.issues,
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  if (data.company && data.company.length > 0) {
    return NextResponse.json(
      { error: "Unable to place order." },
      { status: 400 },
    );
  }

  const now = new Date();
  let scheduledFor: Date | null = null;

  if (data.timing === "scheduled") {
    scheduledFor = fromDatetimeLocalValue(data.scheduledFor ?? "");
    if (!scheduledFor) {
      return NextResponse.json(
        { error: "Scheduled time is invalid." },
        { status: 400 },
      );
    }
    const scheduleCheck = isValidScheduledTime(scheduledFor, now);
    if (!scheduleCheck.ok) {
      return NextResponse.json(
        { error: scheduleCheck.reason },
        { status: 400 },
      );
    }
  } else if (!isOpenNow(now)) {
    return NextResponse.json(
      {
        error:
          "We are closed right now. Please schedule your order for later.",
      },
      { status: 400 },
    );
  }

  const partySize =
    typeof data.partySize === "number" ? data.partySize : null;

  const created = await createOrder({
    orderType: data.orderType,
    timing: data.timing,
    scheduledFor,
    customerName: data.customerName,
    phone: data.customerPhone,
    email: data.customerEmail || null,
    address: data.address,
    area: data.areaLandmark,
    mapPinUrl: data.mapPinUrl,
    deliveryInstructions: data.deliveryInstructions,
    tableNo: data.tableNumber,
    partySize,
    note: data.note,
    paymentMethod: data.paymentMethod,
    voucherCode: data.voucherCode,
    lines: data.lines,
    now,
  });

  if (!created.ok) {
    return NextResponse.json({ error: created.reason }, { status: 400 });
  }

  await orderNotifier.notify({
    code: created.orderCode,
    orderType: data.orderType,
    timing: data.timing,
    scheduledFor: scheduledFor?.toISOString() ?? null,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    total: created.total,
    lines: data.lines.map((line) => ({
      quantity: line.quantity,
      name: line.name ?? line.itemId,
      lineTotal: (line.unitPrice ?? 0) * line.quantity,
    })),
    address: data.address,
    note: data.note,
  });

  return NextResponse.json({
    orderCode: created.orderCode,
    trackingToken: created.trackingToken,
  });
}
