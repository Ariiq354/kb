import { boolean, integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { userTable } from "./auth";
import { createdUpdated } from "./common";
import { diskonTable } from "./diskon";

export const produkTypeEnum = pgEnum("produk_type", [
  "BOOTCAMP",
  "EBOOK",
  "COURSE",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "PENDING_PAYMENT",
  "WAITING_VERIFICATION",
  "PAID",
]);

export const produkTable = pgTable("produk", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  type: produkTypeEnum("type").notNull(),
  judul: text().notNull(),
  harga: integer().notNull(),
  status: boolean().default(true).notNull(),
  foto: text().notNull(),
  ...createdUpdated,
});

export const orders = pgTable("orders", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: integer().notNull().references(() => userTable.id, { onDelete: "cascade" }),
  produkId: integer().references(() => produkTable.id, { onDelete: "cascade" }),
  diskonId: integer().references(() => diskonTable.id, { onDelete: "cascade" }),
  originalHarga: integer().notNull(),
  diskonPersen: integer().default(0).notNull(),
  finalHarga: integer().notNull(),
  status: orderStatusEnum("status").default("PENDING_PAYMENT").notNull(),
  ...createdUpdated,
});
