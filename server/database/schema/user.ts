import { boolean, integer, snakeCase, text } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { createdUpdated } from "./common";

export const userProfile = snakeCase.table("user_profile", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  kodeUser: text().notNull(),
  userId: integer().notNull().references(() => user.id, { onDelete: "cascade" }).unique(),
  statusKawin: text().notNull(),
  tanggalLahir: text().notNull(),
  kelurahan: text().notNull(),
  gender: text({ enum: ["Laki-laki", "Perempuan"] }).notNull(),
  kecamatan: text().notNull(),
  kota: text().notNull(),
  provinsi: text().notNull(),
  namaAyah: text().notNull(),
  anakKe: integer().notNull(),
  dariBersaudara: integer().notNull(),
  suku: text().notNull(),
  pendidikan: text().notNull(),
  pekerjaan: text().notNull(),
  jurusan: text().notNull(),
  tinggi: integer().notNull(),
  berat: integer().notNull(),
  hobi: text().notNull(),
  instagram: text().notNull(),
  kriteria: text().notNull(),
  perokok: boolean().notNull().default(false),
  gaji: integer().notNull().default(0),
  agama: text().notNull().default(""),
  deskripsi: text().notNull().default(""),
  ...createdUpdated,
});
