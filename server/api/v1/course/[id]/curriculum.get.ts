import { CourseRepo } from "~~/server/modules/course/repo";
import { CourseService } from "~~/server/modules/course/service";
import { adminGuard } from "~~/server/utils/guard";
import { idParamsSchema } from "~~/server/utils/schema";
import { getValidatedRouterParamsSafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);

  const course = await CourseRepo.findById(params.id);
  if (!course) {
    throw createError({
      statusCode: 404,
      statusMessage: "Course tidak ditemukan",
    });
  }

  return await CourseService.getCurriculum(course.courseId);
});
