import type { ProdukQuerySchema } from "./model";
import { ProdukRepo } from "./repo";

export abstract class ProdukService {
  static async findAll(query: ProdukQuerySchema) {
    return await ProdukRepo.findAll(query);
  }
}
