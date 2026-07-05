import { z } from "zod";
import { multipartFiles, paginationSearchSchema } from "~~/server/utils/schema";

export const createProdukSchema = z.object({
  type: z.enum(["BOOTCAMP", "EBOOK", "COURSE"]),
  judul: z.string().min(1),
  harga: z.coerce.number().min(0),
  status: z.coerce.boolean().default(true),
  file: multipartFiles({
    minCount: 1,
    maxCount: 1,
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }),
});

export type CreateProdukSchema = z.infer<typeof createProdukSchema>;

export const updateProdukSchema = z.object({
  type: z.enum(["BOOTCAMP", "EBOOK", "COURSE"]).optional(),
  judul: z.string().min(1).optional(),
  harga: z.coerce.number().min(0).optional(),
  status: z.coerce.boolean().optional(),
  file: multipartFiles({
    maxCount: 1,
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }).optional(),
});

export type UpdateProdukSchema = z.infer<typeof updateProdukSchema>;

export const getProdukSchema = z.object({
  ...paginationSearchSchema.shape,
  type: z.enum(["BOOTCAMP", "EBOOK", "COURSE"]).optional(),
});

export type GetProdukSchema = z.infer<typeof getProdukSchema>;
