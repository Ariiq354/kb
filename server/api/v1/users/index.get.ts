import { getUserProfileSchema } from "~~/server/modules/users/model";
import { UserProfileService } from "~~/server/modules/users/service";
import { adminGuard } from "~~/server/utils/guard";
import { getValidatedQuerySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  authGuard(event);
  const query = await getValidatedQuerySafe(event, getUserProfileSchema);

  return await UserProfileService.findAll(query);
});
