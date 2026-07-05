import { z } from "zod";
import { EbookService } from "~~/server/modules/ebook/service";

const deleteSchema = z.object({
  ids: z.array(z.coerce.number()).min(1),
});

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, deleteSchema);
  return await EbookService.delete(query.ids);
});
