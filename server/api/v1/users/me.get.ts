import { UserService } from "~~/server/modules/users/service";
import { authGuard } from "~~/server/utils/guard";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);

  return await UserService.getUserProfile(user.id);
});
