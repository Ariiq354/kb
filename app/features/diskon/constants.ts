import type { TableColumn } from "@nuxt/ui";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import z from "zod";
import { formatDateIndo } from "~/utils";

export const columns: TableColumn<any>[] = [
  { accessorKey: "kode", header: "Kode" },
  {
    accessorKey: "persen",
    header: "Persen",
    cell: ({ row }) => `${row.original.persen}%`,
  },
  {
    accessorKey: "batasWaktu",
    header: "Batas Waktu",
    cell: ({ row }) => formatDateIndo(row.original.batasWaktu),
  },
  {
    accessorKey: "jumlahDipakai",
    header: "Jumlah Dipakai",
    cell: ({ row }) =>
      new Intl.NumberFormat("id-ID").format(row.original.jumlahDipakai),
  },
];

export const schema = z.object({
  id: z.number().optional(),
  kode: z.string().min(1, "Kode tidak boleh kosong!"),
  persen: z.number().min(1, "Persen tidak boleh kosong!"),
  batasWaktu: z.instanceof(CalendarDate),
  batasPemakai: z.number().min(1, "Batas pemakai tidak boleh kosong!"),
  status: z.boolean(),
});

export const initFormData: Schema = {
  id: undefined,
  kode: "",
  persen: 0,
  batasWaktu: today(getLocalTimeZone()),
  batasPemakai: 0,
  status: false,
};

export type Schema = z.infer<typeof schema>;
