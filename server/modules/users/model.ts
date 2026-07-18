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

export const cariPasanganQuerySchema = z.object({
  search: z.string().optional(),
  suku: z.string().optional(),
  minUmur: z.coerce.number().int().positive().optional(),
  maxUmur: z.coerce.number().int().positive().optional(),
  pendidikan: z.string().optional(),
  pekerjaan: z.string().optional(),
  statusKawin: z.string().optional(),
  agama: z.string().optional(),
  perokok: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
});

export type CariPasanganQuerySchema = z.infer<typeof cariPasanganQuerySchema>;
