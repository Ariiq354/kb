<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { PageSearch } from "~/utils/types";
import DataTable from "~/components/Custom/DataTable.vue";
import InputSearch from "~/components/Custom/InputSearch.vue";
import { useToastError, useToastSuccess } from "~/composables/toast";
import { formatRupiah } from "~/utils/number";

useHead({
  title: "Kelola Order",
});

const query = ref<PageSearch>({ page: 1 });
const { data, status, refresh } = await useFetch<any>("/api/v1/order", {
  query,
});

const updatingId = ref<number | null>(null);

async function verifyPayment(orderId: number) {
  updatingId.value = orderId;
  try {
    await $fetch(`/api/v1/order/${orderId}`, {
      method: "PATCH",
      body: { status: "PAID" },
    });
    useToastSuccess("Pembayaran Berhasil Diverifikasi");
    refresh();
  }
  catch (error: any) {
    useToastError("Gagal Mengubah Status", error?.data?.message || "Terjadi kesalahan.");
  }
  finally {
    updatingId.value = null;
  }
}

const columns: TableColumn<any>[] = [
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
        return "Lunas";
      if (s === "WAITING_VERIFICATION")
        return "Menunggu Verifikasi";
      return "Belum Bayar";
    },
  },
];

function getDropdownItems(row: any) {
  if (row.status === "PAID")
    return [];
  return [
    {
      label: "Verifikasi Pembayaran (Lunas)",
      icon: "i-lucide-check-circle",
      onSelect: () => verifyPayment(row.id),
    },
  ];
}
</script>

<template>
  <UDashboardPanel
    :ui="{
      body: 'bg-gray-50 dark:bg-gray-900',
    }"
  >
    <template #header>
      <UDashboardNavbar title="Kelola Order">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <UCard>
        <div class="mb-4 flex gap-2 md:mb-6 md:gap-4">
          <InputSearch
            :model-value="query.search"
            @update:model-value="query.search = $event; query.page = 1"
          />
        </div>

        <DataTable
          v-model:page="query.page"
          :data="data?.data ?? []"
          :columns="columns"
          :total="data?.total ?? 0"
          :loading="status === 'pending'"
          enumerate
          pagination
          :dropdown-items="getDropdownItems"
        />
      </UCard>
    </template>
  </UDashboardPanel>
</template>
