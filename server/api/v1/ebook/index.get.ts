import { getEbookSchema } from "~~/server/modules/ebook/model";
import { EbookService } from "~~/server/modules/ebook/service";

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuerySafe(event, getEbookSchema);
  return await EbookService.findAll(query);
});
