import { getOrderSchema } from "~~/server/modules/orders/model";
import { OrderService } from "~~/server/modules/orders/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, getOrderSchema);
  return await OrderService.findAll(query);
});
