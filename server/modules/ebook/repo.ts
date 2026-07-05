import type { CreateEbookSchema, GetEbookSchema, UpdateEbookSchema } from "./model";
import { and, desc, eq, ilike, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import { ebookTable } from "~~/server/database/schema/ebook";
import { produkTable } from "~~/server/database/schema/produk";

export abstract class EbookRepo {
  static async create(data: Omit<CreateEbookSchema, "foto" | "pdfFile">, fotoKey: string, pdfKey: string) {
    return await db.transaction(async (tx) => {
      const [produk] = await tx
        .insert(produkTable)
        .values({
          type: "EBOOK",
          judul: data.judul,
          harga: data.harga,
          status: data.status,
          foto: fotoKey,
        })
        .returning();

      if (!produk) {
        throw new Error("Failed to create produk");
      }

      const [ebook] = await tx
        .insert(ebookTable)
        .values({
          produkId: produk.id,
          deskripsi: data.deskripsi,
          pdfUrl: pdfKey,
        })
        .returning();

      return { produk, ebook };
    });
  }

  static async update(id: number, data: Omit<UpdateEbookSchema, "foto" | "pdfFile">, fotoKey?: string, pdfKey?: string) {
    return await db.transaction(async (tx) => {
      const [ebook] = await tx
        .select()
        .from(ebookTable)
        .where(eq(ebookTable.id, id))
        .limit(1);

      if (!ebook)
        return false;

      if (data.judul !== undefined || data.harga !== undefined || data.status !== undefined || fotoKey) {
        await tx
          .update(produkTable)
          .set({
            ...(data.judul !== undefined && { judul: data.judul }),
            ...(data.harga !== undefined && { harga: data.harga }),
            ...(data.status !== undefined && { status: data.status }),
            ...(fotoKey && { foto: fotoKey }),
            updatedAt: new Date(),
          })
          .where(eq(produkTable.id, ebook.produkId));
      }

      if (data.deskripsi !== undefined || pdfKey) {
        await tx
          .update(ebookTable)
          .set({
            ...(data.deskripsi !== undefined && { deskripsi: data.deskripsi }),
            ...(pdfKey && { pdfUrl: pdfKey }),
          })
          .where(eq(ebookTable.id, id));
      }

      return true;
    });
  }

  static async findById(id: number) {
    const [result] = await db
      .select()
      .from(ebookTable)
      .innerJoin(produkTable, eq(ebookTable.produkId, produkTable.id))
      .where(eq(ebookTable.id, id))
      .limit(1);

    if (!result)
      return null;
    return { ...result.ebook, produk: result.produk };
  }

  static async findByIds(ids: number[]) {
    return await db
      .select()
      .from(ebookTable)
      .innerJoin(produkTable, eq(ebookTable.produkId, produkTable.id))
      .where(inArray(ebookTable.id, ids));
  }

  static async findAll(query: GetEbookSchema) {
    const conditions = [];

    if (query.search) {
      conditions.push(ilike(produkTable.judul, `%${query.search}%`));
    }

    const qb = db
      .select()
      .from(ebookTable)
      .innerJoin(produkTable, eq(ebookTable.produkId, produkTable.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(produkTable.createdAt));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return {
      total,
      data: data.map(d => ({ ...d.ebook, produk: d.produk })),
    };
  }

  static async delete(ids: number[]) {
    const ebooks = await this.findByIds(ids);
    const produkIds = ebooks.map(b => b.produk.id);

    if (produkIds.length > 0) {
      await db.delete(produkTable).where(inArray(produkTable.id, produkIds));
    }
    return true;
  }
}
