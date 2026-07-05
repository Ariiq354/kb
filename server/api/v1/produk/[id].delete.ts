import { ProdukService } from "~~/server/modules/produk/service";
import { adminGuard } from "~~/server/utils/guard";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const id = getRouterParam(event, "id");
  return await ProdukService.delete(Number(id));
});
