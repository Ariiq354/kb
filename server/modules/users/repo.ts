import type { UserProfileSchema } from "./model";
import { eq } from "drizzle-orm";
import { db } from "~~/server/database";
import { user } from "~~/server/database/schema/auth";
import { userProfile } from "~~/server/database/schema/user";
import { generateUniqueCode } from "~~/server/utils/generator";

export abstract class UserRepo {
  static async updateUser(userId: number, payload: Omit<UserProfileSchema, "file">) {
    return db.transaction(async (tx) => {
      const kodeUser = await generateUniqueCode(userProfile, userProfile.kodeUser, 4);

      const result = await tx.insert(userProfile)
        .values({
          userId,
          kodeUser,
          ...payload,
        })
        .onConflictDoUpdate({
          target: userProfile.userId,
          set: payload,
        })
        .returning();

      if (result.length === 0) {
        throw new Error("User tidak ditemukan");
      }

      await tx.update(user)
        .set({
          image: payload.foto,
        })
        .where(eq(user.id, userId));
    });
  }

  static async getUserProfile(userId: number) {
    const [result] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        noTelepon: user.noTelepon,
        image: user.image,
        kodeUser: userProfile.kodeUser,
        statusKawin: userProfile.statusKawin,
        tanggalLahir: userProfile.tanggalLahir,
        kelurahan: userProfile.kelurahan,
        gender: userProfile.gender,
        kecamatan: userProfile.kecamatan,
        kota: userProfile.kota,
        provinsi: userProfile.provinsi,
        namaAyah: userProfile.namaAyah,
        anakKe: userProfile.anakKe,
        dariBersaudara: userProfile.dariBersaudara,
        suku: userProfile.suku,
        pendidikan: userProfile.pendidikan,
        pekerjaan: userProfile.pekerjaan,
        jurusan: userProfile.jurusan,
        tinggi: userProfile.tinggi,
        berat: userProfile.berat,
        hobi: userProfile.hobi,
        instagram: userProfile.instagram,
        kriteria: userProfile.kriteria,
        perokok: userProfile.perokok,
        gaji: userProfile.gaji,
        agama: userProfile.agama,
        deskripsi: userProfile.deskripsi,
      })
      .from(user)
      .leftJoin(userProfile, eq(user.id, userProfile.userId))
      .where(eq(user.id, userId))
      .limit(1);

    return result || null;
  }
}
