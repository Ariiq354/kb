import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreateEbookSchema, UpdateEbookSchema } from "./model";
import { createError } from "h3";
import { deleteFile, uploadFile } from "~~/server/utils/files";
import { EbookRepo } from "./repo";

export abstract class EbookService {
  static async create(payload: CreateEbookSchema) {
    const { file, pdfFile, ...data } = payload;

    const { key: coverKey } = await uploadFile(
      "ebook",
      file.filename!,
      file.data,
      file.type!,
    );

    const { key: pdfKey } = await uploadFile(
      "ebook",
      pdfFile.filename!,
      pdfFile.data,
      pdfFile.type!,
    );

    return await EbookRepo.create(data, coverKey, pdfKey);
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
    let coverKey: string | undefined;
    let pdfKey: string | undefined;

    if (file) {
      const { key } = await uploadFile(
        "ebook",
        file.filename!,
        file.data,
        file.type!,
      );

      if (existing.foto) {
        await deleteFile(existing.foto);
      }
      coverKey = key;
    }

    if (pdfFile) {
      const { key } = await uploadFile(
        "ebook",
        pdfFile.filename!,
        pdfFile.data,
        pdfFile.type!,
      );

      if (existing.pdfUrl) {
        await deleteFile(existing.pdfUrl);
      }
      pdfKey = key;
    }

    await EbookRepo.update(produkId, data, coverKey, pdfKey);
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
