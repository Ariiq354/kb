import { createTaarufSchema } from "~~/server/modules/taaruf/model";
import { TaarufService } from "~~/server/modules/taaruf/service";
import { adminGuard } from "~~/server/utils/guard";
import { readValidatedBodySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedBodySafe(event, createTaarufSchema);
  return await TaarufService.create(body);
});
