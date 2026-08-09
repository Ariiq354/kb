import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreateEbookSchema, UpdateEbookSchema } from "./model";
import { createError } from "h3";
import { deleteFile } from "~~/server/utils/files";
import { EbookRepo } from "./repo";

export abstract class EbookService {
  static async create(payload: CreateEbookSchema) {
    const { file, pdfFile, ...data } = payload;

    if (!file) {
      throw createError({
        statusCode: 400,
        statusMessage: "Cover ebook wajib diunggah!",
      });
    }

    if (!pdfFile) {
      throw createError({
        statusCode: 400,
        statusMessage: "File PDF ebook wajib diunggah!",
      });
    }

    return await EbookRepo.create(data, file, pdfFile);
  }

  static async update(produkId: number, payload: UpdateEbookSchema) {
    const existing = await EbookRepo.findById(produkId);

    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: "Ebook tidak ditemukan",
      });
    }

    const { file, pdfFile, ...data } = payload;

    await EbookRepo.update(produkId, data, file, pdfFile);

    if (file && existing.foto) {
      await deleteFile(existing.foto);
    }

    if (pdfFile && existing.pdfUrl) {
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
