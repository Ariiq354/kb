import type { SQL } from "drizzle-orm";
import type { ProdukQuerySchema } from "./model";
import { and, desc, eq, ilike } from "drizzle-orm";
import { db } from "~~/server/database";
import { course } from "~~/server/database/schema/course";
import { produk } from "~~/server/database/schema/produk";
import { BootcampRepo } from "~~/server/modules/bootcamp/repo";
import { CourseRepo } from "~~/server/modules/course/repo";
import { EbookRepo } from "~~/server/modules/ebook/repo";

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

  static async findByType(type: "BOOTCAMP" | "COURSE" | "EBOOK", page = 1, limit = 10, search?: string) {
    const query = { page, limit, search, status: true };

    if (type === "BOOTCAMP") {
      return await BootcampRepo.findAll(query);
    }
    if (type === "COURSE") {
      return await CourseRepo.findAll(query);
    }
    if (type === "EBOOK") {
      return await EbookRepo.findAll(query);
    }

    return await this.findAll({ page, limit, search, type, status: true });
  }

  static async findById(id: number) {
    let prod = await db
      .select({
        id: produk.id,
        type: produk.type,
      })
      .from(produk)
      .where(eq(produk.id, id))
      .then(rows => rows[0]);

    if (!prod) {
      const courseProd = await db
        .select({
          id: produk.id,
          type: produk.type,
        })
        .from(course)
        .innerJoin(produk, eq(course.produkId, produk.id))
        .where(eq(course.id, id))
        .then(rows => rows[0]);

      if (courseProd) {
        prod = courseProd;
      }
    }

    if (!prod)
      return null;

    let res: any = null;
    if (prod.type === "BOOTCAMP") {
      res = await BootcampRepo.findById(prod.id);
    }
    else if (prod.type === "COURSE") {
      res = await CourseRepo.findById(prod.id);
    }
    else if (prod.type === "EBOOK") {
      res = await EbookRepo.findById(prod.id);
    }

    if (res) {
      res.type = prod.type;
    }

    return res;
  }
}
