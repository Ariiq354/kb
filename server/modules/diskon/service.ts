import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreateDiskonSchema, UpdateDiskonSchema } from "./model";
import { createError } from "h3";
import { DiskonRepo } from "./repo";

export abstract class DiskonService {
  static async create(payload: CreateDiskonSchema) {
    return await DiskonRepo.create(payload);
  }

  static async update(id: number, payload: UpdateDiskonSchema) {
    const result = await DiskonRepo.update(id, payload);

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Diskon tidak ditemukan",
      });
    }
  }

  static async findAll(query: PaginationSearchSchema) {
    return await DiskonRepo.findAll(query);
  }

  static async delete(id: number[]) {
    const result = await DiskonRepo.delete(id);

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Diskon tidak ditemukan",
      });
    }
  }
}
