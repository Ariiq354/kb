import { z } from "zod";

interface UserResponse {
  id: number;
  gender: "Laki-laki" | "Perempuan" | null;
  namaKantor: string | null;
  provinsiKantor: string | null;
  noHp: string | null;
  nip18: string | null;
  idJabatan: number | null;
  namaJabatan: string | null;
  namaUnitEs4: string | null;
  namaPangkat: string | null;
  pendidikanFormal: string | null;
  alamat: string | null;
  provinsi: string | null;
  kota: string | null;
  foto: string | null;
  name: string;
  nip9: string | null;
}

export const schema = z.object({
  gender: z.enum(["Laki-laki", "Perempuan"]).optional(),
  namaKantor: z.string().optional(),
  provinsiKantor: z.string().optional(),
  noHp: z.string().optional(),
  nip18: z.string().optional(),
  idJabatan: z.number().optional(),
  namaUnitEs4: z.string().optional(),
  namaPangkat: z.string().optional(),
  pendidikanFormal: z.string().optional(),
  alamat: z.string().optional(),
  provinsi: z.string().optional(),
  kota: z.string().optional(),
  foto: z.string().optional(),
  file: z.optional(
    z
      .file()
      .check(
        z.maxSize(5_000_000),
        z.mime(["image/png", "image/jpeg", "image/webp"]),
      ),
  ),
});

export function initFormData(data?: UserResponse): Schema {
  return {
    gender: data?.gender ?? undefined,
    namaKantor: data?.namaKantor ?? undefined,
    provinsiKantor: data?.provinsiKantor ?? undefined,
    noHp: data?.noHp ?? undefined,
    nip18: data?.nip18 ?? undefined,
    idJabatan: data?.idJabatan ?? undefined,
    namaUnitEs4: data?.namaUnitEs4 ?? undefined,
    namaPangkat: data?.namaPangkat ?? undefined,
    pendidikanFormal: data?.pendidikanFormal ?? undefined,
    alamat: data?.alamat ?? undefined,
    provinsi: data?.provinsi ?? undefined,
    kota: data?.kota ?? undefined,
    foto: data?.foto ?? undefined,
  };
}

export type Schema = z.infer<typeof schema>;
