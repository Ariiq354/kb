import type { CreateProdukSchema, GetProdukSchema, UpdateProdukSchema } from "./model";
import { deleteFile, uploadFile } from "~~/server/utils/files";
import { ProdukRepo } from "./repo";

export abstract class ProdukService {
  static async create(payload: CreateProdukSchema) {
    const { file, ...data } = payload;
    const fileData = file[0]!;

    const { key } = await uploadFile(
      "produk",
      fileData.filename!,
      fileData.data,
      fileData.type!,
    );

    return await ProdukRepo.create(data, key);
  }

  static async update(id: number, payload: UpdateProdukSchema) {
    const produk = await ProdukRepo.findById(id);

    if (!produk) {
      throw createError({
        statusCode: 404,
        statusMessage: "Produk tidak ditemukan",
      });
    }

    const { file, ...data } = payload;
    let fileKey: string | undefined;

    if (file && file.length > 0) {
      const fileData = file[0]!;
      const { key } = await uploadFile(
        "produk",
        fileData.filename!,
        fileData.data,
        fileData.type!,
      );
      fileKey = key;

      if (produk.foto) {
        await deleteFile(produk.foto);
      }
    }

    return await ProdukRepo.update(id, data, fileKey);
  }

  static async findAll(query: GetProdukSchema) {
    return await ProdukRepo.findAll(query);
  }

  static async delete(id: number) {
    const produk = await ProdukRepo.findById(id);

    if (!produk) {
      throw createError({
        statusCode: 404,
        statusMessage: "Produk tidak ditemukan",
      });
    }

    if (produk.foto) {
      await deleteFile(produk.foto);
    }

    return await ProdukRepo.delete(id);
  }
}
