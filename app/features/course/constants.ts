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
    accessorKey: "namaPublisher",
    header: "Publisher",
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
  namaPublisher: z.string().optional(),
  foto: z.string().optional(),
  file: z.custom<File | undefined>().optional(),
});

export const schema = baseSchema.refine((data) => {
  // If creating (no id), cover file is required
  if (!data.id && !data.file) {
    return false;
  }
  return true;
}, {
  message: "Cover course wajib diunggah!",
  path: ["file"],
});

export const initFormData: Schema = {
  id: undefined,
  judul: "",
  harga: 0,
  status: true,
  deskripsi: "",
  namaPublisher: "",
  foto: undefined,
  file: undefined,
};

export type Schema = z.infer<typeof schema>;
