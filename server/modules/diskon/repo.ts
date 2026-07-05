import type { SQL } from "drizzle-orm";
import type { CreateDiskonSchema, GetDiskonSchema, UpdateDiskonSchema } from "./model";
import { and, desc, eq, ilike } from "drizzle-orm";
import { db } from "~~/server/database";
import { diskonTable } from "~~/server/database/schema/diskon";

export abstract class DiskonRepo {
  static async create(data: CreateDiskonSchema) {
    const [result] = await db
      .insert(diskonTable)
      .values(data)
      .returning();
    return result;
  }

  static async update(id: number, data: UpdateDiskonSchema) {
    const [result] = await db
      .update(diskonTable)
      .set(data)
      .where(eq(diskonTable.id, id))
      .returning();
    return result;
  }

  static async findById(id: number) {
    const [result] = await db
      .select()
      .from(diskonTable)
      .where(eq(diskonTable.id, id))
      .limit(1);
    return result || null;
  }

  static async findAll(query: GetDiskonSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      conditions.push(ilike(diskonTable.kode, `%${query.search}%`));
    }

    const qb = db
      .select()
      .from(diskonTable)
      .orderBy(desc(diskonTable.id))
      .where(and(...conditions));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async delete(id: number) {
    return await db
      .delete(diskonTable)
      .where(eq(diskonTable.id, id));
  }
}
