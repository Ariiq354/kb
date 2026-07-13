import { updateBootcampSchema } from "~~/server/modules/bootcamp/model";
import { BootcampService } from "~~/server/modules/bootcamp/service";
import { adminGuard } from "~~/server/utils/guard";
import { idParamsSchema } from "~~/server/utils/schema";
import { readValidatedMultipart } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);
  const body = await readValidatedMultipart(event, updateBootcampSchema);

  return await BootcampService.update(params.id, body);
});
