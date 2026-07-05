import { UserProfileService } from "~~/server/modules/users/service";
import { authGuard } from "~~/server/utils/guard";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);

  return await UserProfileService.findMe(user.id);
});
