import { TaarufService } from "~~/server/modules/taaruf/service";
import { authGuard } from "~~/server/utils/guard";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);

  return await TaarufService.getUserProcesses(user.id);
});
