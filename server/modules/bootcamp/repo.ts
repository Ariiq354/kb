import type { CreateBootcampSchema, GetBootcampSchema, UpdateBootcampSchema } from "./model";
import { and, desc, eq, ilike, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import { bootcampTable } from "~~/server/database/schema/bootcamp";
import { produkTable } from "~~/server/database/schema/produk";

export abstract class BootcampRepo {
  static async create(data: Omit<CreateBootcampSchema, "file">, foto: string) {
    return await db.transaction(async (tx) => {
      const [produk] = await tx
        .insert(produkTable)
        .values({
          type: "BOOTCAMP",
          judul: data.judul,
          harga: data.harga,
          status: data.status,
          foto,
        })
        .returning();

      if (!produk) {
        throw new Error("Failed to create tiket");
      }

      const [bootcamp] = await tx
        .insert(bootcampTable)
        .values({
          produkId: produk.id,
          deskripsi: data.deskripsi,
          tipe: data.tipe,
          tempat: data.tempat,
          waktu: data.waktu,
          pembicara: data.pembicara,
          googleMapLink: data.googleMapLink,
          meetingLink: data.meetingLink,
        })
        .returning();

      return { produk, bootcamp };
    });
  }

  static async update(id: number, data: Omit<UpdateBootcampSchema, "file">, foto?: string) {
    return await db.transaction(async (tx) => {
      const [bootcamp] = await tx
        .select()
        .from(bootcampTable)
        .where(eq(bootcampTable.id, id))
        .limit(1);

      if (!bootcamp)
        return false;

      if (data.judul !== undefined || data.harga !== undefined || data.status !== undefined || foto) {
        await tx
          .update(produkTable)
          .set({
            ...(data.judul !== undefined && { judul: data.judul }),
            ...(data.harga !== undefined && { harga: data.harga }),
            ...(data.status !== undefined && { status: data.status }),
            ...(foto && { foto }),
            updatedAt: new Date(),
          })
          .where(eq(produkTable.id, bootcamp.produkId));
      }

      const updateData = {
        ...(data.deskripsi !== undefined && { deskripsi: data.deskripsi }),
        ...(data.tipe !== undefined && { tipe: data.tipe }),
        ...(data.tempat !== undefined && { tempat: data.tempat }),
        ...(data.waktu !== undefined && { waktu: data.waktu }),
        ...(data.pembicara !== undefined && { pembicara: data.pembicara }),
        ...(data.googleMapLink !== undefined && { googleMapLink: data.googleMapLink }),
        ...(data.meetingLink !== undefined && { meetingLink: data.meetingLink }),
      };

      if (Object.keys(updateData).length > 0) {
        await tx
          .update(bootcampTable)
          .set(updateData)
          .where(eq(bootcampTable.id, id));
      }

      return true;
    });
  }

  static async findById(id: number) {
    const [result] = await db
      .select()
      .from(bootcampTable)
      .innerJoin(produkTable, eq(bootcampTable.produkId, produkTable.id))
      .where(eq(bootcampTable.id, id))
      .limit(1);

    if (!result)
      return null;
    return { ...result.bootcamp, produk: result.produk };
  }

  static async findByIds(ids: number[]) {
    return await db
      .select()
      .from(bootcampTable)
      .innerJoin(produkTable, eq(bootcampTable.produkId, produkTable.id))
      .where(inArray(bootcampTable.id, ids));
  }

  static async findAll(query: GetBootcampSchema) {
    const conditions = [];

    if (query.search) {
      conditions.push(ilike(produkTable.judul, `%${query.search}%`));
    }

    if (query.tipe) {
      conditions.push(eq(bootcampTable.tipe, query.tipe));
    }

    const qb = db
      .select()
      .from(bootcampTable)
      .innerJoin(produkTable, eq(bootcampTable.produkId, produkTable.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(produkTable.createdAt));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return {
      total,
      data: data.map(d => ({ ...d.bootcamp, produk: d.produk })),
    };
  }

  static async delete(ids: number[]) {
    const bootcamps = await this.findByIds(ids);
    const produkIds = bootcamps.map(b => b.produk.id);

    if (produkIds.length > 0) {
      await db.delete(produkTable).where(inArray(produkTable.id, produkIds));
    }
    return true;
  }
}
