import { z } from "zod";
import { multipartFiles, paginationSearchSchema } from "~~/server/utils/schema";

export const createUserProfileSchema = z.object({
  statusKawin: z.string(),
  tanggalLahir: z.iso.date(),
  kelurahan: z.string().min(1),
  gender: z.enum(["Laki-laki", "Perempuan"]),
  kecamatan: z.string().min(1),
  kota: z.string().min(1),
  provinsi: z.string().min(1),
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
  file: multipartFiles({
    minCount: 1,
    maxCount: 1,
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }),
});

export type CreateUserProfileSchema = z.infer<typeof createUserProfileSchema>;

export const updateUserProfileSchema = z.object({
  kodeUser: z.string().min(1).optional(),
  userId: z.coerce.number().int().positive().optional(),
  statusKawin: z.string().min(1).optional(),
  tanggalLahir: z.iso.date().optional(),
  kelurahan: z.string().min(1).optional(),
  gender: z.enum(["Laki-laki", "Perempuan"]).optional(),
  kecamatan: z.string().min(1).optional(),
  kota: z.string().min(1).optional(),
  provinsi: z.string().min(1).optional(),
  namaAyah: z.string().min(1).optional(),
  anakKe: z.coerce.number().int().min(1).optional(),
  dariBersaudara: z.coerce.number().int().min(1).optional(),
  suku: z.string().min(1).optional(),
  pendidikan: z.string().min(1).optional(),
  pekerjaan: z.string().min(1).optional(),
  jurusan: z.string().min(1).optional(),
  tinggi: z.coerce.number().int().positive().optional(),
  berat: z.coerce.number().int().positive().optional(),
  hobi: z.string().min(1).optional(),
  instagram: z.string().min(1).optional(),
  kriteria: z.string().min(1).optional(),
  perokok: z.coerce.boolean().optional(),
  gaji: z.coerce.number().int().optional(),
  agama: z.string().optional(),
  deskripsi: z.string().optional(),
  file: multipartFiles({
    maxCount: 1,
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }).optional(),
});

export type UpdateUserProfileSchema = z.infer<typeof updateUserProfileSchema>;

export const getUserProfileSchema = z.object({
  ...paginationSearchSchema.shape,
  gender: z.enum(["Laki-laki", "Perempuan"]).optional(),
});

export type GetUserProfileSchema = z.infer<typeof getUserProfileSchema>;

export const mePatchProfileSchema = z.object({
  statusKawin: z.string().min(1),
  tanggalLahir: z.iso.date(),
  kelurahan: z.string().min(1),
  gender: z.enum(["Laki-laki", "Perempuan"]),
  kecamatan: z.string().min(1),
  kota: z.string().min(1),
  provinsi: z.string().min(1),
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
  perokok: z.coerce.boolean(),
  gaji: z.coerce.number().int(),
  agama: z.string().min(1),
  deskripsi: z.string().min(1),
  file: multipartFiles({
    maxCount: 1,
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }).optional(),
});

export type MePatchProfileSchema = z.infer<typeof mePatchProfileSchema>;
