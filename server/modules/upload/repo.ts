import { and, eq, inArray, lt } from "drizzle-orm";
import { createError } from "h3";
import { db } from "~~/server/database";
import { fileUpload } from "~~/server/database/schema/fileUpload";

type DbTx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export abstract class UploadRepo {
  static async insertPending(input: {
    key: string;
    dir: string;
    filename: string;
    filetype: string;
    filesize: number;
  }) {
    await db.insert(fileUpload).values({
      status: "pending",
      ...input,
    });
  }

  static async ensurePending(tx: DbTx, keys: Array<string | null | undefined>) {
    const valid = keys.filter((key): key is string => Boolean(key));

    if (valid.length === 0)
      return;

    const found = await tx
      .select({ key: fileUpload.key })
      .from(fileUpload)
      .where(and(
        eq(fileUpload.status, "pending"),
        inArray(fileUpload.key, valid),
      ));

    const foundKeys = new Set(found.map(row => row.key));
    const missing = valid.filter(key => !foundKeys.has(key));

    if (missing.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "File upload tidak valid, silakan unggah ulang",
      });
    }
  }

  static async markSuccess(tx: DbTx, keys: Array<string | null | undefined>) {
    const valid = keys.filter((key): key is string => Boolean(key));

    if (valid.length === 0)
      return;

    await tx
      .update(fileUpload)
      .set({ status: "success" })
      .where(inArray(fileUpload.key, valid));
  }

  static async promote(tx: DbTx, keys: Array<string | null | undefined>) {
    await UploadRepo.ensurePending(tx, keys);
    await UploadRepo.markSuccess(tx, keys);
  }

  static async findPendingOlderThan(since: Date) {
    return await db
      .select({ key: fileUpload.key })
      .from(fileUpload)
      .where(and(
        eq(fileUpload.status, "pending"),
        lt(fileUpload.createdAt, since),
      ));
  }

  static async deleteByKeys(keys: string[]) {
    if (keys.length === 0)
      return;

    await db.delete(fileUpload).where(inArray(fileUpload.key, keys));
  }
}
