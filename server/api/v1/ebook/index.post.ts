import { createEbookSchema } from "~~/server/modules/ebook/model";
import { EbookService } from "~~/server/modules/ebook/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedMultipart(event, createEbookSchema);
  return await EbookService.create(body);
});
