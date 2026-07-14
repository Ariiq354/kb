import type { SQL } from "drizzle-orm";
import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreateCourseSchema, CreateLessonSchema, CreateSectionSchema, UpdateCourseSchema, UpdateLessonSchema, UpdateSectionSchema } from "./model";
import { and, desc, eq, ilike, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import { course, courseLesson, courseSection } from "~~/server/database/schema/course";
import { produk } from "~~/server/database/schema/produk";

export abstract class CourseRepo {
  static async create(payload: Omit<CreateCourseSchema, "file">, foto: string) {
    return await db.transaction(async (tx) => {
      const [res] = await tx
        .insert(produk)
        .values({
          type: "COURSE",
          judul: payload.judul,
          harga: payload.harga,
          status: payload.status,
          foto,
        })
        .returning({ id: produk.id });

      if (!res)
        throw new Error("Failed to create produk");

      await tx
        .insert(course)
        .values({
          produkId: res.id,
          deskripsi: payload.deskripsi,
          namaPublisher: payload.namaPublisher,
        });
    });
  }

  static async update(courseId: number, payload: Omit<UpdateCourseSchema, "file">, foto?: string) {
    return await db.transaction(async (tx) => {
      const courseRecord = await tx
        .select({ produkId: course.produkId })
        .from(course)
        .where(eq(course.id, courseId))
        .then(rows => rows[0]);

      if (!courseRecord)
        throw new Error("Course tidak ditemukan");

      const produkId = courseRecord.produkId;

      const result = await tx
        .update(produk)
        .set({
          judul: payload.judul,
          harga: payload.harga,
          status: payload.status,
          ...(foto && { foto }),
        })
        .where(eq(produk.id, produkId));

      await tx
        .update(course)
        .set({
          deskripsi: payload.deskripsi,
          namaPublisher: payload.namaPublisher,
        })
        .where(eq(course.id, courseId));

      return result;
    });
  }

  static async findById(courseId: number) {
    return await db
      .select({
        id: course.id,
        produkId: produk.id,
        judul: produk.judul,
        harga: produk.harga,
        status: produk.status,
        foto: produk.foto,
        deskripsi: course.deskripsi,
        namaPublisher: course.namaPublisher,
        createdAt: produk.createdAt,
        updatedAt: produk.updatedAt,
      })
      .from(course)
      .innerJoin(produk, eq(course.produkId, produk.id))
      .where(eq(course.id, courseId))
      .then(rows => rows[0]);
  }

  static async findAll(query: PaginationSearchSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      conditions.push(ilike(produk.judul, `%${query.search}%`));
    }

    const qb = db
      .select({
        id: course.id,
        produkId: produk.id,
        judul: produk.judul,
        harga: produk.harga,
        status: produk.status,
        foto: produk.foto,
        deskripsi: course.deskripsi,
        namaPublisher: course.namaPublisher,
        createdAt: produk.createdAt,
        updatedAt: produk.updatedAt,
      })
      .from(course)
      .innerJoin(produk, eq(course.produkId, produk.id))
      .where(and(...conditions))
      .orderBy(desc(course.id));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async delete(courseIds: number[]) {
    return await db.transaction(async (tx) => {
      const rows = await tx
        .select({
          id: course.id,
          produkId: produk.id,
          foto: produk.foto,
        })
        .from(course)
        .innerJoin(produk, eq(course.produkId, produk.id))
        .where(inArray(course.id, courseIds));

      if (rows.length === 0)
        return [];

      const produkIds = rows.map(r => r.produkId);

      await tx
        .delete(produk)
        .where(inArray(produk.id, produkIds));

      return rows;
    });
  }

  // --- Section Repo Operations ---

  static async createSection(payload: CreateSectionSchema) {
    return await db
      .insert(courseSection)
      .values({
        courseId: payload.courseId,
        judul: payload.judul,
        order: payload.order,
      })
      .returning();
  }

  static async updateSection(sectionId: number, payload: UpdateSectionSchema) {
    return await db
      .update(courseSection)
      .set({
        judul: payload.judul,
        order: payload.order,
      })
      .where(eq(courseSection.id, sectionId))
      .returning();
  }

  static async deleteSection(sectionId: number) {
    return await db
      .delete(courseSection)
      .where(eq(courseSection.id, sectionId))
      .returning();
  }

  static async findSectionsByCourseId(courseId: number) {
    return await db
      .select()
      .from(courseSection)
      .where(eq(courseSection.courseId, courseId))
      .orderBy(courseSection.order);
  }

  // --- Lesson Repo Operations ---

  static async findLessonById(lessonId: number) {
    return await db
      .select()
      .from(courseLesson)
      .where(eq(courseLesson.id, lessonId))
      .then(rows => rows[0]);
  }

  static async createLesson(payload: Omit<CreateLessonSchema, "videoFile">, videoUrl: string) {
    return await db
      .insert(courseLesson)
      .values({
        sectionId: payload.sectionId,
        judul: payload.judul,
        videoUrl,
        duration: payload.duration,
        order: payload.order,
      })
      .returning();
  }

  static async updateLesson(lessonId: number, payload: Omit<UpdateLessonSchema, "videoFile">, videoUrl?: string) {
    return await db
      .update(courseLesson)
      .set({
        judul: payload.judul,
        duration: payload.duration,
        order: payload.order,
        ...(videoUrl && { videoUrl }),
      })
      .where(eq(courseLesson.id, lessonId))
      .returning();
  }

  static async deleteLesson(lessonId: number) {
    return await db
      .delete(courseLesson)
      .where(eq(courseLesson.id, lessonId))
      .returning();
  }

  static async findLessonsBySectionId(sectionId: number) {
    return await db
      .select()
      .from(courseLesson)
      .where(eq(courseLesson.sectionId, sectionId))
      .orderBy(courseLesson.order);
  }

  static async getCurriculum(courseId: number) {
    const sections = await db
      .select()
      .from(courseSection)
      .where(eq(courseSection.courseId, courseId))
      .orderBy(courseSection.order);

    if (sections.length === 0)
      return [];

    const sectionIds = sections.map(s => s.id);

    const lessons = await db
      .select()
      .from(courseLesson)
      .where(inArray(courseLesson.sectionId, sectionIds))
      .orderBy(courseLesson.order);

    return sections.map(s => ({
      ...s,
      lessons: lessons.filter(l => l.sectionId === s.id),
    }));
  }
}
