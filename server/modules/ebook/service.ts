import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreateEbookSchema, UpdateEbookSchema } from "./model";
import { createError } from "h3";
import { commitUploadedFile, deleteFile } from "~~/server/utils/files";
import { EbookRepo } from "./repo";

export abstract class EbookService {
  static async create(payload: CreateEbookSchema) {
    const { fileKey, pdfFileKey, ...data } = payload;

    const keys: { coverKey?: string; pdfKey?: string } = {};

    await Promise.all([
      commitUploadedFile(fileKey, "ebook").then((key) => {
        keys.coverKey = key;
      }),
      commitUploadedFile(pdfFileKey, "ebook").then((key) => {
        keys.pdfKey = key;
      }),
    ]).catch(async (error) => {
      if (keys.coverKey) {
        await deleteFile(keys.coverKey);
      }
      if (keys.pdfKey) {
        await deleteFile(keys.pdfKey);
      }
      throw error;
    });

    try {
      return await EbookRepo.create(data, keys.coverKey!, keys.pdfKey!);
    }
    catch (error) {
      await deleteFile(keys.coverKey!);
      await deleteFile(keys.pdfKey!);
      throw error;
    }
  }

  static async update(produkId: number, payload: UpdateEbookSchema) {
    const existing = await EbookRepo.findById(produkId);

    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: "Ebook tidak ditemukan",
      });
    }

    const { fileKey, pdfFileKey, ...data } = payload;
    const keys: { coverKey?: string; pdfKey?: string } = {};

    try {
      if (fileKey) {
        keys.coverKey = await commitUploadedFile(fileKey, "ebook");
      }
      if (pdfFileKey) {
        keys.pdfKey = await commitUploadedFile(pdfFileKey, "ebook");
      }
    }
    catch (error) {
      if (keys.coverKey) {
        await deleteFile(keys.coverKey);
      }
      if (keys.pdfKey) {
        await deleteFile(keys.pdfKey);
      }
      throw error;
    }

    try {
      await EbookRepo.update(produkId, data, keys.coverKey, keys.pdfKey);
    }
    catch (error) {
      if (keys.coverKey) {
        await deleteFile(keys.coverKey);
      }
      if (keys.pdfKey) {
        await deleteFile(keys.pdfKey);
      }
      throw error;
    }

    if (keys.coverKey && existing.foto) {
      await deleteFile(existing.foto);
    }
    if (keys.pdfKey && existing.pdfUrl) {
      await deleteFile(existing.pdfUrl);
    }
  }

  static async findAll(query: PaginationSearchSchema) {
    return await EbookRepo.findAll(query);
  }

  static async delete(produkIds: number[]) {
    const result = await EbookRepo.delete(produkIds);

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Ebook tidak ditemukan",
      });
    }

    for (const item of result) {
      if (item.foto) {
        await deleteFile(item.foto);
      }
      if (item.pdfUrl) {
        await deleteFile(item.pdfUrl);
      }
    }

    return result;
  }
}
