import { z } from "zod";
import { paginationSearchSchema } from "~~/server/utils/schema";

export const taarufStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "PROFILE_EXCHANGE",
  "TAARUF",
  "REJECTED",
  "CANCELLED",
  "MARRIED",
]);

export const createTaarufSchema = z.object({
  requesterUserId: z.coerce.number().int().positive(),
  targetUserId: z.coerce.number().int().positive(),
});

export type CreateTaarufSchema = z.infer<typeof createTaarufSchema>;

export const updateTaarufStatusSchema = z.object({
  status: taarufStatusEnum,
  keterangan: z.string().optional(),
});

export type UpdateTaarufStatusSchema = z.infer<typeof updateTaarufStatusSchema>;

export const getTaarufSchema = z.object({
  ...paginationSearchSchema.shape,
  status: taarufStatusEnum.optional(),
});

export type GetTaarufSchema = z.infer<typeof getTaarufSchema>;
