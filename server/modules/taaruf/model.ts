import { z } from "zod";

export const taarufStatusEnumSchema = z.enum([
  "PENDING",
  "APPROVED",
  "PROFILE_EXCHANGE",
  "TAARUF",
  "REJECTED",
  "CANCELLED",
  "MARRIED",
]);

export const createTaarufSchema = z.object({
  targetUserId: z.number().int().positive("ID Calon Pasangan tidak valid"),
});

export const updateTaarufStatusSchema = z.object({
  status: taarufStatusEnumSchema,
  keterangan: z.string().optional(),
});

export type CreateTaarufSchema = z.infer<typeof createTaarufSchema>;
export type UpdateTaarufStatusSchema = z.infer<typeof updateTaarufStatusSchema>;
