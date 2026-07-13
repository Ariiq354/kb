import { z } from "zod";
import { multipartFile } from "~~/server/utils/schema";

export const bootcampTypeEnum = z.enum(["ONLINE", "OFFLINE", "HYBRID"]);

export const createBootcampSchema = z.object({
  judul: z.string(),
  harga: z.coerce.number(),
  status: z.stringbool(),
  deskripsi: z.string().optional(),
  tipe: bootcampTypeEnum,
  tempat: z.string(),
  waktu: z.string(),
  pembicara: z.string(),
  googleMapLink: z.string().optional(),
  meetingLink: z.string().optional(),
  file: multipartFile({
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }),
});

export type CreateBootcampSchema = z.infer<typeof createBootcampSchema>;

export const updateBootcampSchema = createBootcampSchema.partial();

export type UpdateBootcampSchema = z.infer<typeof updateBootcampSchema>;
