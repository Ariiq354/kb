import { z } from "zod";

export const createCourseSchema = z.object({
  judul: z.string().min(1, "Judul tidak boleh kosong!"),
  harga: z.coerce.number().min(0, "Harga tidak boleh kosong!"),
  status: z.stringbool(),
  deskripsi: z.string().optional(),
  namaPublisher: z.string().optional(),
  fileKey: z.string().min(1, "Cover course wajib diunggah!"),
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
  videoFileKey: z.string().min(1, "File video wajib diunggah!"),
  duration: z.coerce.number().min(0).optional(),
  order: z.coerce.number().min(0, "Order tidak boleh kosong!"),
});
export type CreateLessonSchema = z.infer<typeof createLessonSchema>;

export const updateLessonSchema = createLessonSchema.partial();
export type UpdateLessonSchema = z.infer<typeof updateLessonSchema>;
