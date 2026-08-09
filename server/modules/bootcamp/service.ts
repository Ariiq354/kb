import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreateBootcampSchema, UpdateBootcampSchema } from "./model";
import { createError } from "h3";
import { deleteFile } from "~~/server/utils/files";
import { BootcampRepo } from "./repo";

export abstract class BootcampService {
  static async create(payload: CreateBootcampSchema) {
    const { file, ...data } = payload;

    if (!file) {
      throw createError({
        statusCode: 400,
        statusMessage: "Foto bootcamp wajib diunggah!",
      });
    }

    return await BootcampRepo.create(data, file);
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

    await BootcampRepo.update(produkId, data, file);

    if (file && existing.foto) {
      await deleteFile(existing.foto);
    }
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
