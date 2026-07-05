import { getProdukSchema } from "~~/server/modules/produk/model";
import { ProdukService } from "~~/server/modules/produk/service";
import { adminGuard } from "~~/server/utils/guard";
import { getValidatedQuerySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, getProdukSchema);
  return await ProdukService.findAll(query);
});
