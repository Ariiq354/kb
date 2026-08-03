import type { ProdukQuerySchema } from "./model";
import { ProdukRepo } from "./repo";

export abstract class ProdukService {
  static async findAll(query: ProdukQuerySchema) {
    if (query.type) {
      return await ProdukRepo.findByType(query.type, query.page, query.limit, query.search);
    }
    return await ProdukRepo.findAll(query);
  }

  static async findByType(type: "BOOTCAMP" | "COURSE" | "EBOOK", page = 1, limit = 10, search?: string) {
    return await ProdukRepo.findByType(type, page, limit, search);
  }

  static async findById(id: number) {
    return await ProdukRepo.findById(id);
  }
}
