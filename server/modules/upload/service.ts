import { deleteFile } from "~~/server/utils/files";
import { SWEEP_AGE_MS } from "./config";
import { UploadRepo } from "./repo";

export abstract class UploadService {
  static async sweepAbandoned() {
    const since = new Date(Date.now() - SWEEP_AGE_MS);
    const expired = await UploadRepo.findPendingOlderThan(since);

    for (const row of expired) {
      await deleteFile(row.key);
    }

    await UploadRepo.deleteByKeys(expired.map(row => row.key));

    return expired;
  }
}
