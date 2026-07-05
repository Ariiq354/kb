import { getCourseSchema } from "~~/server/modules/course/model";
import { CourseService } from "~~/server/modules/course/service";

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuerySafe(event, getCourseSchema);
  return await CourseService.findAll(query);
});
