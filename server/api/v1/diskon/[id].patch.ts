import { updateDiskonSchema } from "~~/server/modules/diskon/model";
import { DiskonService } from "~~/server/modules/diskon/service";
import { adminGuard } from "~~/server/utils/guard";
import { readValidatedBodySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const id = getRouterParam(event, "id");
  const body = await readValidatedBodySafe(event, updateDiskonSchema);
  return await DiskonService.update(Number(id), body);
});
