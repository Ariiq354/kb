import { createEbookSchema } from "~~/server/modules/ebook/model";
import { EbookService } from "~~/server/modules/ebook/service";
import { adminGuard } from "~~/server/utils/guard";
import { readValidatedBodySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedBodySafe(event, createEbookSchema);

  return await EbookService.create(body);
});
