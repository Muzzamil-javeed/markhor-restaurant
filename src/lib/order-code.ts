import { randomBytes, randomInt } from "node:crypto";
import { prisma } from "@/lib/db";

/** Human-friendly order code, e.g. MK-4821. */
export function formatOrderCode(n: number): string {
  return `MK-${String(n).padStart(4, "0")}`;
}

export function createTrackingToken(): string {
  return randomBytes(24).toString("base64url");
}

/** Allocate a unique MK-#### code (retry on rare collisions). */
export async function allocateOrderCode(): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const code = formatOrderCode(randomInt(1000, 10000));
    const existing = await prisma.order.findUnique({
      where: { code },
      select: { id: true },
    });
    if (!existing) return code;
  }
  throw new Error("Could not allocate a unique order code.");
}
