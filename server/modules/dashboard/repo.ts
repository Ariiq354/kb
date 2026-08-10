import { and, count, eq, gte, lte, sum } from "drizzle-orm";
import { db } from "~~/server/database";
import { courseLesson, courseProgress, courseSection, course as courseTable } from "~~/server/database/schema/course";
import { orders as ordersTable, produk as produkTable } from "~~/server/database/schema/produk";
import { userProfile } from "~~/server/database/schema/user";

export abstract class DashboardRepo {
  // 1. Get basic user info & profile
  static async getUserBasicInfo(userId: number) {
    const [profile] = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId))
      .limit(1);

    return {
      profile: profile || null,
    };
  }

  // 2. Get user orders joined with products
  static async getUserOrdersWithProduct(userId: number) {
    return await db
      .select({
        id: ordersTable.id,
        status: ordersTable.status,
        produkType: produkTable.type,
        produkId: produkTable.id,
        produkJudul: produkTable.judul,
      })
      .from(ordersTable)
      .innerJoin(produkTable, eq(ordersTable.produkId, produkTable.id))
      .where(eq(ordersTable.userId, userId));
  }

  // 3. Get user's course progress & recent active courses
  static async getRecentCourses(userId: number) {
    const userProgress = await db
      .select({
        courseId: courseTable.id,
        courseTitle: produkTable.judul,
        thumbnail: produkTable.foto,
        completedCount: count(courseProgress.id),
      })
      .from(courseProgress)
      .innerJoin(courseLesson, eq(courseProgress.lessonId, courseLesson.id))
      .innerJoin(courseSection, eq(courseLesson.sectionId, courseSection.id))
      .innerJoin(courseTable, eq(courseSection.courseId, courseTable.id))
      .innerJoin(produkTable, eq(courseTable.produkId, produkTable.id))
      .where(eq(courseProgress.userId, userId))
      .groupBy(courseTable.id, produkTable.judul, produkTable.foto);

    const recentCourses = [];
    for (const p of userProgress) {
      const [totalRecord] = await db
        .select({ val: count() })
        .from(courseLesson)
        .innerJoin(courseSection, eq(courseLesson.sectionId, courseSection.id))
        .where(eq(courseSection.courseId, p.courseId));

      const totalLessons = totalRecord?.val || 1;
      const completedLessons = Number(p.completedCount);
      const progressPercent = Math.min(100, Math.round((completedLessons / totalLessons) * 100));

      recentCourses.push({
        id: p.courseId,
        title: p.courseTitle,
        thumbnail: p.thumbnail,
        completedLessons,
        totalLessons,
        progressPercent,
      });
    }

    return recentCourses;
  }

  // 5. Get 6-month learning activity data from courseProgress DB
  static async getMonthlyLearningActivity(userId: number) {
    const now = new Date();
    const result = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

      const [progressStats] = await db
        .select({
          completedCount: count(courseProgress.id),
          totalDurationSec: sum(courseLesson.duration),
        })
        .from(courseProgress)
        .innerJoin(courseLesson, eq(courseProgress.lessonId, courseLesson.id))
        .where(
          and(
            eq(courseProgress.userId, userId),
            gte(courseProgress.completedAt, startOfMonth),
            lte(courseProgress.completedAt, endOfMonth),
          ),
        );

      const completedLessons = Number(progressStats?.completedCount || 0);
      const durationVal = Number(progressStats?.totalDurationSec || 0);
      const studyHours = durationVal > 0
        ? Math.round((durationVal / 3600) * 10) / 10
        : Math.round(completedLessons * 0.5 * 10) / 10;

      result.push({
        completedLessons,
        studyHours,
      });
    }

    return result;
  }
}
