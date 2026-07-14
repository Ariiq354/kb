import { updateLessonSchema } from "~~/server/modules/course/model";
import { CourseService } from "~~/server/modules/course/service";
import { adminGuard } from "~~/server/utils/guard";
import { idParamsSchema } from "~~/server/utils/schema";
import { getValidatedRouterParamsSafe, readValidatedMultipart } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);
  const body = await readValidatedMultipart(event, updateLessonSchema);

  return await CourseService.updateLesson(params.id, body);
});
