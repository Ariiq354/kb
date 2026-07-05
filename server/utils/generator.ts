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
