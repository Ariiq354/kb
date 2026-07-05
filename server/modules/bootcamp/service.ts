import type { CreateBootcampSchema, GetBootcampSchema, UpdateBootcampSchema } from "./model";
import { createError } from "h3";
import { deleteFile, uploadFile } from "~~/server/utils/files";
import { BootcampRepo } from "./repo";

export abstract class BootcampService {
  static async create(payload: CreateBootcampSchema) {
    const { file, ...data } = payload;
    const fileData = file[0]!;

    const { key } = await uploadFile(
      "bootcamp",
      fileData.filename!,
      fileData.data,
      fileData.type!,
    );

    return await BootcampRepo.create(data, key);
  }

  static async update(id: number, payload: UpdateBootcampSchema) {
    const bootcamp = await BootcampRepo.findById(id);

    if (!bootcamp) {
      throw createError({
        statusCode: 404,
        statusMessage: "Bootcamp tidak ditemukan",
      });
    }

    const { file, ...data } = payload;
    let fileKey: string | undefined;

    if (file && file.length > 0) {
      const fileData = file[0]!;
      const { key } = await uploadFile(
        "bootcamp",
        fileData.filename!,
        fileData.data,
        fileData.type!,
      );
      fileKey = key;

      if (bootcamp.produk.foto) {
        await deleteFile(bootcamp.produk.foto);
      }
    }

    return await BootcampRepo.update(id, data, fileKey);
  }

  static async findAll(query: GetBootcampSchema) {
    return await BootcampRepo.findAll(query);
  }

  static async delete(ids: number[]) {
    const bootcamps = await BootcampRepo.findByIds(ids);

    for (const b of bootcamps) {
      if (b.produk.foto) {
        await deleteFile(b.produk.foto);
      }
    }

    return await BootcampRepo.delete(ids);
  }
}
