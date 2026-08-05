import { z } from "zod";

export const createEbookSchema = z.object({
  judul: z.string().min(1, "Judul tidak boleh kosong!"),
  harga: z.coerce.number().min(0, "Harga tidak boleh kosong!"),
  status: z.stringbool(),
  deskripsi: z.string().optional(),
  fileKey: z.string().min(1, "Cover ebook wajib diunggah!"),
  pdfFileKey: z.string().min(1, "File PDF ebook wajib diunggah!"),
});

export type CreateEbookSchema = z.infer<typeof createEbookSchema>;

export const updateEbookSchema = createEbookSchema.partial();

export type UpdateEbookSchema = z.infer<typeof updateEbookSchema>;
