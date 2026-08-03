import { createError, defineEventHandler } from "h3";
import { ProdukService } from "~~/server/modules/produk/service";
import { idParamsSchema } from "~~/server/utils/schema";
import { getValidatedRouterParamsSafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);
  const data = await ProdukService.findById(params.id);

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: "Produk tidak ditemukan",
    });
  }

  return data;
});
