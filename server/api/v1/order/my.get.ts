import { OrderService } from "~~/server/modules/order/service";
import { authGuard } from "~~/server/utils/guard";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);

  const data = await OrderService.findUserOrders(Number(user.id));

  return {
    total: data.length,
    data,
  };
});
