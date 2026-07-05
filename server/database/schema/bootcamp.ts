import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { produkTable } from "./produk";

export const bootcampTypeEnum = pgEnum("bootcamp_type", [
  "ONLINE",
  "OFFLINE",
  "HYBRID",
]);

export const bootcampTable = pgTable("bootcamp", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  produkId: integer().references(() => produkTable.id, { onDelete: "cascade" }).notNull().unique(),
  deskripsi: text(),
  tipe: bootcampTypeEnum().notNull(),
  tempat: text().notNull(),
  waktu: text().notNull(),
  pembicara: text().notNull(),
  googleMapLink: text(),
  meetingLink: text(),
});
