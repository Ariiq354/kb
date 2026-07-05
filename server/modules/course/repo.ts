import type { CreateCourseSchema, GetCourseSchema, UpdateCourseSchema } from "./model";
import { and, desc, eq, ilike, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import { courseLessonTable, courseSectionTable, courseTable } from "~~/server/database/schema/course";
import { produkTable } from "~~/server/database/schema/produk";

export abstract class CourseRepo {
  static async create(data: Omit<CreateCourseSchema, "file">, foto: string) {
    return await db.transaction(async (tx) => {
      const [produk] = await tx
        .insert(produkTable)
        .values({
          type: "COURSE",
          judul: data.judul,
          harga: data.harga,
          status: data.status,
          foto,
        })
        .returning();

      if (!produk) {
        throw new Error("Failed to create produk");
      }

      const [course] = await tx
        .insert(courseTable)
        .values({
          produkId: produk.id,
          deskripsi: data.deskripsi,
          namaPublisher: data.namaPublisher,
        })
        .returning();

      return { produk, course };
    });
  }

  static async update(id: number, data: Omit<UpdateCourseSchema, "file">, foto?: string) {
    return await db.transaction(async (tx) => {
      const [course] = await tx
        .select()
        .from(courseTable)
        .where(eq(courseTable.id, id))
        .limit(1);

      if (!course)
        return false;

      if (data.judul !== undefined || data.harga !== undefined || data.status !== undefined || foto) {
        await tx
          .update(produkTable)
          .set({
            ...(data.judul !== undefined && { judul: data.judul }),
            ...(data.harga !== undefined && { harga: data.harga }),
            ...(data.status !== undefined && { status: data.status }),
            ...(foto && { foto }),
            updatedAt: new Date(),
          })
          .where(eq(produkTable.id, course.produkId));
      }

      const updateData = {
        ...(data.deskripsi !== undefined && { deskripsi: data.deskripsi }),
        ...(data.namaPublisher !== undefined && { namaPublisher: data.namaPublisher }),
      };

      if (Object.keys(updateData).length > 0) {
        await tx
          .update(courseTable)
          .set(updateData)
          .where(eq(courseTable.id, id));
      }

      return true;
    });
  }

  static async findById(id: number) {
    const [result] = await db
      .select()
      .from(courseTable)
      .innerJoin(produkTable, eq(courseTable.produkId, produkTable.id))
      .where(eq(courseTable.id, id))
      .limit(1);

    if (!result)
      return null;

    const sections = await db
      .select()
      .from(courseSectionTable)
      .where(eq(courseSectionTable.courseId, result.course.id))
      .orderBy(courseSectionTable.order);

    let lessons: any[] = [];
    if (sections.length > 0) {
      lessons = await db
        .select()
        .from(courseLessonTable)
        .where(inArray(courseLessonTable.sectionId, sections.map(s => s.id)))
        .orderBy(courseLessonTable.order);
    }

    return {
      ...result.course,
      produk: result.produk,
      sections: sections.map(s => ({
        ...s,
        lessons: lessons.filter(l => l.sectionId === s.id),
      })),
    };
  }

  static async findByIds(ids: number[]) {
    return await db
      .select()
      .from(courseTable)
      .innerJoin(produkTable, eq(courseTable.produkId, produkTable.id))
      .where(inArray(courseTable.id, ids));
  }

  static async findAll(query: GetCourseSchema) {
    const conditions = [];

    if (query.search) {
      conditions.push(ilike(produkTable.judul, `%${query.search}%`));
    }

    const qb = db
      .select()
      .from(courseTable)
      .innerJoin(produkTable, eq(courseTable.produkId, produkTable.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(produkTable.createdAt));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return {
      total,
      data: data.map(d => ({ ...d.course, produk: d.produk })),
    };
  }

  static async delete(ids: number[]) {
    const courses = await this.findByIds(ids);
    const produkIds = courses.map(b => b.produk.id);

    if (produkIds.length > 0) {
      await db.delete(produkTable).where(inArray(produkTable.id, produkIds));
    }
    return true;
  }
}
