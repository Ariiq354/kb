import type { SQL } from "drizzle-orm";
import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreateOrderSchema } from "./model";
import { and, desc, eq, ilike } from "drizzle-orm";
import { db } from "~~/server/database";
import { user } from "~~/server/database/schema/auth";
import { diskon } from "~~/server/database/schema/diskon";
import { orders, produk } from "~~/server/database/schema/produk";
import { ProdukRepo } from "~~/server/modules/produk/repo";

export abstract class OrderRepo {
  static async create(userId: number, payload: CreateOrderSchema) {
    const prod = await ProdukRepo.findById(payload.produkId);

    if (!prod) {
      throw new Error("Produk tidak ditemukan");
    }

    const existing = await this.checkUserProductOrder(userId, prod.id);
    if (existing.hasOrder && existing.status === "PAID") {
      throw new Error("Anda sudah memiliki produk ini");
    }
    if (existing.hasOrder && (existing.status === "WAITING_VERIFICATION" || existing.status === "PENDING_PAYMENT")) {
      return {
        ...existing.order,
        produk: prod,
        isExistingPending: true,
      };
    }

    let diskonId: number | null = null;
    let diskonPersen = 0;

    if (payload.kodeKupon?.trim()) {
      const [disk] = await db
        .select()
        .from(diskon)
        .where(and(eq(diskon.kode, payload.kodeKupon.trim()), eq(diskon.status, true)));

      if (disk) {
        diskonId = disk.id;
        diskonPersen = disk.persen;
      }
    }

    const originalHarga = prod.harga || 0;
    const diskonNominal = Math.round(originalHarga * (diskonPersen / 100));
    const finalHarga = Math.max(0, originalHarga - diskonNominal);

    // If total price is 0 rupiah, order is automatically marked as PAID
    const status = finalHarga === 0 ? "PAID" : "WAITING_VERIFICATION";

    const [newOrder] = await db
      .insert(orders)
      .values({
        userId,
        produkId: prod.id,
        diskonId,
        originalHarga,
        diskonPersen,
        finalHarga,
        status,
      })
      .returning();

    return {
      ...newOrder,
      produk: prod,
    };
  }

  static async checkUserProductOrder(userId: number, produkId: number) {
    const [existingOrder] = await db
      .select({
        id: orders.id,
        status: orders.status,
        originalHarga: orders.originalHarga,
        finalHarga: orders.finalHarga,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .where(and(eq(orders.userId, userId), eq(orders.produkId, produkId)))
      .orderBy(desc(orders.id));

    if (!existingOrder) {
      return { hasOrder: false };
    }

    return {
      hasOrder: true,
      status: existingOrder.status,
      order: existingOrder,
    };
  }

  static async findUserPurchasedProducts(userId: number, type?: "BOOTCAMP" | "EBOOK" | "COURSE") {
    const conditions: (SQL<unknown> | undefined)[] = [
      eq(orders.userId, userId),
    ];

    if (type) {
      conditions.push(eq(produk.type, type));
    }

    const rows = await db
      .select({
        id: produk.id,
        type: produk.type,
        judul: produk.judul,
        harga: produk.harga,
        foto: produk.foto,
        orderId: orders.id,
        orderStatus: orders.status,
        purchasedAt: orders.createdAt,
      })
      .from(orders)
      .innerJoin(produk, eq(orders.produkId, produk.id))
      .where(and(...conditions))
      .orderBy(desc(orders.id));

    // Enrich with detail info (bootcamp/course/ebook specific fields)
    const enriched = await Promise.all(
      rows.map(async (row) => {
        const fullDetail = await ProdukRepo.findById(row.id);
        return {
          ...row,
          ...fullDetail,
          orderStatus: row.orderStatus,
          // ensure id is produk.id
          id: row.id,
        };
      }),
    );

    return enriched;
  }

  static async findUserOrders(userId: number) {
    const rows = await db
      .select({
        id: orders.id,
        originalHarga: orders.originalHarga,
        diskonPersen: orders.diskonPersen,
        finalHarga: orders.finalHarga,
        status: orders.status,
        createdAt: orders.createdAt,
        produkId: produk.id,
        produkJudul: produk.judul,
        produkType: produk.type,
        produkFoto: produk.foto,
      })
      .from(orders)
      .innerJoin(produk, eq(orders.produkId, produk.id))
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.id));

    return rows;
  }

  static async findAllAdmin(query: PaginationSearchSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      conditions.push(ilike(produk.judul, `%${query.search}%`));
    }

    const qb = db
      .select({
        id: orders.id,
        userId: orders.userId,
        userName: user.name,
        userEmail: user.email,
        produkId: produk.id,
        produkJudul: produk.judul,
        produkType: produk.type,
        originalHarga: orders.originalHarga,
        diskonPersen: orders.diskonPersen,
        finalHarga: orders.finalHarga,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .innerJoin(user, eq(orders.userId, user.id))
      .innerJoin(produk, eq(orders.produkId, produk.id))
      .where(and(...conditions))
      .orderBy(desc(orders.id));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async updateStatus(orderId: number, status: "PENDING_PAYMENT" | "WAITING_VERIFICATION" | "PAID") {
    const [updated] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();

    return updated;
  }

  static async findById(id: number) {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));

    return order || null;
  }
}
