import { WilayahRepo } from "./repo";

export abstract class WilayahService {
  static async getProvinsi() {
    return await WilayahRepo.getProvinsi();
  }

  static async getKota(provinsiId: number) {
    return await WilayahRepo.getKota(provinsiId);
  }

  static async getKecamatan(kotaId: number) {
    return await WilayahRepo.getKecamatan(kotaId);
  }

  static async getDesa(kecamatanId: number) {
    return await WilayahRepo.getDesa(kecamatanId);
  }
}
