import type { HashConstructor, HttpRequest } from "@smithy/types";
import type { UploadDir } from "~~/server/modules/upload/config";
import { createHash, createHmac } from "node:crypto";
import path from "node:path";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { formatUrl } from "@aws-sdk/core/util";
import { SignatureV4 } from "@smithy/signature-v4";
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

class NodeSha256 {
  private hash: ReturnType<typeof createHash> | ReturnType<typeof createHmac>;

  constructor(secret?: string | Uint8Array) {
    this.hash = secret
      ? createHmac("sha256", secret)
      : createHash("sha256");
  }

  update(data: string | Uint8Array): void {
    this.hash.update(data);
  }

  async digest(): Promise<Uint8Array> {
    return new Uint8Array(this.hash.digest());
  }
}

const SIGNER = new SignatureV4({
  service: "s3",
  region: "auto",
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ID,
  },
  sha256: NodeSha256 as unknown as HashConstructor,
  uriEscapePath: false,
  applyChecksum: false,
});

async function presignPutUrl(input: {
  key: string;
  contentType: string;
  contentLength: number;
}): Promise<string> {
  const hostname = `${env.CLOUDFLARE_BUCKET}.${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;

  const request: HttpRequest = {
    method: "PUT",
    protocol: "https:",
    hostname,
    path: `/${input.key}`,
    headers: {
      "host": hostname,
      "content-type": input.contentType,
      "content-length": String(input.contentLength),
      "X-Amz-Content-Sha256": "UNSIGNED-PAYLOAD",
    },
    query: {},
  };

  const signed = await SIGNER.presign(request, { expiresIn: 5 * 60 });

  return formatUrl(signed);
}

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

  const url = await presignPutUrl({
    key,
    contentType: input.filetype,
    contentLength: input.filesize,
  });

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
