import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreateBootcampSchema, UpdateBootcampSchema } from "./model";
import { createError } from "h3";
import { deleteFile, uploadFile } from "~~/server/utils/files";
import { BootcampRepo } from "./repo";

export abstract class BootcampService {
  static async create(payload: CreateBootcampSchema) {
    const { file, ...data } = payload;

    const { key } = await uploadFile(
      "bootcamp",
      file.filename!,
      file.data,
      file.type!,
    );

    return await BootcampRepo.create(data, key);
  }

  static async update(produkId: number, payload: UpdateBootcampSchema) {
    const existing = await BootcampRepo.findById(produkId);

    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: "Bootcamp tidak ditemukan",
      });
    }

    const { file, ...data } = payload;
    let fotoKey: string | undefined;

    if (file) {
      const { key } = await uploadFile(
        "bootcamp",
        file.filename!,
        file.data,
        file.type!,
      );

      if (existing.foto) {
        await deleteFile(existing.foto);
      }
      fotoKey = key;
    }

    await BootcampRepo.update(produkId, data, fotoKey);
  }

  static async findAll(query: PaginationSearchSchema) {
    return await BootcampRepo.findAll(query);
  }

  static async delete(produkIds: number[]) {
    const result = await BootcampRepo.delete(produkIds);

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Bootcamp tidak ditemukan",
      });
    }

    for (const produk of result) {
      await deleteFile(produk.foto);
    }

    return result;
  }
}
