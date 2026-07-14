import { updateSectionSchema } from "~~/server/modules/course/model";
import { CourseService } from "~~/server/modules/course/service";
import { adminGuard } from "~~/server/utils/guard";
import { idParamsSchema } from "~~/server/utils/schema";
import { getValidatedRouterParamsSafe, readValidatedBodySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);
  const body = await readValidatedBodySafe(event, updateSectionSchema);

  return await CourseService.updateSection(params.id, body);
});
