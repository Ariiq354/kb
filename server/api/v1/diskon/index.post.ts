import { createDiskonSchema } from "~~/server/modules/diskon/model";
import { DiskonService } from "~~/server/modules/diskon/service";
import { adminGuard } from "~~/server/utils/guard";
import { readValidatedBodySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedBodySafe(event, createDiskonSchema);
  return await DiskonService.create(body);
});
