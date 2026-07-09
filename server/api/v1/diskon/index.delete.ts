import { DiskonService } from "~~/server/modules/diskon/service";
import { adminGuard } from "~~/server/utils/guard";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedBodySafe(event, deleteSchema);

  return await DiskonService.delete(body.ids);
});
