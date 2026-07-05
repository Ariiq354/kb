import { z } from "zod";
import { updateBootcampSchema } from "~~/server/modules/bootcamp/model";
import { BootcampService } from "~~/server/modules/bootcamp/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const id = await getValidatedRouterParamsSafe(event, z.object({ id: z.coerce.number() }));
  const body = await readValidatedMultipart(event, updateBootcampSchema);
  return await BootcampService.update(id.id, body);
});
