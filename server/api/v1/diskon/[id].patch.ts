import { updateDiskonSchema } from "~~/server/modules/diskon/model";
import { DiskonService } from "~~/server/modules/diskon/service";
import { adminGuard } from "~~/server/utils/guard";
import { idParamsSchema } from "~~/server/utils/schema";
import { readValidatedBodySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);

  const body = await readValidatedBodySafe(event, updateDiskonSchema);
  return await DiskonService.update(params.id, body);
});
