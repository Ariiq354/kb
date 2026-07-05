import { date, integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { userTable } from "./auth";
import { createdUpdated } from "./common";

export const taarufStatusEnum = pgEnum("taaruf_status", [
  "PENDING",
  "APPROVED",
  "PROFILE_EXCHANGE",
  "TAARUF",
  "REJECTED",
  "CANCELLED",
  "MARRIED",
]);

export const taarufProsesTable = pgTable("taaruf_proses", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  requesterUserId: integer().notNull().references(() => userTable.id, { onDelete: "cascade" }),
  targetUserId: integer().notNull().references(() => userTable.id, { onDelete: "cascade" }),
  status: taarufStatusEnum().default("PENDING").notNull(),
  startedAt: date({ mode: "string" }),
  finishedAt: date({ mode: "string" }),
  ...createdUpdated,
});

export const taarufProsesLogTable = pgTable("taaruf_proses_logs", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  prosesId: integer().notNull().references(() => taarufProsesTable.id, { onDelete: "cascade" }),
  status: taarufStatusEnum().notNull(),
  keterangan: text(),
  ...createdUpdated,
});
