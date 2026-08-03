<script setup lang="ts">
import FormatRupiah from "~/components/FormatRupiah.vue";
import { formatRupiah } from "~/utils/number";

useHead({
  title: "Transaksi Saya",
});

const { data, status } = await useFetch<any>("/api/v1/order/my");

function getStatusBadge(orderStatus: string) {
  switch (orderStatus) {
    case "PAID":
      return { label: "Lunas", color: "success" as const, icon: "i-lucide-check-circle" };
    case "WAITING_VERIFICATION":
      return { label: "Menunggu Verifikasi", color: "warning" as const, icon: "i-lucide-clock" };
    default:
      return { label: "Belum Dibayar", color: "neutral" as const, icon: "i-lucide-alert-circle" };
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr)
    return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <UDashboardPanel
    :ui="{
      body: 'bg-gray-50 dark:bg-gray-900',
    }"
  >
    <template #header>
      <UDashboardNavbar title="Transaksi Saya">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="py-2 space-y-4">
        <div v-if="status === 'pending'" class="space-y-4">
          <USkeleton v-for="i in 3" :key="i" class="h-28 w-full rounded-xl" />
        </div>

        <div v-else-if="!data?.data || data.data.length === 0" class="py-16 text-center space-y-4">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">
            <UIcon name="i-lucide-receipt" size="32" />
          </div>
          <div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              Belum Ada Transaksi
            </h3>
            <p class="mt-1 text-sm text-muted">
              Anda belum melakukan transaksi produk manapun.
            </p>
          </div>
          <UButton
            to="/"
            color="primary"
            variant="soft"
            icon="i-lucide-shopping-bag"
          >
            Jelajahi Produk
          </UButton>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="order in data.data"
            :key="order.id"
            class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-5 shadow-sm space-y-3"
          >
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-700/60 pb-3">
              <div class="flex items-center gap-3">
                <span class="font-mono text-xs font-semibold text-gray-500 dark:text-gray-400">#ORD-{{ order.id }}</span>
                <UBadge
                  :icon="getStatusBadge(order.status).icon"
                  :color="getStatusBadge(order.status).color"
                  variant="subtle"
                  size="sm"
                >
                  {{ getStatusBadge(order.status).label }}
                </UBadge>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(order.createdAt) }}</span>
            </div>

            <div class="flex items-center justify-between gap-4">
              <div>
                <UBadge size="sm" variant="subtle" class="mb-1">
                  {{ order.produkType }}
                </UBadge>
                <h4 class="font-semibold text-gray-900 dark:text-white text-base">
                  {{ order.produkJudul }}
                </h4>
              </div>
              <div class="text-right">
                <span class="block text-xs text-gray-500 dark:text-gray-400">Total Harga</span>
                <FormatRupiah :value="order.finalHarga" number-class="text-base font-bold text-primary" />
              </div>
            </div>

            <div v-if="order.diskonPersen > 0" class="text-xs text-green-600 dark:text-green-400">
              Diskon kupon {{ order.diskonPersen }}% ({{ formatRupiah(order.originalHarga - order.finalHarga) }})
            </div>

            <div v-if="order.status === 'PAID'" class="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex justify-end">
              <UButton
                :to="`/dashboard/user/produk/${order.produkType.toLowerCase()}`"
                size="sm"
                color="primary"
                variant="soft"
                icon="i-lucide-arrow-right"
              >
                Akses Produk
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
