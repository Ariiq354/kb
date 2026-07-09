import type { SQL } from "drizzle-orm";
import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreateDiskonSchema, UpdateDiskonSchema } from "./model";
import { and, desc, eq, ilike, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import { diskonTable } from "~~/server/database/schema/diskon";

export class DiskonRepo {
  static async create(data: CreateDiskonSchema) {
    await db
      .insert(diskonTable)
      .values(data);
  }

  static async update(id: number, data: UpdateDiskonSchema) {
    return await db
      .update(diskonTable)
      .set(data)
      .where(eq(diskonTable.id, id))
      .returning({ id: diskonTable.id });
  }

  static async findAll(query: PaginationSearchSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      conditions.push(ilike(diskonTable.kode, `%${query.search}%`));
    }

    const qb = db
      .select({
        id: diskonTable.id,
        kode: diskonTable.kode,
        persen: diskonTable.persen,
        batasWaktu: diskonTable.batasWaktu,
        batasPemakai: diskonTable.batasPemakai,
        jumlahDipakai: diskonTable.jumlahDipakai,
        status: diskonTable.status,
      })
      .from(diskonTable)
      .where(and(...conditions))
      .orderBy(desc(diskonTable.id));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async delete(id: number[]) {
    return await db
      .delete(diskonTable)
      .where(inArray(diskonTable.id, id))
      .returning({ id: diskonTable.id });
  }
}
