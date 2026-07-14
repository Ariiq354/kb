import { CourseService } from "~~/server/modules/course/service";
import { adminGuard } from "~~/server/utils/guard";
import { idParamsSchema } from "~~/server/utils/schema";
import { getValidatedRouterParamsSafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);

  return await CourseService.getCurriculum(params.id);
});
