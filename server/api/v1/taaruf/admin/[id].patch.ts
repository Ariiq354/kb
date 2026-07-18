import { updateTaarufStatusSchema } from "~~/server/modules/taaruf/model";
import { TaarufService } from "~~/server/modules/taaruf/service";
import { adminGuard } from "~~/server/utils/guard";
import { idParamsSchema } from "~~/server/utils/schema";
import { getValidatedRouterParamsSafe, readValidatedBodySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const { id } = await getValidatedRouterParamsSafe(event, idParamsSchema);
  const body = await readValidatedBodySafe(event, updateTaarufStatusSchema);

  return await TaarufService.updateStatusByAdmin(id, body.status, body.keterangan);
});
