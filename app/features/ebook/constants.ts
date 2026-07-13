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
  foto: z.string().optional(),
  file: z.custom<File | undefined>().optional(),
  pdfUrl: z.string().optional(),
  pdfFile: z.custom<File | undefined>().optional(),
});

export const schema = baseSchema.refine((data) => {
  // If creating (no id), cover file is required
  if (!data.id && !data.file) {
    return false;
  }
  return true;
}, {
  message: "Cover ebook wajib diunggah!",
  path: ["file"],
}).refine((data) => {
  // If creating (no id), pdf file is required
  if (!data.id && !data.pdfFile) {
    return false;
  }
  return true;
}, {
  message: "File PDF ebook wajib diunggah!",
  path: ["pdfFile"],
});

export const initFormData: Schema = {
  id: undefined,
  judul: "",
  harga: 0,
  status: true,
  deskripsi: "",
  foto: undefined,
  file: undefined,
  pdfUrl: undefined,
  pdfFile: undefined,
};

export type Schema = z.infer<typeof schema>;
