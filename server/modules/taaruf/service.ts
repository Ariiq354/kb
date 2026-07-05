import type { CreateTaarufSchema, GetTaarufSchema, UpdateTaarufStatusSchema } from "./model";
import { TaarufRepo } from "./repo";

export abstract class TaarufService {
  static async create(payload: CreateTaarufSchema) {
    return await TaarufRepo.create(payload);
  }

  static async updateStatus(id: number, payload: UpdateTaarufStatusSchema) {
    const taaruf = await TaarufRepo.findById(id);

    if (!taaruf) {
      throw createError({
        statusCode: 404,
        statusMessage: "Proses taaruf tidak ditemukan",
      });
    }

    return await TaarufRepo.updateStatus(id, payload);
  }

  static async findAll(query: GetTaarufSchema) {
    return await TaarufRepo.findAll(query);
  }

  static async delete(id: number) {
    const taaruf = await TaarufRepo.findById(id);

    if (!taaruf) {
      throw createError({
        statusCode: 404,
        statusMessage: "Proses taaruf tidak ditemukan",
      });
    }

    return await TaarufRepo.delete(id);
  }
}
