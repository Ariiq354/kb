import { getBootcampSchema } from "~~/server/modules/bootcamp/model";
import { BootcampService } from "~~/server/modules/bootcamp/service";

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuerySafe(event, getBootcampSchema);
  return await BootcampService.findAll(query);
});
