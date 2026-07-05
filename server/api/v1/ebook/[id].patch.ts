import { z } from "zod";
import { updateEbookSchema } from "~~/server/modules/ebook/model";
import { EbookService } from "~~/server/modules/ebook/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const id = await getValidatedRouterParamsSafe(event, z.object({ id: z.coerce.number() }));
  const body = await readValidatedMultipart(event, updateEbookSchema);
  return await EbookService.update(id.id, body);
});
