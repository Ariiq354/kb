import { z } from "zod";
import { multipartFiles, paginationSearchSchema } from "~~/server/utils/schema";

export const createEbookSchema = z.object({
  judul: z.string().min(1),
  harga: z.coerce.number().min(0),
  status: z.coerce.boolean().default(true),
  deskripsi: z.string().optional(),
  foto: multipartFiles({
    minCount: 1,
    maxCount: 1,
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }),
  pdfFile: multipartFiles({
    minCount: 1,
    maxCount: 1,
    maxSize: 50 * 1024 * 1024,
    fileTypes: ["application/pdf"],
  }),
});

export type CreateEbookSchema = z.infer<typeof createEbookSchema>;

export const updateEbookSchema = z.object({
  judul: z.string().min(1).optional(),
  harga: z.coerce.number().min(0).optional(),
  status: z.coerce.boolean().optional(),
  deskripsi: z.string().optional(),
  foto: multipartFiles({
    maxCount: 1,
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }).optional(),
  pdfFile: multipartFiles({
    maxCount: 1,
    maxSize: 50 * 1024 * 1024,
    fileTypes: ["application/pdf"],
  }).optional(),
});

export type UpdateEbookSchema = z.infer<typeof updateEbookSchema>;

export const getEbookSchema = z.object({
  ...paginationSearchSchema.shape,
});
export type GetEbookSchema = z.infer<typeof getEbookSchema>;
