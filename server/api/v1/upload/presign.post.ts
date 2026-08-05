import { createError } from "h3";
import { UPLOAD_RULES, uploadPresignSchema } from "~~/server/modules/upload/model";
import { createUploadTicket } from "~~/server/utils/files";
import { adminGuard } from "~~/server/utils/guard";
import { readValidatedBodySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedBodySafe(event, uploadPresignSchema);

  const rule = UPLOAD_RULES[body.dir];

  if (!rule.fileTypes.includes(body.contentType)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Tipe file "${body.contentType}" tidak diizinkan`,
    });
  }

  if (body.size > rule.maxSize) {
    throw createError({
      statusCode: 400,
      statusMessage: `Ukuran file melebihi batas maksimal ${Math.floor(rule.maxSize / 1024 / 1024)}MB`,
    });
  }

  return await createUploadTicket(body.dir, body.filename, body.contentType);
});
