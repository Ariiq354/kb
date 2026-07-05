import type { CreateUserProfileSchema, GetUserProfileSchema, UpdateUserProfileSchema, MePatchProfileSchema } from "./model";
import { deleteFile, uploadFile } from "~~/server/utils/files";
import { UserProfileRepo } from "./repo";

export abstract class UserProfileService {
  static async create(payload: CreateUserProfileSchema) {
    const { file, ...data } = payload;
    const fileData = file[0]!;

    const { key } = await uploadFile(
      "user-profile",
      fileData.filename!,
      fileData.data,
      fileData.type!,
    );

    return await UserProfileRepo.create(data, key);
  }

  static async update(id: number, payload: UpdateUserProfileSchema) {
    const profile = await UserProfileRepo.findById(id);

    if (!profile) {
      throw createError({
        statusCode: 404,
        statusMessage: "Profile tidak ditemukan",
      });
    }

    const { file, ...data } = payload;
    let fileKey: string | undefined;

    if (file && file.length > 0) {
      const fileData = file[0]!;
      const { key } = await uploadFile(
        "user-profile",
        fileData.filename!,
        fileData.data,
        fileData.type!,
      );
      fileKey = key;

      if (profile.foto) {
        await deleteFile(profile.foto);
      }
    }

    return await UserProfileRepo.update(id, data, fileKey);
  }

  static async findAll(query: GetUserProfileSchema) {
    return await UserProfileRepo.findAll(query);
  }

  static async delete(id: number) {
    const profile = await UserProfileRepo.findById(id);

    if (!profile) {
      throw createError({
        statusCode: 404,
        statusMessage: "Profile tidak ditemukan",
      });
    }

    if (profile.foto) {
      await deleteFile(profile.foto);
    }

    return await UserProfileRepo.delete(id);
  }

  static async findMe(userId: number) {
    return await UserProfileRepo.findMe(userId);
  }

  static async updateMe(userId: number, payload: MePatchProfileSchema) {
    const profile = await UserProfileRepo.findMe(userId);

    const { file, ...data } = payload;
    let fileKey: string | undefined;

    if (file && file.length > 0) {
      const fileData = file[0]!;
      const { key } = await uploadFile(
        "user-profile",
        fileData.filename!,
        fileData.data,
        fileData.type!,
      );
      fileKey = key;

      if (profile && profile.user_profile && profile.user_profile.foto) {
        await deleteFile(profile.user_profile.foto);
      }
    }

    return await UserProfileRepo.updateMe(userId, data, fileKey);
  }

  static async findAllAdmin(query: GetUserProfileSchema) {
    return await UserProfileRepo.findAllAdmin(query);
  }

  static async findAllMember(query: GetUserProfileSchema) {
    return await UserProfileRepo.findAllMember(query);
  }
}
