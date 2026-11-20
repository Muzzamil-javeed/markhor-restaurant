/**
 * Export a SQL dump of the current Postgres (menu overrides, orders, etc.)
 * for Softnox / office staging restore.
 *
 *   npx tsx scripts/export-db-dump.ts
 *
 * Writes: backups/markhor-postgres-YYYYMMDD.sql
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { Pool } from "pg";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

/** Delete children first; insert parents first. */
const DELETE_ORDER = [
  "OrderStatusEvent",
  "OrderItem",
  "Order",
  "MenuOverride",
  "MenuCustomItem",
] as const;

const INSERT_ORDER = [
  "MenuOverride",
  "MenuCustomItem",
  "Order",
  "OrderItem",
  "OrderStatusEvent",
] as const;

function normalizeDatabaseUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const mode = parsed.searchParams.get("sslmode");
    if (mode === "require" || mode === "prefer" || mode === "verify-ca") {
      parsed.searchParams.set("sslmode", "verify-full");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function sqlLiteral(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NULL";
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (value instanceof Date) return `'${value.toISOString()}'`;
  if (typeof value === "object") {
    return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

async function main() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL is not set.");

  const pool = new Pool({
    connectionString: normalizeDatabaseUrl(raw),
    max: 2,
    connectionTimeoutMillis: 20_000,
  });

  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const outDir = path.join(process.cwd(), "backups");
  await mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, `markhor-postgres-${stamp}.sql`);

  const chunks: string[] = [
    "-- Markhor Restaurant data export for staging restore",
    "-- Run AFTER: npx prisma migrate deploy",
    "-- Then: psql \"$DATABASE_URL\" -f this-file.sql",
    "BEGIN;",
    "",
  ];

  try {
    for (const table of DELETE_ORDER) {
      chunks.push(`DELETE FROM "${table}";`);
    }
    chunks.push("");

    for (const table of INSERT_ORDER) {
      const result = await pool.query(`SELECT * FROM "${table}"`);
      chunks.push(`-- ${table}: ${result.rows.length} rows`);
      if (result.rows.length === 0) {
        chunks.push("");
        continue;
      }
      const columns = result.fields.map((field) => `"${field.name}"`);
      for (const row of result.rows) {
        const values = result.fields.map((field) =>
          sqlLiteral((row as Record<string, unknown>)[field.name]),
        );
        chunks.push(
          `INSERT INTO "${table}" (${columns.join(", ")}) VALUES (${values.join(", ")});`,
        );
      }
      chunks.push("");
    }
    chunks.push("COMMIT;");
    await writeFile(outFile, chunks.join("\n"), "utf8");
    console.log(`Wrote ${outFile} (${INSERT_ORDER.length} tables)`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
