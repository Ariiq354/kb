import { z } from "zod";

export const createOrderSchema = z.object({
  produkId: z.number().int().positive(),
  kodeKupon: z.string().optional(),
});

export type CreateOrderSchema = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING_PAYMENT", "WAITING_VERIFICATION", "PAID"]),
});

export type UpdateOrderStatusSchema = z.infer<typeof updateOrderStatusSchema>;
