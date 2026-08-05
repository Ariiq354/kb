import type { Buffer } from "node:buffer";
import path from "node:path";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~~/shared/env";

const DIR_REGEX = /\/+$/;
const TMP_DIR = "tmp";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ID,
  },
});

export async function uploadFile(
  dir: string,
  filename: string,
  data: Buffer,
  contentType: string,
) {
  const ext = filename.includes(".")
    ? filename.substring(filename.lastIndexOf("."))
    : "";

  const storedName = `${crypto.randomUUID()}${ext}`;
  const key = `${dir.replace(DIR_REGEX, "")}/${storedName}`;

  await S3.send(
    new PutObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET,
      Key: key,
      Body: data,
      ContentType: contentType,
    }),
  );

  return {
    key,
    storedName,
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

function getExtensionFromFilename(filename: string): string {
  return filename.includes(".")
    ? filename.substring(filename.lastIndexOf("."))
    : "";
}

export async function createUploadTicket(
  dir: string,
  filename: string,
  contentType: string,
) {
  const storedName = `${crypto.randomUUID()}${getExtensionFromFilename(filename)}`;
  const key = `${TMP_DIR}/${crypto.randomUUID()}/${storedName}`;

  const uploadUrl = await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 15 * 60 },
  );

  return {
    uploadUrl,
    key,
  };
}

export async function commitUploadedFile(
  uploadKey: string,
  dir: string,
): Promise<string> {
  if (!uploadKey.startsWith(`${TMP_DIR}/`)) {
    throw new Error("Invalid upload key");
  }

  const filename = uploadKey.split("/").pop() ?? "";
  const finalKey = `${dir.replace(DIR_REGEX, "")}/${crypto.randomUUID()}${getExtensionFromFilename(filename)}`;

  await S3.send(
    new CopyObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET,
      CopySource: `${env.CLOUDFLARE_BUCKET}/${uploadKey}`,
      Key: finalKey,
    }),
  );

  await S3.send(
    new DeleteObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET,
      Key: uploadKey,
    }),
  );

  return finalKey;
}

export async function objectExists(key: string): Promise<boolean> {
  try {
    await S3.send(
      new HeadObjectCommand({
        Bucket: env.CLOUDFLARE_BUCKET,
        Key: key,
      }),
    );
    return true;
  }
  catch {
    return false;
  }
}
