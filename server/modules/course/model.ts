import { z } from "zod";
import { multipartFiles, paginationSearchSchema } from "~~/server/utils/schema";

export const createCourseSchema = z.object({
  judul: z.string().min(1),
  harga: z.coerce.number().min(0),
  status: z.coerce.boolean().default(true),
  deskripsi: z.string().optional(),
  namaPublisher: z.string().optional(),
  file: multipartFiles({
    minCount: 1,
    maxCount: 1,
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }),
});

export type CreateCourseSchema = z.infer<typeof createCourseSchema>;

export const updateCourseSchema = z.object({
  judul: z.string().min(1).optional(),
  harga: z.coerce.number().min(0).optional(),
  status: z.coerce.boolean().optional(),
  deskripsi: z.string().optional(),
  namaPublisher: z.string().optional(),
  file: multipartFiles({
    maxCount: 1,
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }).optional(),
});

export type UpdateCourseSchema = z.infer<typeof updateCourseSchema>;

export const getCourseSchema = z.object({
  ...paginationSearchSchema.shape,
});
export type GetCourseSchema = z.infer<typeof getCourseSchema>;
