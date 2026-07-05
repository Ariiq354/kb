import { updateProdukSchema } from "~~/server/modules/produk/model";
import { ProdukService } from "~~/server/modules/produk/service";
import { adminGuard } from "~~/server/utils/guard";
import { readValidatedMultipart } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const id = getRouterParam(event, "id");
  const body = await readValidatedMultipart(event, updateProdukSchema);
  return await ProdukService.update(Number(id), body);
});
