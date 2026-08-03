import { OrderService } from "~~/server/modules/order/service";
import { authGuard } from "~~/server/utils/guard";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const query = getQuery(event);
  const type = query.type as "BOOTCAMP" | "EBOOK" | "COURSE" | undefined;

  const data = await OrderService.findUserPurchasedProducts(Number(user.id), type);

  return {
    total: data.length,
    data,
  };
});
