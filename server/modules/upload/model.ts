import { z } from "zod";

export type UploadDir = "course" | "ebook";

interface UploadRule {
  fileTypes: string[];
  maxSize: number;
}

export const UPLOAD_RULES: Record<UploadDir, UploadRule> = {
  course: {
    fileTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
    ],
    maxSize: 500 * 1024 * 1024,
  },
  ebook: {
    fileTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ],
    maxSize: 100 * 1024 * 1024,
  },
};

export const uploadPresignSchema = z.object({
  dir: z.enum(["course", "ebook"]),
  filename: z.string().min(1, "Nama file tidak boleh kosong!"),
  contentType: z.string().min(1, "Tipe file tidak boleh kosong!"),
  size: z.number().int().positive("Ukuran file harus lebih dari 0!"),
});

export type UploadPresignSchema = z.infer<typeof uploadPresignSchema>;
