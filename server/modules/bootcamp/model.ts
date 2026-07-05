import { z } from "zod";
import { multipartFiles, paginationSearchSchema } from "~~/server/utils/schema";

export const bootcampTypeEnum = z.enum(["ONLINE", "OFFLINE", "HYBRID"]);

export const createBootcampSchema = z.object({
  judul: z.string().min(1),
  harga: z.coerce.number().min(0),
  status: z.coerce.boolean().default(true),
  deskripsi: z.string().optional(),
  tipe: bootcampTypeEnum,
  tempat: z.string().min(1),
  waktu: z.string().min(1),
  pembicara: z.string().min(1),
  googleMapLink: z.string().optional(),
  meetingLink: z.string().optional(),
  file: multipartFiles({
    minCount: 1,
    maxCount: 1,
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }),
});

export type CreateBootcampSchema = z.infer<typeof createBootcampSchema>;

export const updateBootcampSchema = z.object({
  judul: z.string().min(1).optional(),
  harga: z.coerce.number().min(0).optional(),
  status: z.coerce.boolean().optional(),
  deskripsi: z.string().optional(),
  tipe: bootcampTypeEnum.optional(),
  tempat: z.string().min(1).optional(),
  waktu: z.string().min(1).optional(),
  pembicara: z.string().min(1).optional(),
  googleMapLink: z.string().optional(),
  meetingLink: z.string().optional(),
  file: multipartFiles({
    maxCount: 1,
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }).optional(),
});

export type UpdateBootcampSchema = z.infer<typeof updateBootcampSchema>;

export const getBootcampSchema = z.object({
  ...paginationSearchSchema.shape,
  tipe: bootcampTypeEnum.optional(),
});
export type GetBootcampSchema = z.infer<typeof getBootcampSchema>;
