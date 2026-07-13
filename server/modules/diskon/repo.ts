import type { SQL } from "drizzle-orm";
import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreateDiskonSchema, UpdateDiskonSchema } from "./model";
import { and, desc, eq, ilike, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import { diskon } from "~~/server/database/schema/diskon";

export abstract class DiskonRepo {
  static async create(data: CreateDiskonSchema) {
    await db
      .insert(diskon)
      .values(data);
  }

  static async update(id: number, data: UpdateDiskonSchema) {
    return await db
      .update(diskon)
      .set(data)
      .where(eq(diskon.id, id))
      .returning({ id: diskon.id });
  }

  static async findAll(query: PaginationSearchSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      conditions.push(ilike(diskon.kode, `%${query.search}%`));
    }

    const qb = db
      .select({
        id: diskon.id,
        kode: diskon.kode,
        persen: diskon.persen,
        batasWaktu: diskon.batasWaktu,
        batasPemakai: diskon.batasPemakai,
        jumlahDipakai: diskon.jumlahDipakai,
        status: diskon.status,
      })
      .from(diskon)
      .where(and(...conditions))
      .orderBy(desc(diskon.id));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async delete(id: number[]) {
    return await db
      .delete(diskon)
      .where(inArray(diskon.id, id))
      .returning({ id: diskon.id });
  }
}
