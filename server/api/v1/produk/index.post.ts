import { createProdukSchema } from "~~/server/modules/produk/model";
import { ProdukService } from "~~/server/modules/produk/service";
import { adminGuard } from "~~/server/utils/guard";
import { readValidatedMultipart } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedMultipart(event, createProdukSchema);
  return await ProdukService.create(body);
});
