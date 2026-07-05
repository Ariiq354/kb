import type { CreateOrderSchema, GetOrderSchema, UpdateOrderSchema } from "./model";
import { createError } from "h3";
import { OrderRepo } from "./repo";

export abstract class OrderService {
  static async create(payload: CreateOrderSchema & { userId: number }) {
    try {
      return await OrderRepo.create(payload);
    }
    catch (e: any) {
      throw createError({
        statusCode: 400,
        statusMessage: e.message || "Failed to create order",
      });
    }
  }

  static async update(id: number, payload: UpdateOrderSchema) {
    const order = await OrderRepo.findById(id);

    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: "Order tidak ditemukan",
      });
    }

    return await OrderRepo.update(id, payload);
  }

  static async findAll(query: GetOrderSchema) {
    return await OrderRepo.findAll(query);
  }

  static async delete(ids: number[]) {
    return await OrderRepo.delete(ids);
  }
}
