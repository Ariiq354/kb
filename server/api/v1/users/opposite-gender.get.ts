import { cariPasanganQuerySchema } from "~~/server/modules/users/model";
import { UserService } from "~~/server/modules/users/service";
import { authGuard } from "~~/server/utils/guard";
import { getValidatedQuerySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const query = await getValidatedQuerySafe(event, cariPasanganQuerySchema);

  return await UserService.findOppositeGenderMembers(user, query);
});
