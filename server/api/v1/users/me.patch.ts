import { userProfileSchema } from "~~/server/modules/users/model";
import { UserService } from "~~/server/modules/users/service";
import { authGuard } from "~~/server/utils/guard";
import { readValidatedBodySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const body = await readValidatedBodySafe(event, userProfileSchema);

  return await UserService.updateUser(user, body);
});
