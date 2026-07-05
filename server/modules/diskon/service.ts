import type { CreateDiskonSchema, GetDiskonSchema, UpdateDiskonSchema } from "./model";
import { DiskonRepo } from "./repo";

export abstract class DiskonService {
  static async create(payload: CreateDiskonSchema) {
    return await DiskonRepo.create(payload);
  }

  static async update(id: number, payload: UpdateDiskonSchema) {
    const diskon = await DiskonRepo.findById(id);

    if (!diskon) {
      throw createError({
        statusCode: 404,
        statusMessage: "Diskon tidak ditemukan",
      });
    }

    return await DiskonRepo.update(id, payload);
  }

  static async findAll(query: GetDiskonSchema) {
    return await DiskonRepo.findAll(query);
  }

  static async delete(id: number) {
    const diskon = await DiskonRepo.findById(id);

    if (!diskon) {
      throw createError({
        statusCode: 404,
        statusMessage: "Diskon tidak ditemukan",
      });
    }

    return await DiskonRepo.delete(id);
  }
}
