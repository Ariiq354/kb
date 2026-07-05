import type { SQL } from "drizzle-orm";
import type { CreateProdukSchema, GetProdukSchema, UpdateProdukSchema } from "./model";
import { and, desc, eq, ilike } from "drizzle-orm";
import { db } from "~~/server/database";
import { produkTable } from "~~/server/database/schema/produk";

export abstract class ProdukRepo {
  static async create(data: Omit<CreateProdukSchema, "file">, foto: string) {
    const [result] = await db
      .insert(produkTable)
      .values({ ...data, foto })
      .returning();
    return result;
  }

  static async update(id: number, data: Omit<UpdateProdukSchema, "file">, foto?: string) {
    const updateData = foto ? { ...data, foto } : data;
    const [result] = await db
      .update(produkTable)
      .set(updateData)
      .where(eq(produkTable.id, id))
      .returning();
    return result;
  }

  static async findById(id: number) {
    const [result] = await db
      .select()
      .from(produkTable)
      .where(eq(produkTable.id, id))
      .limit(1);
    return result || null;
  }

  static async findAll(query: GetProdukSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      conditions.push(ilike(produkTable.judul, `%${query.search}%`));
    }

    if (query.type) {
      conditions.push(eq(produkTable.type, query.type));
    }

    const qb = db
      .select()
      .from(produkTable)
      .orderBy(desc(produkTable.id))
      .where(and(...conditions));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async delete(id: number) {
    return await db
      .delete(produkTable)
      .where(eq(produkTable.id, id));
  }
}
