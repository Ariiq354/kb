import { z } from "zod";
import { multipartFile } from "~~/server/utils/schema";

export const userProfileSchema = z.object({
  statusKawin: z.string(),
  tanggalLahir: z.iso.date(),
  kelurahan: z.number().int().positive(),
  gender: z.enum(["Laki-laki", "Perempuan"]),
  kecamatan: z.number().int().positive(),
  kota: z.number().int().positive(),
  provinsi: z.number().int().positive(),
  namaAyah: z.string().min(1),
  anakKe: z.coerce.number().int().min(1),
  dariBersaudara: z.coerce.number().int().min(1),
  suku: z.string().min(1),
  pendidikan: z.string().min(1),
  pekerjaan: z.string().min(1),
  jurusan: z.string().min(1),
  tinggi: z.coerce.number().int().positive(),
  berat: z.coerce.number().int().positive(),
  hobi: z.string().min(1),
  instagram: z.string().min(1),
  kriteria: z.string().min(1),
  perokok: z.coerce.boolean().default(false),
  gaji: z.coerce.number().int().default(0),
  agama: z.string().default(""),
  deskripsi: z.string().default(""),
  file: multipartFile({
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }).optional(),
  foto: z.string().optional(),
});

export type UserProfileSchema = z.infer<typeof userProfileSchema>;
