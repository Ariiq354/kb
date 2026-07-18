import { asc, eq } from "drizzle-orm";
import { db } from "~~/server/database";
import { desa, kecamatan, kota, provinsi } from "~~/server/database/schema/wilayah";

export abstract class WilayahRepo {
  static async getProvinsi() {
    return await db
      .select()
      .from(provinsi)
      .orderBy(asc(provinsi.name));
  }

  static async getKota(provinsiId: number) {
    return await db
      .select()
      .from(kota)
      .where(eq(kota.provinsiId, provinsiId))
      .orderBy(asc(kota.name));
  }

  static async getKecamatan(kotaId: number) {
    return await db
      .select()
      .from(kecamatan)
      .where(eq(kecamatan.kotaId, kotaId))
      .orderBy(asc(kecamatan.name));
  }

  static async getDesa(kecamatanId: number) {
    return await db
      .select()
      .from(desa)
      .where(eq(desa.kecamatanId, kecamatanId))
      .orderBy(asc(desa.name));
  }
}
