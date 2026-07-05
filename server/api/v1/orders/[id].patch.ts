import { z } from "zod";
import { updateOrderSchema } from "~~/server/modules/orders/model";
import { OrderService } from "~~/server/modules/orders/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const id = await getValidatedRouterParamsSafe(event, z.object({ id: z.coerce.number() }));
  const body = await readValidatedBodySafe(event, updateOrderSchema);
  return await OrderService.update(id.id, body);
});
