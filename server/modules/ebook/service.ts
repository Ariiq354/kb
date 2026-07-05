import type { CreateEbookSchema, GetEbookSchema, UpdateEbookSchema } from "./model";
import { createError } from "h3";
import { deleteFile, uploadFile } from "~~/server/utils/files";
import { EbookRepo } from "./repo";

export abstract class EbookService {
  static async create(payload: CreateEbookSchema) {
    const { foto, pdfFile, ...data } = payload;
    const fotoData = foto[0]!;
    const pdfData = pdfFile[0]!;

    const { key: fotoKey } = await uploadFile(
      "ebook",
      fotoData.filename!,
      fotoData.data,
      fotoData.type!,
    );

    const { key: pdfKey } = await uploadFile(
      "ebook",
      pdfData.filename!,
      pdfData.data,
      pdfData.type!,
    );

    return await EbookRepo.create(data, fotoKey, pdfKey);
  }

  static async update(id: number, payload: UpdateEbookSchema) {
    const ebook = await EbookRepo.findById(id);

    if (!ebook) {
      throw createError({
        statusCode: 404,
        statusMessage: "Ebook tidak ditemukan",
      });
    }

    const { foto, pdfFile, ...data } = payload;
    let fotoKey: string | undefined;
    let pdfKey: string | undefined;

    if (foto && foto.length > 0) {
      const fotoData = foto[0]!;
      const { key } = await uploadFile(
        "ebook",
        fotoData.filename!,
        fotoData.data,
        fotoData.type!,
      );
      fotoKey = key;

      if (ebook.produk.foto) {
        await deleteFile(ebook.produk.foto);
      }
    }

    if (pdfFile && pdfFile.length > 0) {
      const pdfData = pdfFile[0]!;
      const { key } = await uploadFile(
        "ebook",
        pdfData.filename!,
        pdfData.data,
        pdfData.type!,
      );
      pdfKey = key;

      if (ebook.pdfUrl) {
        await deleteFile(ebook.pdfUrl);
      }
    }

    return await EbookRepo.update(id, data, fotoKey, pdfKey);
  }

  static async findAll(query: GetEbookSchema) {
    return await EbookRepo.findAll(query);
  }

  static async delete(ids: number[]) {
    const ebooks = await EbookRepo.findByIds(ids);

    for (const b of ebooks) {
      if (b.produk.foto) {
        await deleteFile(b.produk.foto);
      }
      if (b.ebook.pdfUrl) {
        await deleteFile(b.ebook.pdfUrl);
      }
    }

    return await EbookRepo.delete(ids);
  }
}
