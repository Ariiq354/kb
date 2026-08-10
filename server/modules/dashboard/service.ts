import { TaarufRepo } from "../taaruf/repo";
import { DashboardRepo } from "./repo";

export abstract class DashboardService {
  static async getUserDashboard(userId: number) {
    // 1. User & Profile Info
    const userInfo = await DashboardRepo.getUserBasicInfo(userId);
    const profile = userInfo.profile;

    let completeness = 0;
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

    // 2. User Orders & Portfolio Distribution
    const userOrders = await DashboardRepo.getUserOrdersWithProduct(userId);
    const totalOrders = userOrders.length;
    let bootcampCount = 0;
    let courseCount = 0;
    let ebookCount = 0;

    for (const ord of userOrders) {
      if (ord.produkType === "BOOTCAMP")
        bootcampCount++;
      else if (ord.produkType === "COURSE")
        courseCount++;
      else if (ord.produkType === "EBOOK")
        ebookCount++;
    }

    const portfolioTotal = totalOrders || 1;
    const portfolioDistribution = [
      {
        type: "COURSE",
        label: "Online Course",
        count: courseCount,
        percentage: totalOrders > 0 ? Math.round((courseCount / portfolioTotal) * 100) : 0,
      },
      {
        type: "BOOTCAMP",
        label: "Bootcamp",
        count: bootcampCount,
        percentage: totalOrders > 0 ? Math.round((bootcampCount / portfolioTotal) * 100) : 0,
      },
      {
        type: "EBOOK",
        label: "E-Book",
        count: ebookCount,
        percentage: totalOrders > 0 ? Math.round((ebookCount / portfolioTotal) * 100) : 0,
      },
    ];

    // 3. Recent Courses
    const recentCourses = await DashboardRepo.getRecentCourses(userId);

    // 5. Ta'aruf Process Status
    const userProcesses = await TaarufRepo.getUserProcesses(userId);
    const activeProcess = userProcesses.find(p => !["REJECTED", "CANCELLED"].includes(p.status));

    let taarufStatusLabel = "Belum Mengajukan";
    let taarufStatusBadge: "neutral" | "warning" | "success" | "info" | "error" | "primary" = "neutral";

    if (activeProcess) {
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

    // 6. Learning Activity Chart Data (6 months)
    const learningActivityChart = await DashboardRepo.getMonthlyLearningActivity(userId);

    return {
      user: {
        profileCompleteness: completeness,
      },
      stats: {
        totalCourses: recentCourses.length,
        taarufStatusLabel,
        taarufStatusBadge,
        totalOrders,
      },
      charts: {
        learningActivity: learningActivityChart,
        portfolioDistribution,
      },
    };
  }
}
