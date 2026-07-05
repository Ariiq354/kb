import { createBootcampSchema } from "~~/server/modules/bootcamp/model";
import { BootcampService } from "~~/server/modules/bootcamp/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedMultipart(event, createBootcampSchema);
  return await BootcampService.create(body);
});
