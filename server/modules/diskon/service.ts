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

  static async validateCode(code: string) {
    const item = await DiskonRepo.findByKode(code);

    if (!item || !item.status) {
      return {
        valid: false,
        persen: 0,
        id: null,
        message: "Kode kupon tidak valid atau tidak aktif",
      };
    }

    const todayStr = new Date().toISOString().split("T")[0]!;
    if (item.batasWaktu < todayStr) {
      return {
        valid: false,
        persen: 0,
        id: null,
        message: "Kode kupon telah kadaluarsa",
      };
    }

    if (item.jumlahDipakai >= item.batasPemakai) {
      return {
        valid: false,
        persen: 0,
        id: null,
        message: "Kode kupon telah mencapai batas penggunaan",
      };
    }

    return {
      valid: true,
      persen: item.persen,
      id: item.id,
      message: "Kupon berhasil diterapkan!",
    };
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
