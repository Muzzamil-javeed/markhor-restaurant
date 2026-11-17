import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin-auth";
import { dailySummary } from "@/lib/admin-orders";

export async function GET(request: Request) {
  const auth = assertAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const summary = await dailySummary();
  return NextResponse.json({ summary });
}
