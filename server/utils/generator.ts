import type { AnyPgTable, PgColumn } from "drizzle-orm/pg-core";
import { randomInt } from "node:crypto";

import { eq } from "drizzle-orm";
import { db } from "../database";

export async function getUniqueNominal<
  TTable,
  TColumn,
>(
  nominal: number,
  table: TTable,
  column: TColumn,
): Promise<number> {
  while (true) {
    const uniqueCode = Math.floor(Math.random() * 500) + 1;
    const finalNominal = nominal + uniqueCode;

    const existing = await db
      .select()
      .from(table as any)
      .where(eq(column as any, finalNominal))
      .limit(1);

    if (existing.length === 0) {
      return finalNominal;
    }
  }
}

export async function generateUniqueCode(
  table: AnyPgTable,
  column: PgColumn,
  length = 6,
) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (let attempt = 0; attempt < 10; attempt++) {
    let code = "";

    for (let i = 0; i < length; i++) {
      code += chars[randomInt(chars.length)];
    }

    const exist = await db
      .select()
      .from(table)
      .where(eq(column, code))
      .limit(1);

    if (exist.length === 0) {
      return code;
    }
  }

  throw new Error("Failed to generate unique code");
}
