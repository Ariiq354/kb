import { updateEbookSchema } from "~~/server/modules/ebook/model";
import { EbookService } from "~~/server/modules/ebook/service";
import { adminGuard } from "~~/server/utils/guard";
import { idParamsSchema } from "~~/server/utils/schema";
import { readValidatedMultipart } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);
  const body = await readValidatedMultipart(event, updateEbookSchema);

  return await EbookService.update(params.id, body);
});
