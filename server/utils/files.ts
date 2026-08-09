import type { UploadDir } from "~~/server/modules/upload/config";
import path from "node:path";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UPLOAD_CATEGORIES } from "~~/server/modules/upload/config";
import { UploadRepo } from "~~/server/modules/upload/repo";
import { env } from "~~/shared/env";

const DIR_REGEX = /\/+$/;

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ID,
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
});

export async function createPresignedUpload(input: {
  dir: string;
  filename: string;
  filesize: number;
  filetype: string;
}) {
  const category = UPLOAD_CATEGORIES[input.dir as UploadDir];

  if (!category) {
    throw createError({
      statusCode: 400,
      statusMessage: "Direktori upload tidak dikenali",
    });
  }

  if (input.filesize > category.maxSize) {
    throw createError({
      statusCode: 400,
      statusMessage: `Ukuran file melebihi batas maksimal ${category.maxSize} bytes`,
    });
  }

  if (!category.fileTypes.includes(input.filetype)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Tipe file tidak diizinkan untuk kategori ini",
    });
  }

  const ext = input.filename.includes(".")
    ? input.filename.substring(input.filename.lastIndexOf("."))
    : "";

  const storedName = `${crypto.randomUUID()}${ext}`;
  const key = `${input.dir.replace(DIR_REGEX, "")}/${storedName}`;

  await UploadRepo.insertPending({
    key,
    dir: input.dir,
    filename: input.filename,
    filetype: input.filetype,
    filesize: input.filesize,
  });

  const url = await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET,
      Key: key,
      ContentType: input.filetype,
      ContentLength: input.filesize,
    }),
    { expiresIn: 3600 },
  );

  return {
    key,
    url,
  };
}

export async function deleteFile(
  key: string,
) {
  await S3.send(
    new DeleteObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET,
      Key: key,
    }),
  );
}

export function getFileExtension(filename: string): string {
  return path.extname(filename).slice(1);
}
