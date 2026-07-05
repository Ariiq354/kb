import { z } from "zod";
import { updateCourseSchema } from "~~/server/modules/course/model";
import { CourseService } from "~~/server/modules/course/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const id = await getValidatedRouterParamsSafe(event, z.object({ id: z.coerce.number() }));
  const body = await readValidatedMultipart(event, updateCourseSchema);
  return await CourseService.update(id.id, body);
});
