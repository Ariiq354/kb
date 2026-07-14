import { z } from "zod";
import { UserService } from "~~/server/modules/users/service";
import { adminGuard } from "~~/server/utils/guard";
import { idParamsSchema } from "~~/server/utils/schema";
import { getValidatedRouterParamsSafe, readValidatedBodySafe } from "~~/server/utils/validator";

const banUserSchema = z.object({
  banned: z.boolean(),
  banReason: z.string().nullable().optional(),
});

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);
  const body = await readValidatedBodySafe(event, banUserSchema);

  return await UserService.banUser(params.id, body);
});
