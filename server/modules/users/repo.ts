import type { SQL } from "drizzle-orm";
import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CariPasanganQuerySchema, UserProfileSchema } from "./model";
import { and, desc, eq, gte, ilike, isNotNull, isNull, lte, or, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import { user } from "~~/server/database/schema/auth";
import { userProfile } from "~~/server/database/schema/user";
import { desa, kecamatan, kota, provinsi } from "~~/server/database/schema/wilayah";
import { generateUniqueCode } from "~~/server/utils/generator";

export abstract class UserRepo {
  static async updateUser(userId: number, payload: Omit<UserProfileSchema, "file">) {
    const { foto, ...profileData } = payload;

    return db.transaction(async (tx) => {
      const kodeUser = await generateUniqueCode(userProfile, userProfile.kodeUser, 4);

      const result = await tx.insert(userProfile)
        .values({
          userId,
          kodeUser,
          ...profileData,
        })
        .onConflictDoUpdate({
          target: userProfile.userId,
          set: profileData,
        })
        .returning();

      if (result.length === 0) {
        throw new Error("User tidak ditemukan");
      }

      if (foto !== undefined) {
        await tx.update(user)
          .set({
            image: foto || null,
          })
          .where(eq(user.id, userId));
      }
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
        kelurahanNama: desa.name,
        gender: userProfile.gender,
        kecamatan: userProfile.kecamatan,
        kecamatanNama: kecamatan.name,
        kota: userProfile.kota,
        kotaNama: kota.name,
        provinsi: userProfile.provinsi,
        provinsiNama: provinsi.name,
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
      .leftJoin(provinsi, eq(userProfile.provinsi, provinsi.id))
      .leftJoin(kota, eq(userProfile.kota, kota.id))
      .leftJoin(kecamatan, eq(userProfile.kecamatan, kecamatan.id))
      .leftJoin(desa, eq(userProfile.kelurahan, desa.id))
      .where(eq(user.id, userId))
      .limit(1);

    if (!result) {
      return null;
    }

    return {
      ...result,
      kelurahan: result.kelurahan || null,
      kelurahanNama: result.kelurahanNama || null,
      kecamatan: result.kecamatan || null,
      kecamatanNama: result.kecamatanNama || null,
      kota: result.kota || null,
      kotaNama: result.kotaNama || null,
      provinsi: result.provinsi || null,
      provinsiNama: result.provinsiNama || null,
    };
  }

  static async banUser(userId: number, payload: { banned: boolean; banReason?: string | null }) {
    const [result] = await db.update(user)
      .set({
        banned: payload.banned,
        banReason: payload.banned ? (payload.banReason || "Tanpa alasan") : null,
      })
      .where(eq(user.id, userId))
      .returning();

    return result || null;
  }

  static async findAll(query: PaginationSearchSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(user.name, `%${query.search}%`),
          ilike(user.email, `%${query.search}%`),
          ilike(user.noTelepon, `%${query.search}%`),
          ilike(userProfile.kodeUser, `%${query.search}%`),
        ),
      );
    }

    const qb = db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        noTelepon: user.noTelepon,
        image: user.image,
        role: user.role,
        banned: user.banned,
        banReason: user.banReason,
        banExpires: user.banExpires,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        kodeUser: userProfile.kodeUser,
        statusKawin: userProfile.statusKawin,
        tanggalLahir: userProfile.tanggalLahir,
        kelurahan: userProfile.kelurahan,
        kelurahanNama: desa.name,
        gender: userProfile.gender,
        kecamatan: userProfile.kecamatan,
        kecamatanNama: kecamatan.name,
        kota: userProfile.kota,
        kotaNama: kota.name,
        provinsi: userProfile.provinsi,
        provinsiNama: provinsi.name,
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
      .leftJoin(provinsi, eq(userProfile.provinsi, provinsi.id))
      .leftJoin(kota, eq(userProfile.kota, kota.id))
      .leftJoin(kecamatan, eq(userProfile.kecamatan, kecamatan.id))
      .leftJoin(desa, eq(userProfile.kelurahan, desa.id))
      .where(and(...conditions))
      .orderBy(desc(user.id));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    const mappedData = data.map(item => ({
      ...item,
      kelurahan: item.kelurahan || null,
      kelurahanNama: item.kelurahanNama || null,
      kecamatan: item.kecamatan || null,
      kecamatanNama: item.kecamatanNama || null,
      kota: item.kota || null,
      kotaNama: item.kotaNama || null,
      provinsi: item.provinsi || null,
      provinsiNama: item.provinsiNama || null,
    }));

    return { total, data: mappedData };
  }

  static async findById(userId: number) {
    const [result] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        noTelepon: user.noTelepon,
        image: user.image,
        role: user.role,
        banned: user.banned,
        banReason: user.banReason,
        banExpires: user.banExpires,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        kodeUser: userProfile.kodeUser,
        statusKawin: userProfile.statusKawin,
        tanggalLahir: userProfile.tanggalLahir,
        kelurahan: userProfile.kelurahan,
        kelurahanNama: desa.name,
        gender: userProfile.gender,
        kecamatan: userProfile.kecamatan,
        kecamatanNama: kecamatan.name,
        kota: userProfile.kota,
        kotaNama: kota.name,
        provinsi: userProfile.provinsi,
        provinsiNama: provinsi.name,
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
      .leftJoin(provinsi, eq(userProfile.provinsi, provinsi.id))
      .leftJoin(kota, eq(userProfile.kota, kota.id))
      .leftJoin(kecamatan, eq(userProfile.kecamatan, kecamatan.id))
      .leftJoin(desa, eq(userProfile.kelurahan, desa.id))
      .where(eq(user.id, userId))
      .limit(1);

    if (!result) {
      return null;
    }

    return {
      ...result,
      kelurahan: result.kelurahan || null,
      kelurahanNama: result.kelurahanNama || null,
      kecamatan: result.kecamatan || null,
      kecamatanNama: result.kecamatanNama || null,
      kota: result.kota || null,
      kotaNama: result.kotaNama || null,
      provinsi: result.provinsi || null,
      provinsiNama: result.provinsiNama || null,
    };
  }

  static async findOppositeGenderMembers(oppositeGender: "Laki-laki" | "Perempuan", query: CariPasanganQuerySchema) {
    const conditions: (SQL<unknown> | undefined)[] = [
      eq(user.role, "user"),
      or(eq(user.banned, false), isNull(user.banned)),
      isNotNull(userProfile.kodeUser),
      eq(userProfile.gender, oppositeGender),
      // 1. Must not have any MARRIED status process
      sql`NOT EXISTS (
        SELECT 1 FROM taaruf_proses tp 
        WHERE (tp.requester_user_id = ${user.id} OR tp.target_user_id = ${user.id}) 
        AND tp.status = 'MARRIED'
      )`,
      // 2. Must have count of active processes < 3
      sql`(
        SELECT COUNT(*) FROM taaruf_proses tp 
        WHERE (tp.requester_user_id = ${user.id} OR tp.target_user_id = ${user.id}) 
        AND tp.status NOT IN ('REJECTED', 'CANCELLED', 'MARRIED')
      ) < 3`,
    ];

    if (query.search) {
      conditions.push(
        or(
          ilike(user.name, `%${query.search}%`),
          ilike(userProfile.pekerjaan, `%${query.search}%`),
          ilike(userProfile.deskripsi, `%${query.search}%`),
        ),
      );
    }
    if (query.suku) {
      conditions.push(ilike(userProfile.suku, `%${query.suku}%`));
    }
    if (query.pekerjaan) {
      conditions.push(ilike(userProfile.pekerjaan, `%${query.pekerjaan}%`));
    }
    if (query.pendidikan) {
      conditions.push(eq(userProfile.pendidikan, query.pendidikan));
    }
    if (query.statusKawin) {
      conditions.push(eq(userProfile.statusKawin, query.statusKawin));
    }
    if (query.agama) {
      conditions.push(eq(userProfile.agama, query.agama));
    }
    if (query.perokok !== undefined) {
      conditions.push(eq(userProfile.perokok, query.perokok));
    }
    if (query.minUmur !== undefined) {
      const dateLimit = new Date();
      dateLimit.setFullYear(dateLimit.getFullYear() - query.minUmur);
      const limitStr = dateLimit.toISOString().split("T")[0]!;
      conditions.push(lte(userProfile.tanggalLahir, limitStr));
    }
    if (query.maxUmur !== undefined) {
      const dateLimit = new Date();
      dateLimit.setFullYear(dateLimit.getFullYear() - query.maxUmur - 1);
      const limitStr = dateLimit.toISOString().split("T")[0]!;
      conditions.push(gte(userProfile.tanggalLahir, limitStr));
    }

    const qb = db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        noTelepon: user.noTelepon,
        image: user.image,
        role: user.role,
        banned: user.banned,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        kodeUser: userProfile.kodeUser,
        statusKawin: userProfile.statusKawin,
        tanggalLahir: userProfile.tanggalLahir,
        kelurahan: userProfile.kelurahan,
        kelurahanNama: desa.name,
        gender: userProfile.gender,
        kecamatan: userProfile.kecamatan,
        kecamatanNama: kecamatan.name,
        kota: userProfile.kota,
        kotaNama: kota.name,
        provinsi: userProfile.provinsi,
        provinsiNama: provinsi.name,
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
      .leftJoin(provinsi, eq(userProfile.provinsi, provinsi.id))
      .leftJoin(kota, eq(userProfile.kota, kota.id))
      .leftJoin(kecamatan, eq(userProfile.kecamatan, kecamatan.id))
      .leftJoin(desa, eq(userProfile.kelurahan, desa.id))
      .where(and(...conditions))
      .orderBy(desc(user.id));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    const mappedData = data.map(item => ({
      ...item,
      kelurahan: item.kelurahan || null,
      kelurahanNama: item.kelurahanNama || null,
      kecamatan: item.kecamatan || null,
      kecamatanNama: item.kecamatanNama || null,
      kota: item.kota || null,
      kotaNama: item.kotaNama || null,
      provinsi: item.provinsi || null,
      provinsiNama: item.provinsiNama || null,
    }));

    return { total, data: mappedData };
  }
}
