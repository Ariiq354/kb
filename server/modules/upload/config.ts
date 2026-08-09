export const UPLOAD_DIRS = [
  "user-image",
  "bootcamp",
  "course",
  "course-video",
  "ebook",
  "ebook-pdf",
] as const;

export type UploadDir = (typeof UPLOAD_DIRS)[number];

export interface UploadCategory {
  maxSize: number;
  fileTypes: string[];
  requireAdmin: boolean;
}

export const UPLOAD_CATEGORIES: Record<UploadDir, UploadCategory> = {
  "user-image": {
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
    requireAdmin: false,
  },
  "bootcamp": {
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
    requireAdmin: true,
  },
  "course": {
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
    requireAdmin: true,
  },
  "course-video": {
    maxSize: 500 * 1024 * 1024,
    fileTypes: ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
    requireAdmin: true,
  },
  "ebook": {
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
    requireAdmin: true,
  },
  "ebook-pdf": {
    maxSize: 50 * 1024 * 1024,
    fileTypes: ["application/pdf"],
    requireAdmin: true,
  },
};

export const SWEEP_AGE_MS = 60 * 60 * 1000;
