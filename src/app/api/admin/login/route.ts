import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_SESSION_COOKIE,
  adminCookieOptions,
  createAdminSessionToken,
} from "@/lib/admin-session";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  password: z.string().min(1, "Password is required."),
});

export async function POST(request: Request) {
  const limited = rateLimit({
    key: `admin-login:${clientIp(request)}`,
    limit: 8,
    windowMs: 15 * 60_000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait and try again." },
      { status: 429 },
    );
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not configured." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload." },
      { status: 400 },
    );
  }

  if (parsed.data.password !== expected) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = createAdminSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, adminCookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...adminCookieOptions(0),
    maxAge: 0,
  });
  return response;
}
