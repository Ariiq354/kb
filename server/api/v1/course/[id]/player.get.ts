import { CourseRepo } from "~~/server/modules/course/repo";
import { CourseService } from "~~/server/modules/course/service";
import { authGuard } from "~~/server/utils/guard";
import { idParamsSchema } from "~~/server/utils/schema";
import { getValidatedRouterParamsSafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);

  const course = await CourseRepo.findById(params.id);
  if (!course) {
    throw createError({
      statusCode: 404,
      statusMessage: "Course tidak ditemukan",
    });
  }

  const curriculum = await CourseService.getCurriculumWithProgress(course.courseId, user.id);
  const stats = await CourseService.getProgressStats(course.courseId, user.id);

  return {
    course,
    curriculum,
    ...stats,
  };
});
