import { boolean, date, integer, pgTable, text } from "drizzle-orm/pg-core";
import { createdUpdated } from "./common";

export const diskonTable = pgTable("diskon", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  kode: text().notNull().unique(),
  persen: integer().notNull(),
  batasWaktu: date({ mode: "string" }).notNull(),
  batasPemakai: integer().notNull(),
  jumlahDipakai: integer().notNull().default(0),
  status: boolean().notNull().default(true),
  ...createdUpdated,
});
