import type { CreateOrderSchema, GetOrderSchema, UpdateOrderSchema } from "./model";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import { userTable } from "~~/server/database/schema/auth";
import { diskonTable } from "~~/server/database/schema/diskon";
import { orders, produkTable } from "~~/server/database/schema/produk";

export abstract class OrderRepo {
  static async create(data: CreateOrderSchema & { userId: number }) {
    return await db.transaction(async (tx) => {
      const [produk] = await tx
        .select()
        .from(produkTable)
        .where(eq(produkTable.id, data.produkId))
        .limit(1);

      if (!produk)
        throw new Error("Produk tidak ditemukan");

      let diskonPersen = 0;
      if (data.diskonId) {
        const [diskon] = await tx
          .select()
          .from(diskonTable)
          .where(eq(diskonTable.id, data.diskonId))
          .limit(1);
        if (diskon) {
          diskonPersen = diskon.persen;
        }
      }

      const originalHarga = produk.harga;
      const finalHarga = Math.max(0, originalHarga - (originalHarga * diskonPersen / 100));

      const [order] = await tx
        .insert(orders)
        .values({
          userId: data.userId,
          produkId: data.produkId,
          diskonId: data.diskonId,
          originalHarga,
          diskonPersen,
          finalHarga,
          status: "PENDING_PAYMENT",
        })
        .returning();

      return order;
    });
  }

  static async update(id: number, data: UpdateOrderSchema) {
    if (data.status) {
      const [result] = await db
        .update(orders)
        .set({ status: data.status, updatedAt: new Date() })
        .where(eq(orders.id, id))
        .returning();
      return result;
    }
    return true;
  }

  static async findById(id: number) {
    const [result] = await db
      .select()
      .from(orders)
      .leftJoin(produkTable, eq(orders.produkId, produkTable.id))
      .leftJoin(userTable, eq(orders.userId, userTable.id))
      .where(eq(orders.id, id))
      .limit(1);

    return result || null;
  }

  static async findAll(query: GetOrderSchema) {
    const conditions = [];

    if (query.status) {
      conditions.push(eq(orders.status, query.status));
    }

    const qb = db
      .select()
      .from(orders)
      .leftJoin(produkTable, eq(orders.produkId, produkTable.id))
      .leftJoin(userTable, eq(orders.userId, userTable.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(orders.createdAt));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async delete(ids: number[]) {
    return await db.delete(orders).where(inArray(orders.id, ids));
  }
}
