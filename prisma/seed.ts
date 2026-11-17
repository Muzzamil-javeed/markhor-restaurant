import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import path from "node:path";

function resolveSqliteUrl(): string {
  const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  if (!raw.startsWith("file:")) return raw;
  const filePath = raw.slice("file:".length);
  if (path.isAbsolute(filePath)) return raw;
  const relative = filePath.replace(/^\.[/\\]/, "");
  const underPrisma = relative.startsWith("prisma/")
    ? relative
    : path.posix.join("prisma", path.posix.basename(relative));
  return `file:${path.join(process.cwd(), underPrisma)}`;
}

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: resolveSqliteUrl() }),
});

async function main() {
  // Demo sold-out override (safe to re-run).
  await prisma.menuOverride.upsert({
    where: { itemId: "soft-drink" },
    create: {
      itemId: "soft-drink",
      available: true,
      priceOverride: null,
    },
    update: {},
  });

  console.log("Seed complete: MenuOverride for soft-drink ready.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
