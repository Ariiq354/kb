import { produkQuerySchema } from "~~/server/modules/produk/model";
import { ProdukService } from "~~/server/modules/produk/service";
import { getValidatedQuerySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuerySafe(event, produkQuerySchema);

  return await ProdukService.findAll(query);
});
