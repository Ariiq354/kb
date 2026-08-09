import { UploadService } from "~~/server/modules/upload/service";
import { env } from "~~/shared/env";

export default defineEventHandler(async (event) => {
  const secret = getHeader(event, "x-cron-secret")
    ?? getHeader(event, "authorization")?.replace(/^Bearer\s+/i, "");

  if (!env.CRON_SECRET || secret !== env.CRON_SECRET) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  return await UploadService.sweepAbandoned();
});
