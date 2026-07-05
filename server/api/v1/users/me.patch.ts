import { mePatchProfileSchema } from "~~/server/modules/users/model";
import { UserProfileService } from "~~/server/modules/users/service";
import { authGuard } from "~~/server/utils/guard";
import { readValidatedMultipart } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const body = await readValidatedMultipart(event, mePatchProfileSchema);
  return await UserProfileService.updateMe(user.id, body);
});
