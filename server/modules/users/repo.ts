import type { SQL } from "drizzle-orm";
import type { GetUserProfileSchema, MePatchProfileSchema, UpdateUserProfileSchema } from "./model";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "~~/server/database";
import { userTable } from "~~/server/database/schema/auth";
import { userProfileTable } from "~~/server/database/schema/user";

export abstract class UserProfileRepo {
  static async updateUser(userId: number, payload: Omit<UpdateUserProfileSchema, "file">, foto?: string) {
    // const updateData = foto ? { ...data, foto } : data;
    // const [result] = await db
    //   .update(userProfileTable)
    //   .set(updateData)
    //   .where(eq(userProfileTable.id, id))
    //   .returning();
    return db.transaction(async (tx) => {
      const result = await tx.insert(userProfileTable)
        .values({
          userId,
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
          image: payload.foto || null,
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
        foto: userProfileTable.foto,
      })
      .from(userTable)
      .leftJoin(userProfileTable, eq(userTable.id, userProfileTable.userId))
      .where(eq(userTable.id, userId))
      .limit(1);

    return result || null;
  }

  static async findById(id: number) {
    const [result] = await db
      .select()
      .from(userProfileTable)
      .where(eq(userProfileTable.id, id))
      .limit(1);
    return result || null;
  }

  static async findAll(query: GetUserProfileSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      conditions.push(ilike(userProfileTable.kodeUser, `%${query.search}%`));
    }

    if (query.gender) {
      conditions.push(eq(userProfileTable.gender, query.gender));
    }

    const qb = db
      .select()
      .from(userProfileTable)
      .orderBy(desc(userProfileTable.id))
      .where(and(...conditions));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async updateMe(userId: number, data: Omit<MePatchProfileSchema, "file">, foto?: string) {
    const [profile] = await db.select().from(userProfileTable).where(eq(userProfileTable.userId, userId)).limit(1);
    const updateData = foto ? { ...data, foto } : data;

    if (profile) {
      const [result] = await db
        .update(userProfileTable)
        .set(updateData)
        .where(eq(userProfileTable.userId, userId))
        .returning();
      return result;
    }
    else {
      const kodeUser = `USR-${Date.now()}`;
      const [result] = await db
        .insert(userProfileTable)
        .values({ ...updateData, userId, kodeUser, foto: foto || "" })
        .returning();
      return result;
    }
  }

  static async findAllAdmin(query: GetUserProfileSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(userProfileTable.kodeUser, `%${query.search}%`),
          ilike(userTable.name, `%${query.search}%`),
          ilike(userTable.email, `%${query.search}%`),
        ),
      );
    }

    if (query.gender) {
      conditions.push(eq(userProfileTable.gender, query.gender));
    }

    const qb = db
      .select()
      .from(userTable)
      .leftJoin(userProfileTable, eq(userTable.id, userProfileTable.userId))
      .orderBy(desc(userTable.id))
      .where(and(...conditions));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async findAllMember(query: GetUserProfileSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      conditions.push(
        or(
          ilike(userProfileTable.kodeUser, `%${query.search}%`),
          ilike(userTable.name, `%${query.search}%`),
        ),
      );
    }

    if (query.gender) {
      conditions.push(eq(userProfileTable.gender, query.gender));
    }

    const qb = db
      .select({
        user: {
          id: userTable.id,
          name: userTable.name,
          image: userTable.image,
        },
        profile: userProfileTable,
      })
      .from(userTable)
      .innerJoin(userProfileTable, eq(userTable.id, userProfileTable.userId))
      .orderBy(desc(userTable.id))
      .where(and(...conditions));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }
}
