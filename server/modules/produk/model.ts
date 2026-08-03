import { z } from "zod";

export const produkTypeEnum = z.enum(["BOOTCAMP", "EBOOK", "COURSE"]);

export const produkQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(),
  type: produkTypeEnum.optional(),
  status: z.preprocess((val) => {
    if (val === "true" || val === "1")
      return true;
    if (val === "false" || val === "0")
      return false;
    return val;
  }, z.boolean().optional()),
});

export type ProdukQuerySchema = z.infer<typeof produkQuerySchema>;
