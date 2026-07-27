import type { SQL } from "drizzle-orm";
import type { ProdukQuerySchema } from "./model";
import { and, desc, eq, ilike } from "drizzle-orm";
import { db } from "~~/server/database";
import { produk } from "~~/server/database/schema/produk";

export abstract class ProdukRepo {
  static async findAll(query: ProdukQuerySchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.type) {
      conditions.push(eq(produk.type, query.type));
    }

    if (query.status !== undefined) {
      conditions.push(eq(produk.status, query.status));
    }

    if (query.search) {
      conditions.push(ilike(produk.judul, `%${query.search}%`));
    }

    const qb = db
      .select({
        id: produk.id,
        type: produk.type,
        judul: produk.judul,
        harga: produk.harga,
        status: produk.status,
        foto: produk.foto,
        createdAt: produk.createdAt,
        updatedAt: produk.updatedAt,
      })
      .from(produk)
      .where(and(...conditions))
      .orderBy(desc(produk.id));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }
}
