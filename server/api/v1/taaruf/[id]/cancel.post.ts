import { TaarufService } from "~~/server/modules/taaruf/service";
import { authGuard } from "~~/server/utils/guard";
import { idParamsSchema } from "~~/server/utils/schema";
import { getValidatedRouterParamsSafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const { id } = await getValidatedRouterParamsSafe(event, idParamsSchema);

  return await TaarufService.cancelProcess(id, user.id);
});
