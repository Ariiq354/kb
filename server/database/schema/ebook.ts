import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { produkTable } from "./produk";

export const ebookTable = pgTable("ebook", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  produkId: integer().references(() => produkTable.id, { onDelete: "cascade" }).notNull().unique(),
  deskripsi: text(),
  pdfUrl: text().notNull(),
});
