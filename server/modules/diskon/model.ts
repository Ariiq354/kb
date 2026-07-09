import { z } from "zod";

export const createDiskonSchema = z.object({
  kode: z.string().min(1, "Kode diskon wajib diisi"),
  persen: z.number().min(0).max(100),
  batasWaktu: z.iso.date(),
  batasPemakai: z.number().min(1),
  status: z.boolean().default(true),
});

export type CreateDiskonSchema = z.infer<typeof createDiskonSchema>;

export const updateDiskonSchema = createDiskonSchema.partial();

export type UpdateDiskonSchema = z.infer<typeof updateDiskonSchema>;
