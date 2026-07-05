import { createOrderSchema } from "~~/server/modules/orders/model";
import { OrderService } from "~~/server/modules/orders/service";

export default defineEventHandler(async (event) => {
  authGuard(event);
  const body = await readValidatedBodySafe(event, createOrderSchema);
  return await OrderService.create({ ...body, userId: event.context.user!.id });
});
