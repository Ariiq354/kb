import { UPLOAD_CATEGORIES } from "~~/server/modules/upload/config";
import { presignUploadSchema } from "~~/server/modules/upload/model";
import { createPresignedUpload } from "~~/server/utils/files";
import { adminGuard, authGuard } from "~~/server/utils/guard";
import { readValidatedBodySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBodySafe(event, presignUploadSchema);

  const category = UPLOAD_CATEGORIES[body.dir];

  if (category.requireAdmin) {
    adminGuard(event);
  }
  else {
    authGuard(event);
  }

  return await createPresignedUpload(body);
});
