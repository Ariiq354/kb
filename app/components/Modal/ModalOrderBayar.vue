<script setup lang="ts">
import { formatRupiah } from "~/utils/number";

const props = defineProps<{
  orderId: number;
  produkJudul: string;
  finalHarga: number;
}>();

const emit = defineEmits(["close"]);

void props;
</script>

<template>
  <UModal
    title="Lakukan Pembayaran"
    :close="{ onClick: () => emit('close', false) }"
    :ui="{ body: 'sm:max-w-lg' }"
  >
    <template #body>
      <div class="space-y-4 py-2">
        <div class="text-center">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-3">
            <UIcon name="i-lucide-qr-code" size="36" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            Pembayaran Pesanan
          </h3>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Selesaikan pembayaran untuk <span class="font-semibold text-gray-900 dark:text-white">{{ produkJudul }}</span> sebesar
            <span class="font-bold text-primary">{{ formatRupiah(finalHarga) }}</span>.
          </p>
        </div>

        <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 text-xs space-y-2 text-gray-600 dark:text-gray-300">
          <div class="flex justify-between">
            <span>Nomor Pesanan</span>
            <span class="font-mono font-semibold text-gray-900 dark:text-white">#ORD-{{ orderId }}</span>
          </div>
          <div class="flex justify-between">
            <span>Total Tagihan</span>
            <span class="font-bold text-primary">{{ formatRupiah(finalHarga) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Status Pembayaran</span>
            <UBadge color="neutral" variant="subtle" size="sm">
              Belum Dibayar
            </UBadge>
          </div>
        </div>

        <div class="space-y-3 pt-1">
          <div class="text-center text-xs text-gray-500">
            Silakan pindai QRIS di bawah ini atau transfer ke rekening BCA:
          </div>
          <div class="flex justify-center p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white">
            <NuxtImg
              src="/images/contohqris.webp"
              alt="QRIS Pembayaran"
              class="h-52 object-contain"
            />
          </div>
          <div class="rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 p-3 text-xs text-blue-900 dark:text-blue-200">
            <div class="font-semibold mb-1">
              Transfer Bank BCA
            </div>
            <div>No. Rekening: <span class="font-mono font-bold select-all">1234 5678 90</span></div>
            <div>Atas Nama: <span class="font-medium">Keluarga Bahagia</span></div>
          </div>
          <p class="text-center text-xs text-gray-500">
            Setelah membayar, status akan diverifikasi oleh admin.
          </p>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-end">
        <UButton
          color="neutral"
          variant="ghost"
          @click="emit('close')"
        >
          Tutup
        </UButton>
      </div>
    </template>
  </UModal>
</template>
