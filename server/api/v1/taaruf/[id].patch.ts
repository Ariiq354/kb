import { updateTaarufStatusSchema } from "~~/server/modules/taaruf/model";
import { TaarufService } from "~~/server/modules/taaruf/service";
import { adminGuard } from "~~/server/utils/guard";
import { readValidatedBodySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const id = getRouterParam(event, "id");
  const body = await readValidatedBodySafe(event, updateTaarufStatusSchema);
  return await TaarufService.updateStatus(Number(id), body);
});
