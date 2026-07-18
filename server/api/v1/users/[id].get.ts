import { UserService } from "~~/server/modules/users/service";
import { authGuard } from "~~/server/utils/guard";
import { idParamsSchema } from "~~/server/utils/schema";
import { getValidatedRouterParamsSafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  authGuard(event);
  const { id } = await getValidatedRouterParamsSafe(event, idParamsSchema);

  return await UserService.getUserProfile(id);
});
