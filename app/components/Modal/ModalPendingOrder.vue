<script setup lang="ts">
import { computed } from "vue";
import { navigateTo } from "#imports";
import { formatRupiah } from "~/utils/number";

const props = defineProps<{
  produk: {
    id: number;
    type: "BOOTCAMP" | "EBOOK" | "COURSE" | string;
    judul: string;
  };
  order: {
    id: number;
    status: string;
    finalHarga: number;
  };
}>();

const emit = defineEmits(["close"]);

const productTypePath = computed(() => {
  switch (props.produk.type) {
    case "EBOOK":
      return "ebook";
    case "COURSE":
      return "course";
    default:
      return "bootcamp";
  }
});

function goToTransactions() {
  emit("close");
  navigateTo("/dashboard/user/transaksi");
}

function goToDashboard() {
  emit("close");
  navigateTo(`/dashboard/user/produk/${productTypePath.value}`);
}
</script>

<template>
  <UModal
    title="Status Pembayaran Diproses"
    :close="{ onClick: () => emit('close', false) }"
    :ui="{ body: 'sm:max-w-lg' }"
  >
    <template #body>
      <div class="space-y-4 py-2">
        <div class="text-center">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-3">
            <UIcon name="i-lucide-clock" size="36" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            Pesanan Sedang Menunggu Verifikasi
          </h3>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Anda sudah melakukan checkout untuk <span class="font-semibold text-gray-900 dark:text-white">{{ produk.judul }}</span>. Pembayaran Anda saat ini sedang dalam proses verifikasi admin.
          </p>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 text-xs space-y-2 text-gray-600 dark:text-gray-300">
          <div class="flex justify-between">
            <span>Nomor Pesanan</span>
            <span class="font-mono font-semibold text-gray-900 dark:text-white">#ORD-{{ order.id }}</span>
          </div>
          <div class="flex justify-between">
            <span>Total Tagihan</span>
            <span class="font-bold text-primary">{{ formatRupiah(order.finalHarga) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Status Pembayaran</span>
            <UBadge color="warning" variant="subtle" size="sm">
              Menunggu Verifikasi
            </UBadge>
          </div>
        </div>

        <!-- QRIS Payment Reminder -->
        <div class="space-y-3 pt-2">
          <div class="text-center text-xs text-gray-500">
            Jika belum membayar, silakan pindaikan QRIS atau transfer ke rekening BCA berikut:
          </div>
          <div class="flex justify-center p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white">
            <NuxtImg
              src="/images/contohqris.png"
              alt="QRIS Pembayaran"
              class="h-44 object-contain"
            />
          </div>
          <div class="rounded-lg bg-blue-50 dark:bg-blue-950/40 p-3 text-xs text-blue-900 dark:text-blue-200">
            <strong>BCA: 1234 5678 90</strong> a.n. Keluarga Bahagia
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-3">
        <UButton
          color="neutral"
          variant="subtle"
          icon="i-lucide-receipt"
          @click="goToTransactions"
        >
          Lihat Transaksi Saya
        </UButton>
        <UButton
          color="primary"
          icon="i-lucide-layout-dashboard"
          @click="goToDashboard"
        >
          Ke Dashboard Produk
        </UButton>
      </div>
    </template>
  </UModal>
</template>
