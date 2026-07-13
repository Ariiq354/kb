import type { SQL } from "drizzle-orm";
import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreateEbookSchema, UpdateEbookSchema } from "./model";
import { and, desc, eq, ilike, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import { ebook } from "~~/server/database/schema/ebook";
import { produk } from "~~/server/database/schema/produk";

export abstract class EbookRepo {
  static async create(payload: Omit<CreateEbookSchema, "file" | "pdfFile">, foto: string, pdfUrl: string) {
    return await db.transaction(async (tx) => {
      const [res] = await tx
        .insert(produk)
        .values({
          type: "EBOOK",
          judul: payload.judul,
          harga: payload.harga,
          status: payload.status,
          foto,
        })
        .returning({ id: produk.id });

      if (!res)
        throw new Error("Failed to create produk");

      await tx
        .insert(ebook)
        .values({
          produkId: res.id,
          deskripsi: payload.deskripsi,
          pdfUrl,
        });
    });
  }

  static async update(produkId: number, payload: Omit<UpdateEbookSchema, "file" | "pdfFile">, foto?: string, pdfUrl?: string) {
    return await db.transaction(async (tx) => {
      const result = await tx
        .update(produk)
        .set({
          judul: payload.judul,
          harga: payload.harga,
          status: payload.status,
          ...(foto && { foto }),
        })
        .where(eq(produk.id, produkId));

      await tx
        .update(ebook)
        .set({
          deskripsi: payload.deskripsi,
          ...(pdfUrl && { pdfUrl }),
        })
        .where(eq(ebook.produkId, produkId));

      return result;
    });
  }

  static async findById(id: number) {
    return await db
      .select({
        id: produk.id,
        foto: produk.foto,
        pdfUrl: ebook.pdfUrl,
      })
      .from(ebook)
      .innerJoin(produk, eq(ebook.produkId, produk.id))
      .where(eq(produk.id, id))
      .then(rows => rows[0]);
  }

  static async findAll(query: PaginationSearchSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      conditions.push(ilike(produk.judul, `%${query.search}%`));
    }

    const qb = db
      .select({
        id: produk.id,
        judul: produk.judul,
        harga: produk.harga,
        status: produk.status,
        foto: produk.foto,
        deskripsi: ebook.deskripsi,
        pdfUrl: ebook.pdfUrl,
        createdAt: produk.createdAt,
        updatedAt: produk.updatedAt,
      })
      .from(ebook)
      .innerJoin(produk, eq(ebook.produkId, produk.id))
      .where(and(...conditions))
      .orderBy(desc(ebook.id));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async delete(produkIds: number[]) {
    return await db.transaction(async (tx) => {
      const rows = await tx
        .select({
          id: produk.id,
          foto: produk.foto,
          pdfUrl: ebook.pdfUrl,
        })
        .from(ebook)
        .innerJoin(produk, eq(ebook.produkId, produk.id))
        .where(inArray(produk.id, produkIds));

      if (rows.length === 0)
        return [];

      await tx
        .delete(produk)
        .where(inArray(produk.id, produkIds));

      return rows;
    });
  }
}
