import { CourseService } from "~~/server/modules/course/service";
import { adminGuard } from "~~/server/utils/guard";
import { paginationSearchSchema } from "~~/server/utils/schema";
import { getValidatedQuerySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, paginationSearchSchema);

  return await CourseService.findAll(query);
});
