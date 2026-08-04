import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreateOrderSchema, UpdateOrderStatusSchema } from "./model";
import { createError } from "h3";
import { OrderRepo } from "./repo";

export abstract class OrderService {
  static async create(userId: number, payload: CreateOrderSchema) {
    return await OrderRepo.create(userId, payload);
  }

  static async checkUserProductOrder(userId: number, produkId: number) {
    return await OrderRepo.checkUserProductOrder(userId, produkId);
  }

  static async findUserPurchasedProducts(userId: number, type?: "BOOTCAMP" | "EBOOK" | "COURSE") {
    return await OrderRepo.findUserPurchasedProducts(userId, type);
  }

  static async findUserOrders(userId: number) {
    return await OrderRepo.findUserOrders(userId);
  }

  static async findAllAdmin(query: PaginationSearchSchema) {
    return await OrderRepo.findAllAdmin(query);
  }

  static async updateStatus(orderId: number, payload: UpdateOrderStatusSchema) {
    const existing = await OrderRepo.findById(orderId);
    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: "Order tidak ditemukan",
      });
    }
    return await OrderRepo.updateStatus(orderId, payload.status);
  }
}
