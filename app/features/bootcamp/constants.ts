import type { TableColumn } from "@nuxt/ui";
import { h } from "vue";
import { z } from "zod";
import { UBadge } from "#components";
import { formatRupiah } from "~/utils/number";

export const columns: TableColumn<any>[] = [
  {
    accessorKey: "judul",
    header: "Judul",
  },
  {
    accessorKey: "tipe",
    header: "Tipe",
    cell: ({ row }) => {
      const tipe = row.original.tipe;
      let color: "info" | "warning" | "success" = "info";
      if (tipe === "OFFLINE") {
        color = "warning";
      }
      else if (tipe === "HYBRID") {
        color = "success";
      }
      return h(UBadge, {
        color,
        variant: "subtle",
        label: tipe,
      });
    },
  },
  {
    accessorKey: "waktu",
    header: "Waktu",
  },
  {
    accessorKey: "tempat",
    header: "Tempat",
  },
  {
    accessorKey: "harga",
    header: "Harga",
    cell: ({ row }) => formatRupiah(row.original.harga),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const active = row.original.status;
      return h(UBadge, {
        color: active ? "success" : "neutral",
        variant: "subtle",
        label: active ? "Aktif" : "Nonaktif",
      });
    },
  },
];

const baseSchema = z.object({
  id: z.number().optional(),
  judul: z.string().min(1, "Judul tidak boleh kosong!"),
  harga: z.number().min(0, "Harga tidak boleh kosong!"),
  status: z.boolean(),
  deskripsi: z.string().optional(),
  tipe: z.enum(["ONLINE", "OFFLINE", "HYBRID"]),
  tempat: z.string().min(1, "Tempat tidak boleh kosong!"),
  waktu: z.string().min(1, "Waktu tidak boleh kosong!"),
  pembicara: z.string().min(1, "Pembicara tidak boleh kosong!"),
  googleMapLink: z.string().optional(),
  meetingLink: z.string().optional(),
  foto: z.string().optional(),
  file: z.custom<File | undefined>().optional(),
});

export const schema = baseSchema.refine((data) => {
  // If creating (no id), file is required
  if (!data.id && !data.file) {
    return false;
  }
  return true;
}, {
  message: "Foto bootcamp wajib diunggah!",
  path: ["file"],
}).refine((data) => {
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

export const initFormData: Schema = {
  id: undefined,
  judul: "",
  harga: 0,
  status: true,
  deskripsi: "",
  tipe: "ONLINE",
  tempat: "",
  waktu: "",
  pembicara: "",
  googleMapLink: "",
  meetingLink: "",
  foto: undefined,
  file: undefined,
};

export type Schema = z.infer<typeof schema>;
