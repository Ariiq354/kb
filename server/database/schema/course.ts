import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { userTable } from "./auth";
import { produkTable } from "./produk";

export const courseTable = pgTable("course", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  produkId: integer().references(() => produkTable.id, { onDelete: "cascade" }).notNull().unique(),
  deskripsi: text(),
  namaPublisher: text(),
});

export const courseSectionTable = pgTable("course_section", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  courseId: integer().references(() => courseTable.id, { onDelete: "cascade" }),
  judul: text().notNull(),
  order: integer().notNull(),
});

export const courseLessonTable = pgTable("course_lesson", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  sectionId: integer().references(() => courseSectionTable.id, { onDelete: "cascade" }),
  judul: text().notNull(),
  videoUrl: text().notNull(),
  duration: integer(),
  order: integer().notNull(),
});

export const courseProgressTable = pgTable("course_progress", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: integer().notNull().references(() => userTable.id, { onDelete: "cascade" }),
  lessonId: integer().notNull().references(() => courseLessonTable.id),
  completedAt: timestamp().defaultNow().notNull(),
});
