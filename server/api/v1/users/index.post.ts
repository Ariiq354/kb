import { createUserProfileSchema } from "~~/server/modules/users/model";
import { UserProfileService } from "~~/server/modules/users/service";
import { adminGuard } from "~~/server/utils/guard";
import { readValidatedMultipart } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedMultipart(event, createUserProfileSchema);
  return await UserProfileService.create(body);
});
