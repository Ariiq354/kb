export type UploadDir = "course" | "ebook";

interface UploadTicket {
  uploadUrl: string;
  key: string;
}

async function requestUploadTicket(dir: UploadDir, file: File): Promise<UploadTicket> {
  return await $fetch("/api/v1/upload/presign", {
    method: "POST",
    body: {
      dir,
      filename: file.name,
      contentType: file.type,
      size: file.size,
    },
  });
}

export async function uploadFileToR2(file: File, dir: UploadDir): Promise<string> {
  const { uploadUrl, key } = await requestUploadTicket(dir, file);

  await $fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  return key;
}
