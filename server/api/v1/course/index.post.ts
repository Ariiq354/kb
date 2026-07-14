import { createCourseSchema } from "~~/server/modules/course/model";
import { CourseService } from "~~/server/modules/course/service";
import { adminGuard } from "~~/server/utils/guard";
import { readValidatedMultipart } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedMultipart(event, createCourseSchema);

  return await CourseService.create(body);
});
