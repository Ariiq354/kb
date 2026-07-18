import type { UserWithId } from "~~/server/utils/auth";
import { createError } from "h3";
import { UserRepo } from "~~/server/modules/users/repo";
import { UserService } from "~~/server/modules/users/service";
import { TaarufRepo } from "./repo";

export abstract class TaarufService {
  // 1. Create ta'aruf request with all required safety checks
  static async createRequest(requester: UserWithId, targetUserId: number) {
    if (requester.id === targetUserId) {
      throw createError({
        statusCode: 400,
        message: "Anda tidak dapat mengajukan ta'aruf kepada diri sendiri.",
      });
    }

    // A. Fetch requester profile details
    const requesterProfile = await UserService.getUserProfile(requester.id);
    if (!requesterProfile || !requesterProfile.kodeUser) {
      throw createError({
        statusCode: 403,
        message: "Harap lengkapi profil Anda terlebih dahulu.",
      });
    }

    // B. Fetch target profile details
    const targetProfile = await UserService.getUserProfile(targetUserId);
    if (!targetProfile || !targetProfile.kodeUser) {
      throw createError({
        statusCode: 400,
        message: "Profil calon pasangan yang Anda tuju belum lengkap.",
      });
    }

    // C. Check opposite gender rule
    if (requesterProfile.gender === targetProfile.gender) {
      throw createError({
        statusCode: 400,
        message: "Pengajuan ta'aruf harus dilakukan dengan lawan jenis.",
      });
    }

    // D. Ensure target is not banned
    const targetUser = await UserRepo.findById(targetUserId);
    if (!targetUser) {
      throw createError({
        statusCode: 404,
        message: "Calon pasangan tidak ditemukan.",
      });
    }
    if (targetUser.banned) {
      throw createError({
        statusCode: 400,
        message: "Calon pasangan yang Anda tuju sedang ditangguhkan (Banned).",
      });
    }

    // E. Ensure neither party has a MARRIED status process
    const isRequesterMarried = await TaarufRepo.hasMarriedStatus(requester.id);
    if (isRequesterMarried) {
      throw createError({
        statusCode: 400,
        message: "Anda sudah berstatus Menikah di sistem kami.",
      });
    }

    const isTargetMarried = await TaarufRepo.hasMarriedStatus(targetUserId);
    if (isTargetMarried) {
      throw createError({
        statusCode: 400,
        message: "Calon pasangan yang Anda tuju sudah berstatus Menikah.",
      });
    }

    // F. Verify limit: requester has < 3 active processes
    const requesterActiveCount = await TaarufRepo.getActiveCount(requester.id);
    if (requesterActiveCount >= 3) {
      throw createError({
        statusCode: 400,
        message: "Anda telah mencapai batas maksimal 3 proses ta'aruf aktif.",
      });
    }

    // G. Verify limit: target has < 3 active processes
    const targetActiveCount = await TaarufRepo.getActiveCount(targetUserId);
    if (targetActiveCount >= 3) {
      throw createError({
        statusCode: 400,
        message: "Calon pasangan yang Anda tuju sudah mencapai batas maksimal 3 proses ta'aruf aktif.",
      });
    }

    // H. Verify if an active process already exists between them
    const isAlreadyExistent = await TaarufRepo.isProcessExists(requester.id, targetUserId);
    if (isAlreadyExistent) {
      throw createError({
        statusCode: 400,
        message: "Proses ta'aruf aktif dengan calon pasangan ini sudah berjalan.",
      });
    }

    // All checks pass, create the request!
    return await TaarufRepo.createProcess(requester.id, targetUserId, requester.name);
  }

  // 2. Fetch processes list for the logged-in user
  static async getUserProcesses(userId: number) {
    // Make sure the user has a profile
    const profile = await UserService.getUserProfile(userId);
    if (!profile || !profile.kodeUser) {
      throw createError({
        statusCode: 403,
        message: "Harap lengkapi profil Anda terlebih dahulu.",
      });
    }
    return await TaarufRepo.getUserProcesses(userId);
  }

  // 3. Fetch all processes (Admin dashboard)
  static async getAdminProcesses() {
    return await TaarufRepo.getAdminProcesses();
  }

  // 4. Cancel a ta'aruf process by a user
  static async cancelProcess(prosesId: number, userId: number) {
    const proses = await TaarufRepo.findById(prosesId);

    if (!proses) {
      throw createError({
        statusCode: 404,
        message: "Proses ta'aruf tidak ditemukan.",
      });
    }

    const isRequester = proses.requesterUserId === userId;
    const isTarget = proses.targetUserId === userId;

    if (!isRequester && !isTarget) {
      throw createError({
        statusCode: 403,
        message: "Anda tidak berhak mengakses proses ta'aruf ini.",
      });
    }

    // Validate active status
    if (["REJECTED", "CANCELLED", "MARRIED"].includes(proses.status)) {
      throw createError({
        statusCode: 400,
        message: "Proses ta'aruf ini sudah selesai / tidak aktif.",
      });
    }

    return await TaarufRepo.updateStatus(prosesId, "CANCELLED", "Ta'aruf dibatalkan oleh pengguna.");
  }

  // 5. Update process status by admin
  static async updateStatusByAdmin(prosesId: number, status: "PENDING" | "APPROVED" | "PROFILE_EXCHANGE" | "TAARUF" | "REJECTED" | "CANCELLED" | "MARRIED", keterangan?: string) {
    return await TaarufRepo.updateStatus(prosesId, status, keterangan);
  }

  // 6. Find details by ID
  static async findById(prosesId: number, userId: number, isAdmin: boolean) {
    const proses = await TaarufRepo.findById(prosesId);

    if (!proses) {
      throw createError({
        statusCode: 404,
        message: "Proses ta'aruf tidak ditemukan.",
      });
    }

    const isRequester = proses.requesterUserId === userId;
    const isTarget = proses.targetUserId === userId;

    if (!isAdmin && !isRequester && !isTarget) {
      throw createError({
        statusCode: 403,
        message: "Anda tidak berhak mengakses proses ta'aruf ini.",
      });
    }

    return proses;
  }
}
