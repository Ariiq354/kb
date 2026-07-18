import { createTaarufSchema } from "~~/server/modules/taaruf/model";
import { TaarufService } from "~~/server/modules/taaruf/service";
import { authGuard } from "~~/server/utils/guard";
import { readValidatedBodySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const body = await readValidatedBodySafe(event, createTaarufSchema);

  return await TaarufService.createRequest(user, body.targetUserId);
});
