import type { CreateCourseSchema, GetCourseSchema, UpdateCourseSchema } from "./model";
import { createError } from "h3";
import { deleteFile, uploadFile } from "~~/server/utils/files";
import { CourseRepo } from "./repo";

export abstract class CourseService {
  static async create(payload: CreateCourseSchema) {
    const { file, ...data } = payload;
    const fileData = file[0]!;

    const { key } = await uploadFile(
      "course",
      fileData.filename!,
      fileData.data,
      fileData.type!,
    );

    return await CourseRepo.create(data, key);
  }

  static async update(id: number, payload: UpdateCourseSchema) {
    const course = await CourseRepo.findById(id);

    if (!course) {
      throw createError({
        statusCode: 404,
        statusMessage: "Course tidak ditemukan",
      });
    }

    const { file, ...data } = payload;
    let fileKey: string | undefined;

    if (file && file.length > 0) {
      const fileData = file[0]!;
      const { key } = await uploadFile(
        "course",
        fileData.filename!,
        fileData.data,
        fileData.type!,
      );
      fileKey = key;

      if (course.produk.foto) {
        await deleteFile(course.produk.foto);
      }
    }

    return await CourseRepo.update(id, data, fileKey);
  }

  static async findAll(query: GetCourseSchema) {
    return await CourseRepo.findAll(query);
  }

  static async delete(ids: number[]) {
    const courses = await CourseRepo.findByIds(ids);

    for (const b of courses) {
      if (b.produk.foto) {
        await deleteFile(b.produk.foto);
      }
    }

    return await CourseRepo.delete(ids);
  }
}
