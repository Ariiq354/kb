import { createBootcampSchema } from "~~/server/modules/bootcamp/model";
import { BootcampService } from "~~/server/modules/bootcamp/service";
import { adminGuard } from "~~/server/utils/guard";
import { readValidatedMultipart } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedMultipart(event, createBootcampSchema);

  return await BootcampService.create(body);
});
