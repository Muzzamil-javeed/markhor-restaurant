import { NextResponse } from "next/server";
import { accessOrder } from "@/lib/order-access";
import { clientIp, rateLimit } from "@/lib/rate-limit";

type RouteContext = {
  params: Promise<{ code: string }>;
};

function readCredential(request: Request): {
  token: string | null;
  phone: string | null;
} {
  const url = new URL(request.url);
  return {
    token: url.searchParams.get("token"),
    phone: url.searchParams.get("phone"),
  };
}

/** Secure order lookup — token or phone required. No enumeration. */
export async function GET(request: Request, context: RouteContext) {
  const limited = rateLimit({
    key: `order-get:${clientIp(request)}`,
    limit: 60,
    windowMs: 15 * 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait and try again." },
      { status: 429 },
    );
  }

  const { code } = await context.params;
  const { token, phone } = readCredential(request);
  const result = await accessOrder({ code, token, phone });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({ order: result.order });
}

/** Track form posts code + phone in the body. */
export async function POST(request: Request, context: RouteContext) {
  const limited = rateLimit({
    key: `order-post:${clientIp(request)}`,
    limit: 30,
    windowMs: 15 * 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait and try again." },
      { status: 429 },
    );
  }

  const { code } = await context.params;
  let body: { token?: string; phone?: string } = {};
  try {
    body = (await request.json()) as { token?: string; phone?: string };
  } catch {
    body = {};
  }

  const result = await accessOrder({
    code,
    token: body.token,
    phone: body.phone,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({ order: result.order });
}
