import type { SQL } from "drizzle-orm";
import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreateBootcampSchema, UpdateBootcampSchema } from "./model";
import { and, desc, eq, ilike, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import { bootcamp } from "~~/server/database/schema/bootcamp";
import { produk } from "~~/server/database/schema/produk";

export abstract class BootcampRepo {
  static async create(payload: Omit<CreateBootcampSchema, "file">, foto: string) {
    return await db.transaction(async (tx) => {
      const [res] = await tx
        .insert(produk)
        .values({
          type: "BOOTCAMP",
          judul: payload.judul,
          harga: payload.harga,
          status: payload.status,
          foto,
        })
        .returning({ id: produk.id });

      if (!res)
        throw new Error("Failed to create produk");

      await tx
        .insert(bootcamp)
        .values({
          produkId: res.id,
          deskripsi: payload.deskripsi,
          tipe: payload.tipe,
          tempat: payload.tempat,
          waktu: payload.waktu,
          pembicara: payload.pembicara,
          googleMapLink: payload.googleMapLink,
          meetingLink: payload.meetingLink,
        });
    });
  }

  static async update(produkId: number, payload: Omit<UpdateBootcampSchema, "file">, foto?: string) {
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
        .update(bootcamp)
        .set({
          deskripsi: payload.deskripsi,
          tipe: payload.tipe,
          tempat: payload.tempat,
          waktu: payload.waktu,
          pembicara: payload.pembicara,
          googleMapLink: payload.googleMapLink,
          meetingLink: payload.meetingLink,
        })
        .where(eq(bootcamp.produkId, produkId));

      return result;
    });
  }

  static async findById(id: number) {
    return await db.query.produk.findFirst({
      where: {
        id,
      },
      columns: {
        id: true,
        foto: true,
      },
    });
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
        deskripsi: bootcamp.deskripsi,
        tipe: bootcamp.tipe,
        tempat: bootcamp.tempat,
        waktu: bootcamp.waktu,
        pembicara: bootcamp.pembicara,
        googleMapLink: bootcamp.googleMapLink,
        meetingLink: bootcamp.meetingLink,
        createdAt: produk.createdAt,
        updatedAt: produk.updatedAt,
      })
      .from(bootcamp)
      .innerJoin(produk, eq(bootcamp.produkId, produk.id))
      .where(and(...conditions))
      .orderBy(desc(bootcamp.id));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async delete(produkIds: number[]) {
    return await db.transaction(async (tx) => {
      return await tx
        .delete(produk)
        .where(inArray(produk.id, produkIds))
        .returning({ id: produk.id, foto: produk.foto });
    });
  }
}
