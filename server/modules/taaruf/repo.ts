import type { SQL } from "drizzle-orm";
import type { CreateTaarufSchema, GetTaarufSchema, UpdateTaarufStatusSchema } from "./model";
import { and, desc, eq } from "drizzle-orm";
import { db } from "~~/server/database";
import { taarufProsesLogTable, taarufProsesTable } from "~~/server/database/schema/taaruf";

export abstract class TaarufRepo {
  static async create(data: CreateTaarufSchema) {
    return await db.transaction(async (tx) => {
      const [result] = await tx
        .insert(taarufProsesTable)
        .values({
          requesterUserId: data.requesterUserId,
          targetUserId: data.targetUserId,
          status: "PENDING",
          startedAt: new Date().toISOString().split("T")[0],
        })
        .returning();

      await tx.insert(taarufProsesLogTable).values({
        prosesId: result!.id,
        status: "PENDING",
        keterangan: "Taaruf process initiated",
      });

      return result;
    });
  }

  static async updateStatus(id: number, data: UpdateTaarufStatusSchema) {
    return await db.transaction(async (tx) => {
      const updateData: any = { status: data.status };

      if (data.status === "MARRIED" || data.status === "REJECTED" || data.status === "CANCELLED") {
        updateData.finishedAt = new Date().toISOString().split("T")[0];
      }

      const [result] = await tx
        .update(taarufProsesTable)
        .set(updateData)
        .where(eq(taarufProsesTable.id, id))
        .returning();

      if (result) {
        await tx.insert(taarufProsesLogTable).values({
          prosesId: result.id,
          status: data.status,
          keterangan: data.keterangan,
        });
      }

      return result;
    });
  }

  static async findById(id: number) {
    const [result] = await db
      .select()
      .from(taarufProsesTable)
      .where(eq(taarufProsesTable.id, id))
      .limit(1);
    return result || null;
  }

  static async findAll(query: GetTaarufSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.status) {
      conditions.push(eq(taarufProsesTable.status, query.status));
    }

    const qb = db
      .select()
      .from(taarufProsesTable)
      .orderBy(desc(taarufProsesTable.id))
      .where(and(...conditions));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async delete(id: number) {
    return await db
      .delete(taarufProsesTable)
      .where(eq(taarufProsesTable.id, id));
  }
}
