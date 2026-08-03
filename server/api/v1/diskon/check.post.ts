import { defineEventHandler } from "h3";
import { z } from "zod";
import { DiskonService } from "~~/server/modules/diskon/service";
import { readValidatedBodySafe } from "~~/server/utils/validator";

const checkDiskonSchema = z.object({
  code: z.string().min(1, "Kode kupon tidak boleh kosong"),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBodySafe(event, checkDiskonSchema);

  return await DiskonService.validateCode(body.code);
});
