import type { TableColumn } from "@nuxt/ui";
import { resolveComponent } from "vue";
import { formatRupiah } from "~/utils/number";

const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");

export interface OrderRow {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  produkId: number;
  produkJudul: string;
  produkType: string;
  originalHarga: number;
  diskonPersen: number;
  finalHarga: number;
  status: "PENDING_PAYMENT" | "WAITING_VERIFICATION" | "PAID" | string;
  createdAt: string;
}

export function getColumns(onVerify: (row: OrderRow) => void): TableColumn<OrderRow>[] {
  return [
    {
      accessorKey: "id",
      header: "ID Order",
      cell: ({ row }) => `#ORD-${row.original.id}`,
    },
    {
      accessorKey: "userName",
      header: "Pembeli",
      cell: ({ row }) => `${row.original.userName} (${row.original.userEmail})`,
    },
    {
      accessorKey: "produkJudul",
      header: "Produk",
      cell: ({ row }) => `${row.original.produkJudul} [${row.original.produkType}]`,
    },
    {
      accessorKey: "finalHarga",
      header: "Harga Final",
      cell: ({ row }) => formatRupiah(row.original.finalHarga),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        if (s === "PAID")
          return h(UBadge, { color: "success", variant: "subtle" }, () => "Lunas");
        if (s === "WAITING_VERIFICATION")
          return h(UBadge, { color: "warning", variant: "subtle" }, () => "Menunggu Verifikasi");
        return h(UBadge, { color: "neutral", variant: "subtle" }, () => "Belum Bayar");
      },
    },
    {
      accessorKey: "verifikasi",
      header: "Verifikasi",
      cell: ({ row }) => {
        if (row.original.status === "PAID") {
          return "-";
        }
        return h(
          UButton,
          {
            color: "success",
            variant: "solid",
            size: "xs",
            icon: "i-lucide-check-circle",
            class: "font-semibold shadow-xs bg-primary text-white hover:bg-primary-600 cursor-pointer px-5 py-1 rounded-md",
            onClick: () => onVerify(row.original),
          },
          () => "Verifikasi",
        );
      },
    },
  ];
}
