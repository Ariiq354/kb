import { and, count, desc, eq, inArray, notInArray, or } from "drizzle-orm";
import { db } from "~~/server/database";
import { user } from "~~/server/database/schema/auth";
import { taarufProses, taarufProsesLog } from "~~/server/database/schema/taaruf";
import { userProfile } from "~~/server/database/schema/user";
import { kota } from "~~/server/database/schema/wilayah";

export abstract class TaarufRepo {
  // 1. Get active processes count for a user (either as requester or target)
  static async getActiveCount(userId: number): Promise<number> {
    const [result] = await db
      .select({ val: count() })
      .from(taarufProses)
      .where(
        and(
          or(
            eq(taarufProses.requesterUserId, userId),
            eq(taarufProses.targetUserId, userId),
          ),
          notInArray(taarufProses.status, ["REJECTED", "CANCELLED", "MARRIED"]),
        ),
      );
    return result?.val || 0;
  }

  // 2. Check if a user is married
  static async hasMarriedStatus(userId: number): Promise<boolean> {
    const [result] = await db
      .select({ val: count() })
      .from(taarufProses)
      .where(
        and(
          or(
            eq(taarufProses.requesterUserId, userId),
            eq(taarufProses.targetUserId, userId),
          ),
          eq(taarufProses.status, "MARRIED"),
        ),
      );
    return (result?.val || 0) > 0;
  }

  // 3. Check if an active process already exists between two users
  static async isProcessExists(userA: number, userB: number): Promise<boolean> {
    const [result] = await db
      .select({ val: count() })
      .from(taarufProses)
      .where(
        and(
          or(
            and(eq(taarufProses.requesterUserId, userA), eq(taarufProses.targetUserId, userB)),
            and(eq(taarufProses.requesterUserId, userB), eq(taarufProses.targetUserId, userA)),
          ),
          notInArray(taarufProses.status, ["REJECTED", "CANCELLED", "MARRIED"]),
        ),
      );
    return (result?.val || 0) > 0;
  }

  // 4. Create a new ta'aruf request in a transaction
  static async createProcess(requesterId: number, targetId: number, requesterName: string) {
    return await db.transaction(async (tx) => {
      // Insert process
      const [newProses] = await tx
        .insert(taarufProses)
        .values({
          requesterUserId: requesterId,
          targetUserId: targetId,
          status: "PENDING",
        })
        .returning();

      if (!newProses) {
        throw new Error("Gagal membuat proses ta'aruf");
      }

      // Insert initial log
      await tx
        .insert(taarufProsesLog)
        .values({
          prosesId: newProses.id,
          status: "PENDING",
          keterangan: `Ta'aruf diajukan oleh ${requesterName}`,
        });

      return newProses;
    });
  }

  // 5. Get user specific processes (either as requester or target) joined with user names and regions
  static async getUserProcesses(userId: number) {
    const data = await db
      .select({
        id: taarufProses.id,
        requesterUserId: taarufProses.requesterUserId,
        targetUserId: taarufProses.targetUserId,
        status: taarufProses.status,
        startedAt: taarufProses.startedAt,
        finishedAt: taarufProses.finishedAt,
        createdAt: taarufProses.createdAt,
        updatedAt: taarufProses.updatedAt,
        // Requester details
        requesterName: user.name,
        requesterImage: user.image,
        requesterKode: userProfile.kodeUser,
        requesterGender: userProfile.gender,
        requesterKota: kota.name,
      })
      .from(taarufProses)
      // Join requester
      .leftJoin(user, eq(taarufProses.requesterUserId, user.id))
      .leftJoin(userProfile, eq(user.id, userProfile.userId))
      .leftJoin(kota, eq(userProfile.kota, kota.id))
      .where(
        or(
          eq(taarufProses.requesterUserId, userId),
          eq(taarufProses.targetUserId, userId),
        ),
      )
      .orderBy(desc(taarufProses.id));

    // For each process, we need the other person's details
    // We can do another quick select or build a clean mapped output
    const mapped = [];
    for (const p of data) {
      const otherUserId = p.requesterUserId === userId ? p.targetUserId : p.requesterUserId;

      const [other] = await db
        .select({
          id: user.id,
          name: user.name,
          image: user.image,
          kodeUser: userProfile.kodeUser,
          gender: userProfile.gender,
          kotaNama: kota.name,
        })
        .from(user)
        .leftJoin(userProfile, eq(user.id, userProfile.userId))
        .leftJoin(kota, eq(userProfile.kota, kota.id))
        .where(eq(user.id, otherUserId))
        .limit(1);

      mapped.push({
        ...p,
        otherUser: other || { id: otherUserId, name: "Anggota", image: null, kodeUser: "-", gender: "-", kotaNama: "-" },
      });
    }

    return mapped;
  }

  // 6. Get all processes for admin view
  static async getAdminProcesses() {
    const data = await db
      .select({
        id: taarufProses.id,
        requesterUserId: taarufProses.requesterUserId,
        targetUserId: taarufProses.targetUserId,
        status: taarufProses.status,
        startedAt: taarufProses.startedAt,
        finishedAt: taarufProses.finishedAt,
        createdAt: taarufProses.createdAt,
        updatedAt: taarufProses.updatedAt,
      })
      .from(taarufProses)
      .orderBy(desc(taarufProses.id));

    const mapped = [];
    for (const p of data) {
      const [req] = await db
        .select({ name: user.name, kodeUser: userProfile.kodeUser })
        .from(user)
        .leftJoin(userProfile, eq(user.id, userProfile.userId))
        .where(eq(user.id, p.requesterUserId))
        .limit(1);

      const [tgt] = await db
        .select({ name: user.name, kodeUser: userProfile.kodeUser })
        .from(user)
        .leftJoin(userProfile, eq(user.id, userProfile.userId))
        .where(eq(user.id, p.targetUserId))
        .limit(1);

      mapped.push({
        ...p,
        requester: req || { name: "-", kodeUser: "-" },
        target: tgt || { name: "-", kodeUser: "-" },
      });
    }

    return mapped;
  }

  // 7. Find a process by ID with its history logs
  static async findById(id: number) {
    const [proses] = await db
      .select()
      .from(taarufProses)
      .where(eq(taarufProses.id, id))
      .limit(1);

    if (!proses)
      return null;

    const logs = await db
      .select()
      .from(taarufProsesLog)
      .where(eq(taarufProsesLog.prosesId, id))
      .orderBy(desc(taarufProsesLog.id));

    // Get user names
    const [req] = await db.select({ name: user.name }).from(user).where(eq(user.id, proses.requesterUserId)).limit(1);
    const [tgt] = await db.select({ name: user.name }).from(user).where(eq(user.id, proses.targetUserId)).limit(1);

    return {
      ...proses,
      requesterName: req?.name || "Anggota",
      targetName: tgt?.name || "Anggota",
      logs,
    };
  }

  // 8. Update status in a transaction (with auto-cancellation logic if MARRIED)
  static async updateStatus(id: number, status: "PENDING" | "APPROVED" | "PROFILE_EXCHANGE" | "TAARUF" | "REJECTED" | "CANCELLED" | "MARRIED", keterangan?: string) {
    return await db.transaction(async (tx) => {
      const [proses] = await tx
        .select()
        .from(taarufProses)
        .where(eq(taarufProses.id, id))
        .limit(1);

      if (!proses) {
        throw new Error("Proses ta'aruf tidak ditemukan");
      }

      const todayStr = new Date().toISOString().split("T")[0]!;

      // Update targeted process
      await tx
        .update(taarufProses)
        .set({
          status,
          finishedAt: ["REJECTED", "CANCELLED", "MARRIED"].includes(status) ? todayStr : null,
          startedAt: status === "APPROVED" ? todayStr : undefined,
        })
        .where(eq(taarufProses.id, id));

      // Add log
      await tx
        .insert(taarufProsesLog)
        .values({
          prosesId: id,
          status,
          keterangan: keterangan || `Status diperbarui menjadi ${status}`,
        });

      // Special rule: if MARRIED, auto-cancel all other active processes for BOTH users
      if (status === "MARRIED") {
        const userIds = [proses.requesterUserId, proses.targetUserId];

        // Find all other active processes
        const otherActive = await tx
          .select({ id: taarufProses.id, requesterUserId: taarufProses.requesterUserId, targetUserId: taarufProses.targetUserId })
          .from(taarufProses)
          .where(
            and(
              notInArray(taarufProses.status, ["REJECTED", "CANCELLED", "MARRIED"]),
              or(
                inArray(taarufProses.requesterUserId, userIds),
                inArray(taarufProses.targetUserId, userIds),
              ),
              notInArray(taarufProses.id, [id]), // Exclude current process
            ),
          );

        for (const p of otherActive) {
          // Cancel process
          await tx
            .update(taarufProses)
            .set({
              status: "CANCELLED",
              finishedAt: todayStr,
            })
            .where(eq(taarufProses.id, p.id));

          // Add log
          await tx
            .insert(taarufProsesLog)
            .values({
              prosesId: p.id,
              status: "CANCELLED",
              keterangan: "Ta'aruf dibatalkan secara otomatis karena salah satu pihak telah melangsungkan pernikahan (Married).",
            });
        }
      }

      return true;
    });
  }
}
