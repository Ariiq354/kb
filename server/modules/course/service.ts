import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreateCourseSchema, CreateLessonSchema, CreateSectionSchema, UpdateCourseSchema, UpdateLessonSchema, UpdateSectionSchema } from "./model";
import { createError } from "h3";
import { deleteFile, uploadFile } from "~~/server/utils/files";
import { CourseRepo } from "./repo";

export abstract class CourseService {
  static async create(payload: CreateCourseSchema) {
    const { file, ...data } = payload;

    const { key } = await uploadFile(
      "course",
      file.filename!,
      file.data,
      file.type!,
    );

    return await CourseRepo.create(data, key);
  }

  static async update(courseId: number, payload: UpdateCourseSchema) {
    const existing = await CourseRepo.findById(courseId);

    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: "Course tidak ditemukan",
      });
    }

    const { file, ...data } = payload;
    let key: string | undefined;

    if (file) {
      const { key: newKey } = await uploadFile(
        "course",
        file.filename!,
        file.data,
        file.type!,
      );

      if (existing.foto) {
        await deleteFile(existing.foto);
      }
      key = newKey;
    }

    await CourseRepo.update(courseId, data, key);
  }

  static async findAll(query: PaginationSearchSchema) {
    return await CourseRepo.findAll(query);
  }

  static async delete(courseIds: number[]) {
    const result = await CourseRepo.delete(courseIds);

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Course tidak ditemukan",
      });
    }

    for (const item of result) {
      if (item.foto) {
        await deleteFile(item.foto);
      }
    }

    return result;
  }

  // --- Section Service Operations ---

  static async createSection(payload: CreateSectionSchema) {
    return await CourseRepo.createSection(payload);
  }

  static async updateSection(sectionId: number, payload: UpdateSectionSchema) {
    const result = await CourseRepo.updateSection(sectionId, payload);
    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Section tidak ditemukan",
      });
    }
    return result[0];
  }

  static async deleteSection(sectionId: number) {
    const result = await CourseRepo.deleteSection(sectionId);
    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Section tidak ditemukan",
      });
    }
    return result[0];
  }

  static async findSectionsByCourseId(courseId: number) {
    return await CourseRepo.findSectionsByCourseId(courseId);
  }

  // --- Lesson Service Operations ---

  static async createLesson(payload: CreateLessonSchema) {
    const { videoFile, ...data } = payload;

    const { key } = await uploadFile(
      "course",
      videoFile.filename!,
      videoFile.data,
      videoFile.type!,
    );

    return await CourseRepo.createLesson(data, key);
  }

  static async updateLesson(lessonId: number, payload: UpdateLessonSchema) {
    const existing = await CourseRepo.findLessonById(lessonId);
    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: "Lesson tidak ditemukan",
      });
    }

    const { videoFile, ...data } = payload;
    let key: string | undefined;

    if (videoFile) {
      const { key: newKey } = await uploadFile(
        "course",
        videoFile.filename!,
        videoFile.data,
        videoFile.type!,
      );

      if (existing.videoUrl) {
        await deleteFile(existing.videoUrl);
      }
      key = newKey;
    }

    const result = await CourseRepo.updateLesson(lessonId, data, key);
    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Lesson tidak ditemukan",
      });
    }
    return result[0];
  }

  static async deleteLesson(lessonId: number) {
    const result = await CourseRepo.deleteLesson(lessonId);
    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Lesson tidak ditemukan",
      });
    }
    const lesson = result[0];
    if (lesson && lesson.videoUrl) {
      await deleteFile(lesson.videoUrl);
    }
    return lesson;
  }

  static async findLessonsBySectionId(sectionId: number) {
    return await CourseRepo.findLessonsBySectionId(sectionId);
  }

  static async getCurriculum(courseId: number) {
    return await CourseRepo.getCurriculum(courseId);
  }
}
