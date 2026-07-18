import { CalendarDate, getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { z } from "zod";

interface UserResponse {
  id: number;
  name: string | null;
  email: string | null;
  noTelepon: string | null;
  image: string | null;
  kodeUser: string | null;
  statusKawin: string | null;
  tanggalLahir: string | null;
  kelurahan: number | null;
  gender: "Laki-laki" | "Perempuan" | null;
  kecamatan: number | null;
  kota: number | null;
  provinsi: number | null;
  namaAyah: string | null;
  anakKe: number | null;
  dariBersaudara: number | null;
  suku: string | null;
  pendidikan: string | null;
  pekerjaan: string | null;
  jurusan: string | null;
  tinggi: number | null;
  berat: number | null;
  hobi: string | null;
  instagram: string | null;
  kriteria: string | null;
  perokok: boolean | null;
  gaji: number | null;
  agama: string | null;
  deskripsi: string | null;
}

export const schema = z.object({
  statusKawin: z.string({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
  tanggalLahir: z.instanceof(CalendarDate),
  kelurahan: z.number({ error: "Wajib diisi" }),
  gender: z.enum(["Laki-laki", "Perempuan"], { error: "Wajib diisi" }),
  kecamatan: z.number({ error: "Wajib diisi" }),
  kota: z.number({ error: "Wajib diisi" }),
  provinsi: z.number({ error: "Wajib diisi" }),
  namaAyah: z.string({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
  anakKe: z.coerce.number({ error: "Wajib diisi" }),
  dariBersaudara: z.coerce.number({ error: "Wajib diisi" }),
  suku: z.string({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
  pendidikan: z.string({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
  pekerjaan: z.string({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
  jurusan: z.string({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
  tinggi: z.coerce.number({ error: "Wajib diisi" }),
  berat: z.coerce.number({ error: "Wajib diisi" }),
  hobi: z.string({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
  instagram: z.string({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
  kriteria: z.string({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
  perokok: z.boolean({ error: "Wajib diisi" }),
  gaji: z.coerce.number({ error: "Wajib diisi" }),
  agama: z.string({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
  deskripsi: z.string({ error: "Wajib diisi" }).min(1, "Wajib diisi"),
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

export function initFormData(data?: UserResponse | null): Partial<Schema> {
  return {
    statusKawin: data?.statusKawin ?? undefined,
    tanggalLahir: data?.tanggalLahir ? parseDate(data.tanggalLahir) : today(getLocalTimeZone()),
    kelurahan: data?.kelurahan ?? undefined,
    gender: data?.gender ?? undefined,
    kecamatan: data?.kecamatan ?? undefined,
    kota: data?.kota ?? undefined,
    provinsi: data?.provinsi ?? undefined,
    namaAyah: data?.namaAyah ?? undefined,
    anakKe: data?.anakKe ?? undefined,
    dariBersaudara: data?.dariBersaudara ?? undefined,
    suku: data?.suku ?? undefined,
    pendidikan: data?.pendidikan ?? undefined,
    pekerjaan: data?.pekerjaan ?? undefined,
    jurusan: data?.jurusan ?? undefined,
    tinggi: data?.tinggi ?? undefined,
    berat: data?.berat ?? undefined,
    hobi: data?.hobi ?? undefined,
    instagram: data?.instagram ?? undefined,
    kriteria: data?.kriteria ?? undefined,
    perokok: data?.perokok ?? false,
    gaji: data?.gaji ?? undefined,
    agama: data?.agama ?? undefined,
    deskripsi: data?.deskripsi ?? undefined,
    foto: data?.image ?? undefined,
  };
}

export type Schema = z.infer<typeof schema>;
