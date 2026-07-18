import { TaarufService } from "~~/server/modules/taaruf/service";
import { adminGuard } from "~~/server/utils/guard";

export default defineEventHandler(async (event) => {
  adminGuard(event);

  return await TaarufService.getAdminProcesses();
});
