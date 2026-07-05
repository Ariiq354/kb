import { z } from "zod";
import { paginationSearchSchema } from "~~/server/utils/schema";

export const orderStatusEnum = z.enum(["PENDING_PAYMENT", "WAITING_VERIFICATION", "PAID"]);

export const createOrderSchema = z.object({
  produkId: z.coerce.number(),
  diskonId: z.coerce.number().optional(),
});
export type CreateOrderSchema = z.infer<typeof createOrderSchema>;

export const updateOrderSchema = z.object({
  status: orderStatusEnum.optional(),
});
export type UpdateOrderSchema = z.infer<typeof updateOrderSchema>;

export const getOrderSchema = z.object({
  ...paginationSearchSchema.shape,
  status: orderStatusEnum.optional(),
});
export type GetOrderSchema = z.infer<typeof getOrderSchema>;
