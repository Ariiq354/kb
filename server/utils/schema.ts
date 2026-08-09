import { z } from "zod";

export const paginationSearchSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(),
});

export type PaginationSearchSchema = z.infer<typeof paginationSearchSchema>;

export const deleteSchema = z.object({
  ids: z.array(z.number()).default([]),
});

export type DeleteSchema = z.infer<typeof deleteSchema>;

export const idParamsSchema = z.object({
  id: z.coerce.number(),
});
