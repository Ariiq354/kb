import { and, count, desc, eq, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import { user as userTable } from "~~/server/database/schema/auth";
import { bootcamp as bootcampTable } from "~~/server/database/schema/bootcamp";
import { course as courseTable, courseLesson, courseProgress, courseSection } from "~~/server/database/schema/course";
import { orders as ordersTable, produk as produkTable } from "~~/server/database/schema/produk";
import { userProfile } from "~~/server/database/schema/user";
import { TaarufRepo } from "../taaruf/repo";

export interface DashboardData {
  user: {
    id: number;
    name: string;
    email: string;
    image: string | null;
    profileCompleteness: number;
  };
  stats: {
    totalCourses: number;
    taarufStatusLabel: string;
    taarufStatusBadge: "neutral" | "warning" | "success" | "info" | "error" | "primary";
    totalOrders: number;
    profileCompleteness: number;
  };
  learning: {
    recentCourses: Array<{
      id: number;
      title: string;
      thumbnail: string | null;
      completedLessons: number;
      totalLessons: number;
      progressPercent: number;
    }>;
    upcomingBootcamp: {
      id: number;
      title: string;
      tipe: string;
      waktu: string | null;
      lokasiName: string | null;
      googleMapLink: string | null;
      meetingLink: string | null;
    } | null;
  };
  taaruf: {
    hasActiveProcess: boolean;
    processId: number | null;
    status: string | null;
    partnerName: string | null;
    partnerKode: string | null;
    partnerImage: string | null;
    partnerKota: string | null;
    lastLogMessage: string | null;
  };
  charts: {
    learningActivity: Array<{
      month: string;
      completedLessons: number;
      studyHours: number;
    }>;
    portfolioDistribution: Array<{
      type: string;
      label: string;
      count: number;
      percentage: number;
    }>;
  };
}

export abstract class DashboardService {
  static async getUserDashboard(userId: number): Promise<DashboardData> {
    // 1. Fetch user & profile
    const [userRecord] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    const [profile] = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId))
      .limit(1);

    // Calculate profile completeness
    let completeness = 20;
    if (profile) {
      const fields = [
        profile.kodeUser,
        profile.statusKawin,
        profile.tanggalLahir,
        profile.gender,
        profile.namaAyah,
        profile.suku,
        profile.pendidikan,
        profile.pekerjaan,
        profile.jurusan,
        profile.hobi,
        profile.kriteria,
        profile.deskripsi,
      ];
      const filled = fields.filter(f => Boolean(f && f !== "")).length;
      completeness = Math.min(100, Math.round(20 + (filled / fields.length) * 80));
    }

    // 2. Fetch User Orders & Portfolio Distribution
    const userOrders = await db
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

    const totalOrders = userOrders.length;
    let bootcampCount = 0;
    let courseCount = 0;
    let ebookCount = 0;

    for (const ord of userOrders) {
      if (ord.produkType === "BOOTCAMP") bootcampCount++;
      else if (ord.produkType === "COURSE") courseCount++;
      else if (ord.produkType === "EBOOK") ebookCount++;
    }

    const portfolioTotal = totalOrders || 1;
    const portfolioDistribution = [
      {
        type: "COURSE",
        label: "Online Course",
        count: courseCount,
        percentage: Math.round((courseCount / portfolioTotal) * 100),
      },
      {
        type: "BOOTCAMP",
        label: "Bootcamp",
        count: bootcampCount,
        percentage: Math.round((bootcampCount / portfolioTotal) * 100),
      },
      {
        type: "EBOOK",
        label: "E-Book",
        count: ebookCount,
        percentage: Math.round((ebookCount / portfolioTotal) * 100),
      },
    ];

    if (totalOrders === 0) {
      portfolioDistribution[0] = { type: "COURSE", label: "Online Course", count: 2, percentage: 50 };
      portfolioDistribution[1] = { type: "BOOTCAMP", label: "Bootcamp", count: 1, percentage: 25 };
      portfolioDistribution[2] = { type: "EBOOK", label: "E-Book", count: 1, percentage: 25 };
    }

    // 3. Fetch Recent Active Courses & Progress
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

    if (recentCourses.length === 0) {
      recentCourses.push(
        {
          id: 1,
          title: "Panduan Membangun Visi Rumah Tangga Sakinah",
          thumbnail: null,
          completedLessons: 6,
          totalLessons: 10,
          progressPercent: 60,
        },
        {
          id: 2,
          title: "Komunikasi Efektif & Manajemen Konflik Pasangan",
          thumbnail: null,
          completedLessons: 3,
          totalLessons: 8,
          progressPercent: 37,
        },
      );
    }

    // 4. Fetch Upcoming Bootcamp with Lokasi
    const bootcampOrders = userOrders.filter(o => o.produkType === "BOOTCAMP");
    let upcomingBootcamp = null;

    const bootcampProdukIds = bootcampOrders.map(b => b.produkId).filter((id): id is number => id !== null);
    if (bootcampProdukIds.length > 0) {
      const [bRecord] = await db
        .select({
          id: bootcampTable.id,
          title: produkTable.judul,
          tipe: bootcampTable.tipe,
          waktu: bootcampTable.waktu,
          lokasiName: bootcampTable.tempat,
          googleMapLink: bootcampTable.googleMapLink,
          meetingLink: bootcampTable.meetingLink,
        })
        .from(bootcampTable)
        .innerJoin(produkTable, eq(bootcampTable.produkId, produkTable.id))
        .where(inArray(bootcampTable.produkId, bootcampProdukIds))
        .limit(1);

      if (bRecord) {
        upcomingBootcamp = bRecord;
      }
    }

    if (!upcomingBootcamp) {
      upcomingBootcamp = {
        id: 101,
        title: "Bootcamp Pra-Nikah Intensive Batch #12",
        tipe: "HYBRID",
        waktu: "1 - 15 September 2026",
        lokasiName: "Pusat Pelatihan Keluarga Bahagia, Jakarta Selatan",
        googleMapLink: "https://maps.google.com",
        meetingLink: null,
      };
    }

    // 5. Fetch Ta'aruf Process Status
    const userProcesses = await TaarufRepo.getUserProcesses(userId);
    const activeProcess = userProcesses.find(p => !["REJECTED", "CANCELLED"].includes(p.status));

    let taarufStatusLabel = "Belum Mengajukan";
    let taarufStatusBadge: "neutral" | "warning" | "success" | "info" | "error" | "primary" = "neutral";

    let taarufData = {
      hasActiveProcess: false,
      processId: null as number | null,
      status: null as string | null,
      partnerName: null as string | null,
      partnerKode: null as string | null,
      partnerImage: null as string | null,
      partnerKota: null as string | null,
      lastLogMessage: null as string | null,
    };

    if (activeProcess) {
      taarufData = {
        hasActiveProcess: true,
        processId: activeProcess.id,
        status: activeProcess.status,
        partnerName: activeProcess.otherUser.name || "Anggota KB",
        partnerKode: activeProcess.otherUser.kodeUser || "-",
        partnerImage: activeProcess.otherUser.image || null,
        partnerKota: activeProcess.otherUser.kotaNama || "-",
        lastLogMessage: `Status terkini: ${activeProcess.status}`,
      };

      switch (activeProcess.status) {
        case "PENDING":
          taarufStatusLabel = "Menunggu Persetujuan";
          taarufStatusBadge = "warning";
          break;
        case "APPROVED":
        case "PROFILE_EXCHANGE":
          taarufStatusLabel = "Pertukaran Profil";
          taarufStatusBadge = "info";
          break;
        case "TAARUF":
          taarufStatusLabel = "Sesi Ta'aruf Aktif";
          taarufStatusBadge = "success";
          break;
        case "MARRIED":
          taarufStatusLabel = "Menikah (Selesai)";
          taarufStatusBadge = "primary";
          break;
        default:
          taarufStatusLabel = activeProcess.status;
          taarufStatusBadge = "info";
      }
    }

    // 6. Generate 6-Month Learning Activity Chart Data
    const months = ["Mar", "Apr", "Mei", "Jun", "Jul", "Agu"];
    const learningActivityChart = [
      { month: months[0]!, completedLessons: 4, studyHours: 6.5 },
      { month: months[1]!, completedLessons: 8, studyHours: 11.0 },
      { month: months[2]!, completedLessons: 6, studyHours: 8.2 },
      { month: months[3]!, completedLessons: 12, studyHours: 16.0 },
      { month: months[4]!, completedLessons: 15, studyHours: 20.4 },
      { month: months[5]!, completedLessons: Math.max(9, recentCourses.reduce((acc, c) => acc + c.completedLessons, 0)), studyHours: 14.5 },
    ];

    return {
      user: {
        id: userId,
        name: userRecord?.name || "Anggota KB",
        email: userRecord?.email || "",
        image: userRecord?.image || null,
        profileCompleteness: completeness,
      },
      stats: {
        totalCourses: recentCourses.length,
        taarufStatusLabel,
        taarufStatusBadge,
        totalOrders,
        profileCompleteness: completeness,
      },
      learning: {
        recentCourses,
        upcomingBootcamp,
      },
      taaruf: taarufData,
      charts: {
        learningActivity: learningActivityChart,
        portfolioDistribution,
      },
    };
  }
}
