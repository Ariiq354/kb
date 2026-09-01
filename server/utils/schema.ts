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

export const contactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.email("Email tidak valid"),
  message: z.string().min(10, "Pesan minimal 10 karakter").max(1000),
});

export type ContactSchema = z.infer<typeof contactSchema>;
