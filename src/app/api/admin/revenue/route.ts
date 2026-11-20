import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin-auth";
import { revenueHistory } from "@/lib/admin-revenue";

export async function GET(request: Request) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const url = new URL(request.url);
  const raw = Number(url.searchParams.get("days") ?? "30");
  const days = Number.isFinite(raw) ? raw : 30;

  const history = await revenueHistory({ days });
  return NextResponse.json({ history });
}
