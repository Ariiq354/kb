import { z } from "zod";

export const queryKotaSchema = z.object({
  provinsiId: z.coerce.number().int().positive(),
});

export const queryKecamatanSchema = z.object({
  kotaId: z.coerce.number().int().positive(),
});

export const queryDesaSchema = z.object({
  kecamatanId: z.coerce.number().int().positive(),
});

export type QueryKotaSchema = z.infer<typeof queryKotaSchema>;
export type QueryKecamatanSchema = z.infer<typeof queryKecamatanSchema>;
export type QueryDesaSchema = z.infer<typeof queryDesaSchema>;
