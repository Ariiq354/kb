import type { UserProfileSchema } from "./model";
import { eq } from "drizzle-orm";
import { db } from "~~/server/database";
import { userTable } from "~~/server/database/schema/auth";
import { userProfileTable } from "~~/server/database/schema/user";
import { generateUniqueCode } from "~~/server/utils/generator";

export abstract class UserRepo {
  static async updateUser(userId: number, payload: Omit<UserProfileSchema, "file">) {
    return db.transaction(async (tx) => {
      const kodeUser = await generateUniqueCode(userProfileTable, userProfileTable.kodeUser, 4);

      const result = await tx.insert(userProfileTable)
        .values({
          userId,
          kodeUser,
          ...payload,
        })
        .onConflictDoUpdate({
          target: userProfileTable.userId,
          set: payload,
        })
        .returning();

      if (result.length === 0) {
        throw new Error("User tidak ditemukan");
      }

      await tx.update(userTable)
        .set({
          image: payload.foto,
        })
        .where(eq(userTable.id, userId));
    });
  }

  static async getUserProfile(userId: number) {
    const [result] = await db
      .select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        noTelepon: userTable.noTelepon,
        image: userTable.image,
        kodeUser: userProfileTable.kodeUser,
        statusKawin: userProfileTable.statusKawin,
        tanggalLahir: userProfileTable.tanggalLahir,
        kelurahan: userProfileTable.kelurahan,
        gender: userProfileTable.gender,
        kecamatan: userProfileTable.kecamatan,
        kota: userProfileTable.kota,
        provinsi: userProfileTable.provinsi,
        namaAyah: userProfileTable.namaAyah,
        anakKe: userProfileTable.anakKe,
        dariBersaudara: userProfileTable.dariBersaudara,
        suku: userProfileTable.suku,
        pendidikan: userProfileTable.pendidikan,
        pekerjaan: userProfileTable.pekerjaan,
        jurusan: userProfileTable.jurusan,
        tinggi: userProfileTable.tinggi,
        berat: userProfileTable.berat,
        hobi: userProfileTable.hobi,
        instagram: userProfileTable.instagram,
        kriteria: userProfileTable.kriteria,
        perokok: userProfileTable.perokok,
        gaji: userProfileTable.gaji,
        agama: userProfileTable.agama,
        deskripsi: userProfileTable.deskripsi,
      })
      .from(userTable)
      .leftJoin(userProfileTable, eq(userTable.id, userProfileTable.userId))
      .where(eq(userTable.id, userId))
      .limit(1);

    return result || null;
  }
}
