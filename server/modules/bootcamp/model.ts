import { z } from "zod";
import { multipartFile } from "~~/server/utils/schema";

export const bootcampTypeEnum = z.enum(["ONLINE", "OFFLINE", "HYBRID"]);

const baseBootcampSchema = z.object({
  judul: z.string().min(1, "Judul tidak boleh kosong!"),
  harga: z.coerce.number().min(0, "Harga tidak boleh kosong!"),
  status: z.stringbool(),
  deskripsi: z.string().optional(),
  tipe: bootcampTypeEnum,
  tempat: z.string().min(1, "Tempat tidak boleh kosong!"),
  waktu: z.string().min(1, "Waktu tidak boleh kosong!"),
  pembicara: z.string().min(1, "Pembicara tidak boleh kosong!"),
  googleMapLink: z.string().optional(),
  meetingLink: z.string().optional(),
  file: multipartFile({
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }),
});

export const createBootcampSchema = baseBootcampSchema.refine((data) => {
  if ((data.tipe === "ONLINE" || data.tipe === "HYBRID") && !data.meetingLink?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Meeting Link wajib diisi untuk bootcamp ONLINE/HYBRID!",
  path: ["meetingLink"],
}).refine((data) => {
  if ((data.tipe === "OFFLINE" || data.tipe === "HYBRID") && !data.googleMapLink?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Google Map Link wajib diisi untuk bootcamp OFFLINE/HYBRID!",
  path: ["googleMapLink"],
});

export type CreateBootcampSchema = z.infer<typeof createBootcampSchema>;

export const updateBootcampSchema = baseBootcampSchema.partial().refine((data) => {
  if (data.tipe && (data.tipe === "ONLINE" || data.tipe === "HYBRID") && !data.meetingLink?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Meeting Link wajib diisi untuk bootcamp ONLINE/HYBRID!",
  path: ["meetingLink"],
}).refine((data) => {
  if (data.tipe && (data.tipe === "OFFLINE" || data.tipe === "HYBRID") && !data.googleMapLink?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Google Map Link wajib diisi untuk bootcamp OFFLINE/HYBRID!",
  path: ["googleMapLink"],
});

export type UpdateBootcampSchema = z.infer<typeof updateBootcampSchema>;
