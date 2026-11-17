import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function resolveSqliteUrl(): string {
  const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  if (!raw.startsWith("file:")) return raw;
  const filePath = raw.slice("file:".length);
  if (path.isAbsolute(filePath)) return raw;
  // Scope to prisma/ so Turbopack does not trace the whole project.
  const relative = filePath.replace(/^\.[/\\]/, "");
  const underPrisma = relative.startsWith("prisma/")
    ? relative
    : path.posix.join("prisma", path.posix.basename(relative));
  return `file:${path.join(/* turbopackIgnore: true */ process.cwd(), underPrisma)}`;
}

function createPrismaClient(): PrismaClient {
  const url = resolveSqliteUrl();
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
