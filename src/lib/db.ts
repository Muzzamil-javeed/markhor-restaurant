import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

/** pg v8 warns on sslmode=require; keep today's verify-full semantics explicitly. */
function normalizeDatabaseUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const mode = parsed.searchParams.get("sslmode");
    if (mode === "require" || mode === "prefer" || mode === "verify-ca") {
      parsed.searchParams.set("sslmode", "verify-full");
    }
    return parsed.toString();
  } catch {
    return url.replace(
      /([?&])sslmode=(require|prefer|verify-ca)\b/i,
      "$1sslmode=verify-full",
    );
  }
}

function createPool(): Pool {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set.");
  }
  const connectionString = normalizeDatabaseUrl(raw);
  return new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 15_000,
    allowExitOnIdle: true,
  });
}

function createPrismaClient(pool: Pool): PrismaClient {
  return new PrismaClient({ adapter: new PrismaPg(pool) });
}

function getPool(): Pool {
  if (!globalForPrisma.pgPool) {
    globalForPrisma.pgPool = createPool();
  }
  return globalForPrisma.pgPool;
}

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient(getPool());
  }
  return globalForPrisma.prisma;
}

/**
 * Stable export for existing imports. Always resolves to the live client
 * (after a reconnect, callers still hit the fresh instance).
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export function isPrismaConnectionError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const message =
    "message" in error && typeof error.message === "string"
      ? error.message.toLowerCase()
      : "";
  const code =
    "code" in error && typeof error.code === "string" ? error.code : "";
  return (
    code === "P1017" ||
    code === "P1001" ||
    code === "57P01" ||
    code === "ECONNRESET" ||
    message.includes("server has closed the connection") ||
    message.includes("connection terminated") ||
    message.includes("can't reach database") ||
    message.includes("connection refused")
  );
}

/** Drop stale pool/client so the next query opens a fresh connection. */
export async function resetPrismaConnection(): Promise<void> {
  const client = globalForPrisma.prisma;
  const pool = globalForPrisma.pgPool;
  globalForPrisma.prisma = undefined;
  globalForPrisma.pgPool = undefined;
  try {
    await client?.$disconnect();
  } catch {
    /* ignore */
  }
  try {
    await pool?.end();
  } catch {
    /* ignore */
  }
}

/** Retry once after resetting the pool when Prisma Postgres closes idle links. */
export async function withPrismaRetry<T>(
  run: (client: PrismaClient) => Promise<T>,
): Promise<T> {
  try {
    return await run(getPrisma());
  } catch (error) {
    if (!isPrismaConnectionError(error)) throw error;
    await resetPrismaConnection();
    return run(getPrisma());
  }
}
