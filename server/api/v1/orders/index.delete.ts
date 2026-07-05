import { z } from "zod";
import { OrderService } from "~~/server/modules/orders/service";

const deleteSchema = z.object({
  ids: z.array(z.coerce.number()).min(1),
});

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, deleteSchema);
  return await OrderService.delete(query.ids);
});
