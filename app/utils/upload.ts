import { $fetch } from "ofetch";

interface PresignResponse {
  key: string;
  url: string;
}

export async function presignAndUploadFile(dir: string, file: File): Promise<string> {
  const { key, url } = await $fetch<PresignResponse>("/api/v1/upload/presign", {
    method: "POST",
    body: {
      dir,
      filename: file.name,
      filesize: file.size,
      filetype: file.type,
    },
  });

  await $fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  return key;
}
