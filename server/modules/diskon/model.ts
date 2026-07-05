import { z } from "zod";
import { paginationSearchSchema } from "~~/server/utils/schema";

export const createDiskonSchema = z.object({
  kode: z.string().min(1),
  persen: z.coerce.number().min(0).max(100),
  batasWaktu: z.iso.date(),
  batasPemakai: z.coerce.number().min(1),
  status: z.coerce.boolean().default(true),
});

export type CreateDiskonSchema = z.infer<typeof createDiskonSchema>;

export const updateDiskonSchema = createDiskonSchema.partial();

export type UpdateDiskonSchema = z.infer<typeof updateDiskonSchema>;

export const getDiskonSchema = z.object({
  ...paginationSearchSchema.shape,
});

export type GetDiskonSchema = z.infer<typeof getDiskonSchema>;
