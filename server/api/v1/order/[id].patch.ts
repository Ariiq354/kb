import { updateOrderStatusSchema } from "~~/server/modules/order/model";
import { OrderService } from "~~/server/modules/order/service";
import { adminGuard } from "~~/server/utils/guard";
import { idParamsSchema } from "~~/server/utils/schema";
import { getValidatedRouterParamsSafe, readValidatedBodySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);
  const body = await readValidatedBodySafe(event, updateOrderStatusSchema);

  return await OrderService.updateStatus(params.id, body);
});
