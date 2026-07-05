import { getTaarufSchema } from "~~/server/modules/taaruf/model";
import { TaarufService } from "~~/server/modules/taaruf/service";
import { adminGuard } from "~~/server/utils/guard";
import { getValidatedQuerySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, getTaarufSchema);
  return await TaarufService.findAll(query);
});
