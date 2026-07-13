import { z } from "zod";
import { multipartFile } from "~~/server/utils/schema";

export const createEbookSchema = z.object({
  judul: z.string().min(1, "Judul tidak boleh kosong!"),
  harga: z.coerce.number().min(0, "Harga tidak boleh kosong!"),
  status: z.stringbool(),
  deskripsi: z.string().optional(),
  file: multipartFile({
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }),
  pdfFile: multipartFile({
    maxSize: 50 * 1024 * 1024,
    fileTypes: ["application/pdf"],
  }),
});

export type CreateEbookSchema = z.infer<typeof createEbookSchema>;

export const updateEbookSchema = createEbookSchema.partial();

export type UpdateEbookSchema = z.infer<typeof updateEbookSchema>;
