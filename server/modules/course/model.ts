import { z } from "zod";
import { multipartFile } from "~~/server/utils/schema";

export const createCourseSchema = z.object({
  judul: z.string().min(1, "Judul tidak boleh kosong!"),
  harga: z.coerce.number().min(0, "Harga tidak boleh kosong!"),
  status: z.stringbool(),
  deskripsi: z.string().optional(),
  namaPublisher: z.string().optional(),
  file: multipartFile({
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }),
});

export type CreateCourseSchema = z.infer<typeof createCourseSchema>;

export const updateCourseSchema = createCourseSchema.partial();

export type UpdateCourseSchema = z.infer<typeof updateCourseSchema>;

// --- Section Schemas ---
export const createSectionSchema = z.object({
  courseId: z.coerce.number().min(1, "Course ID tidak boleh kosong!"),
  judul: z.string().min(1, "Judul section tidak boleh kosong!"),
  order: z.coerce.number().min(0, "Order tidak boleh kosong!"),
});
export type CreateSectionSchema = z.infer<typeof createSectionSchema>;

export const updateSectionSchema = createSectionSchema.partial();
export type UpdateSectionSchema = z.infer<typeof updateSectionSchema>;

// --- Lesson Schemas ---
export const createLessonSchema = z.object({
  sectionId: z.coerce.number().min(1, "Section ID tidak boleh kosong!"),
  judul: z.string().min(1, "Judul lesson tidak boleh kosong!"),
  videoFile: multipartFile({
    maxSize: 500 * 1024 * 1024,
    fileTypes: ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
  }),
  duration: z.coerce.number().min(0).optional(),
  order: z.coerce.number().min(0, "Order tidak boleh kosong!"),
});
export type CreateLessonSchema = z.infer<typeof createLessonSchema>;

export const updateLessonSchema = createLessonSchema.partial();
export type UpdateLessonSchema = z.infer<typeof updateLessonSchema>;
