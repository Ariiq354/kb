import type { UserProfileSchema } from "./model";
import { deleteFile, uploadFile } from "~~/server/utils/files";
import { UserRepo } from "./repo";

export abstract class UserService {
  static async updateUser(user: UserWithId, payload: UserProfileSchema) {
    const { file, ...profileData } = payload;
    let newlyUploadedKey: string | undefined;

    if (file && file.length > 0) {
      const fileData = file[0]!;

      const { key } = await uploadFile(
        "user-image",
        fileData.filename!,
        fileData.data,
        fileData.type!,
      );

      newlyUploadedKey = key;
      profileData.foto = key;
    }

    try {
      const result = await UserRepo.updateUser(user.id, profileData);

      if (user.image && (newlyUploadedKey || !profileData.foto)) {
        await deleteFile(user.image);
      }

      return result;
    }
    catch (error) {
      if (newlyUploadedKey) {
        await deleteFile(newlyUploadedKey);
      }

      throw error;
    }
  }

  static async getUserProfile(userId: number) {
    const result = await UserRepo.getUserProfile(userId);

    if (!result) {
      throw createError({
        statusCode: 404,
        message: "User tidak ditemukan",
        data: {
          code: "USER_MISSING",
        },
      });
    }

    return result;
  };
}
