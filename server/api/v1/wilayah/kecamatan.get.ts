import { queryKecamatanSchema } from "~~/server/modules/wilayah/model";
import { WilayahService } from "~~/server/modules/wilayah/service";
import { getValidatedQuerySafe } from "~~/server/utils/validator";

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuerySafe(event, queryKecamatanSchema);
  return await WilayahService.getKecamatan(query.kotaId);
});
