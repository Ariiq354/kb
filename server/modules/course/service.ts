import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreateCourseSchema, CreateLessonSchema, CreateSectionSchema, UpdateCourseSchema, UpdateLessonSchema, UpdateSectionSchema } from "./model";
import { createError } from "h3";
import { commitUploadedFile, deleteFile } from "~~/server/utils/files";
import { CourseRepo } from "./repo";

export abstract class CourseService {
  static async create(payload: CreateCourseSchema) {
    const { fileKey, ...data } = payload;

    const key = await commitUploadedFile(fileKey, "course");

    try {
      return await CourseRepo.create(data, key);
    }
    catch (error) {
      await deleteFile(key);
      throw error;
    }
  }

  static async update(courseId: number, payload: UpdateCourseSchema) {
    const existing = await CourseRepo.findById(courseId);

    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: "Course tidak ditemukan",
      });
    }

    const { fileKey, ...data } = payload;
    let key: string | undefined;

    if (fileKey) {
      key = await commitUploadedFile(fileKey, "course");
    }

    try {
      await CourseRepo.update(courseId, data, key);
    }
    catch (error) {
      if (key) {
        await deleteFile(key);
      }
      throw error;
    }

    if (key && existing.foto) {
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
    const { videoFileKey, ...data } = payload;

    const key = await commitUploadedFile(videoFileKey, "course");

    try {
      return await CourseRepo.createLesson(data, key);
    }
    catch (error) {
      await deleteFile(key);
      throw error;
    }
  }

  static async updateLesson(lessonId: number, payload: UpdateLessonSchema) {
    const existing = await CourseRepo.findLessonById(lessonId);
    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: "Lesson tidak ditemukan",
      });
    }

    const { videoFileKey, ...data } = payload;
    let key: string | undefined;

    if (videoFileKey) {
      key = await commitUploadedFile(videoFileKey, "course");
    }

    const result = await CourseRepo.updateLesson(lessonId, data, key).catch(
      async (error) => {
        if (key) {
          await deleteFile(key);
        }
        throw error;
      },
    );

    if (result.length === 0) {
      if (key) {
        await deleteFile(key);
      }
      throw createError({
        statusCode: 404,
        statusMessage: "Lesson tidak ditemukan",
      });
    }

    if (key && existing.videoUrl) {
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
