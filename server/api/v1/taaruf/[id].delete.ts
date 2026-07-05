import { TaarufService } from "~~/server/modules/taaruf/service";
import { adminGuard } from "~~/server/utils/guard";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const id = getRouterParam(event, "id");
  return await TaarufService.delete(Number(id));
});
