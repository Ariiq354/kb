import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreateCourseSchema, CreateLessonSchema, CreateSectionSchema, UpdateCourseSchema, UpdateLessonSchema, UpdateSectionSchema } from "./model";
import { createError } from "h3";
import { deleteFile } from "~~/server/utils/files";
import { CourseRepo } from "./repo";

export abstract class CourseService {
  static async create(payload: CreateCourseSchema) {
    const { file, ...data } = payload;

    if (!file) {
      throw createError({
        statusCode: 400,
        statusMessage: "Cover course wajib diunggah!",
      });
    }

    return await CourseRepo.create(data, file);
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

    await CourseRepo.update(courseId, data, file);

    if (file && existing.foto) {
      await deleteFile(existing.foto);
    }
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

    if (!videoFile) {
      throw createError({
        statusCode: 400,
        statusMessage: "File video wajib diunggah!",
      });
    }

    return await CourseRepo.createLesson(data, videoFile);
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

    const result = await CourseRepo.updateLesson(lessonId, data, videoFile);
    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Lesson tidak ditemukan",
      });
    }

    if (videoFile && existing.videoUrl) {
      await deleteFile(existing.videoUrl);
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

  // --- Progress Service Operations ---

  static async getCurriculumWithProgress(courseId: number, userId: number) {
    return await CourseRepo.getCurriculumWithProgress(courseId, userId);
  }

  static async getProgressStats(courseId: number, userId: number) {
    return await CourseRepo.getProgressStats(courseId, userId);
  }

  static async markLessonComplete(lessonId: number, userId: number) {
    const lesson = await CourseRepo.findLessonById(lessonId);
    if (!lesson) {
      throw createError({
        statusCode: 404,
        statusMessage: "Lesson tidak ditemukan",
      });
    }
    return await CourseRepo.markLessonComplete(lessonId, userId);
  }
}
