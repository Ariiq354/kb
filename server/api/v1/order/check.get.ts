import { z } from "zod";
import { OrderService } from "~~/server/modules/order/service";
import { authGuard } from "~~/server/utils/guard";
import { getValidatedQuerySafe } from "~~/server/utils/validator";

const checkOrderQuerySchema = z.object({
  produkId: z.coerce.number().int().positive(),
});

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const query = await getValidatedQuerySafe(event, checkOrderQuerySchema);

  return await OrderService.checkUserProductOrder(Number(user.id), query.produkId);
});
