import { DashboardService } from "~~/server/modules/dashboard/service";
import { authGuard } from "~~/server/utils/guard";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const data = await DashboardService.getUserDashboard(user.id);

  return data;
});
