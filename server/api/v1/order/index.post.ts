import { createOrderSchema } from "~~/server/modules/order/model";
import { OrderService } from "~~/server/modules/order/service";
import { authGuard } from "~~/server/utils/guard";
import { readValidatedBodySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const body = await readValidatedBodySafe(event, createOrderSchema);

  return await OrderService.create(Number(user.id), body);
});
