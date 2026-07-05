import { z } from "zod";
import { BootcampService } from "~~/server/modules/bootcamp/service";

const deleteSchema = z.object({
  ids: z.array(z.coerce.number()).min(1),
});

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, deleteSchema);
  return await BootcampService.delete(query.ids);
});
