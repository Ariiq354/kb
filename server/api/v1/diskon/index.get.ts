import { getDiskonSchema } from "~~/server/modules/diskon/model";
import { DiskonService } from "~~/server/modules/diskon/service";
import { adminGuard } from "~~/server/utils/guard";
import { getValidatedQuerySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, getDiskonSchema);
  return await DiskonService.findAll(query);
});
