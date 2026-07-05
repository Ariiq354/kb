<script setup lang="ts">
import { format } from "date-fns";
import { id } from "date-fns/locale";

definePageMeta({
  layout: "dashboard",
});
useHead({
  title: "Riwayat Transaksi",
});

const { session } = await useAuthSession();
const userId = computed(() => session.value?.user?.id);

const page = ref(1);

const { data: response, pending } = await useFetch("/api/v1/orders", {
  query: { page: 1, limit: 100 }, // Fetch a large number to filter client side since backend doesn't support userId filter yet
  watch: false,
});

const myOrders = computed(() => {
  if (!response.value?.data)
    return [];
  return response.value.data.filter((item: any) => item.user?.id === userId.value);
});

const columns = [
  {
    key: "id",
    label: "ID Order",
  },
  {
    key: "produk",
    label: "Produk",
  },
  {
    key: "harga",
    label: "Total Harga",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "tanggal",
    label: "Tanggal",
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING_PAYMENT": return "yellow";
    case "WAITING_VERIFICATION": return "blue";
    case "PAID": return "green";
    default: return "gray";
  }
}
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Riwayat Transaksi
      </h1>
    </div>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <UTable :rows="myOrders" :columns="columns" :loading="pending">
        <template #id-data="{ row }">
          <span class="font-mono">#{{ row.orders?.id }}</span>
        </template>

        <template #produk-data="{ row }">
          <div>
            <p class="font-semibold">
              {{ row.produk?.judul }}
            </p>
            <p class="text-xs text-gray-500">
              {{ row.produk?.type }}
            </p>
          </div>
        </template>

        <template #harga-data="{ row }">
          Rp {{ row.orders?.finalHarga?.toLocaleString('id-ID') }}
        </template>

        <template #status-data="{ row }">
          <UBadge :color="getStatusColor(row.orders?.status)" variant="subtle">
            {{ row.orders?.status?.replace('_', ' ') }}
          </UBadge>
        </template>

        <template #tanggal-data="{ row }">
          {{ row.orders?.createdAt ? format(new Date(row.orders.createdAt), 'dd MMM yyyy HH:mm', { locale: id }) : '-' }}
        </template>

        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <span class="italic text-sm text-gray-500">Tidak ada riwayat transaksi.</span>
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
