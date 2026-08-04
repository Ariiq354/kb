import type { TableColumn } from "@nuxt/ui";
import { resolveComponent } from "vue";
import { formatDateTimeIndo } from "~/utils";
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

export function getUserColumns(
  onBayar: (row: OrderRow) => void,
  onLihat: (row: OrderRow) => void,
): TableColumn<OrderRow>[] {
  function statusBadge(status: string) {
    if (status === "PAID")
      return h(UBadge, { color: "success", variant: "subtle" }, () => "Lunas");
    if (status === "WAITING_VERIFICATION")
      return h(UBadge, { color: "warning", variant: "subtle" }, () => "Menunggu Verifikasi");
    return h(UBadge, { color: "neutral", variant: "subtle" }, () => "Belum Dibayar");
  };

  const actionButton = (row: OrderRow) => {
    if (row.status === "PAID") {
      return h(
        UButton,
        {
          size: "xs",
          color: "primary",
          variant: "soft",
          icon: "i-lucide-arrow-right",
          to: `/dashboard/user/produk/${row.produkType.toLowerCase()}`,
        },
        () => "Akses Produk",
      );
    }
    if (row.status === "PENDING_PAYMENT") {
      return h(
        UButton,
        {
          size: "xs",
          color: "primary",
          variant: "solid",
          icon: "i-lucide-qr-code",
          onClick: () => onBayar(row),
        },
        () => "Bayar",
      );
    }
    return h(
      UButton,
      {
        size: "xs",
        color: "primary",
        variant: "soft",
        icon: "i-lucide-clock",
        onClick: () => onLihat(row),
      },
      () => "Lihat",
    );
  };

  return [
    {
      accessorKey: "id",
      header: "ID Order",
      cell: ({ row }) => `#ORD-${row.original.id}`,
    },
    {
      accessorKey: "produkJudul",
      header: "Produk",
      cell: ({ row }) => {
        return h("div", { class: "flex flex-col gap-1" }, [
          h("span", { class: "font-medium text-gray-900 dark:text-white" }, row.original.produkJudul),
          h(
            UBadge,
            { size: "xs", variant: "subtle", class: "w-fit" },
            () => row.original.produkType,
          ),
        ]);
      },
    },
    {
      accessorKey: "finalHarga",
      header: "Harga",
      cell: ({ row }) => {
        if (row.original.diskonPersen > 0) {
          return h("div", { class: "flex flex-col gap-0.5" }, [
            h("span", { class: "font-semibold text-gray-900 dark:text-white" }, formatRupiah(row.original.finalHarga)),
            h("span", { class: "text-xs text-green-600 dark:text-green-400" }, `Diskon ${row.original.diskonPersen}%`),
            h("span", { class: "text-xs text-gray-400 line-through" }, formatRupiah(row.original.originalHarga)),
          ]);
        }
        return h("span", { class: "font-semibold text-gray-900 dark:text-white" }, formatRupiah(row.original.finalHarga));
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => statusBadge(row.original.status),
    },
    {
      accessorKey: "createdAt",
      header: "Tanggal",
      cell: ({ row }) => formatDateTimeIndo(row.original.createdAt),
    },
    {
      accessorKey: "aksi",
      header: "Aksi",
      cell: ({ row }) => actionButton(row.original),
    },
  ];
}
