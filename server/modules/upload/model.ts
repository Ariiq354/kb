import { z } from "zod";
import { UPLOAD_DIRS } from "./config";

export const presignUploadSchema = z.object({
  dir: z.enum(UPLOAD_DIRS),
  filename: z.string().min(1, "Filename tidak boleh kosong!"),
  filesize: z.coerce.number().int().positive("Filesize harus lebih dari 0!"),
  filetype: z.string().min(1, "Filetype tidak boleh kosong!"),
});

export type PresignUploadSchema = z.infer<typeof presignUploadSchema>;
