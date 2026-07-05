import { z } from "zod";
import { CourseService } from "~~/server/modules/course/service";

const deleteSchema = z.object({
  ids: z.array(z.coerce.number()).min(1),
});

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, deleteSchema);
  return await CourseService.delete(query.ids);
});
