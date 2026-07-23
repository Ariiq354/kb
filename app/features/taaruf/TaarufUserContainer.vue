<script setup lang="ts">
import type { TaarufProcess } from "./types";
import { openModal } from "~/composables/modal";
import { useToastError, useToastSuccess } from "~/composables/toast";
import TaarufCancelModal from "./components/TaarufCancelModal.vue";
import TaarufHistoryModal from "./components/TaarufHistoryModal.vue";
import TaarufUserCard from "./components/TaarufUserCard.vue";

// 1. Fetch user's ta'aruf processes
const { data: processes, refresh, pending } = await useFetch<TaarufProcess[]>("/api/v1/taaruf");

// 2. Cancellation action
function cancelTaaruf(id: number, partnerName: string) {
  openModal(TaarufCancelModal, {
    partnerName,
    onConfirm: async () => {
      try {
        await $fetch(`/api/v1/taaruf/${id}/cancel`, {
          method: "POST",
        });
        useToastSuccess("Ta'aruf Dibatalkan", "Proses ta'aruf berhasil dibatalkan.");
        await refresh();
      }
      catch (err: unknown) {
        const errorDetails = err as { data?: { message?: string } };
        useToastError("Gagal Membatalkan", errorDetails.data?.message || "Terjadi kesalahan.");
        throw err;
      }
    },
  });
}

// 3. Log History Modal Action
function viewHistory(id: number) {
  openModal(TaarufHistoryModal, { prosesId: id });
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header banner -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xs">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="space-y-1 text-center sm:text-left">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
            <UIcon name="i-lucide-heart" class="text-primary size-5.5" />
            Pantau Progress Ta'aruf Anda
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Anda dapat memantau hingga 3 proses ta'aruf aktif yang sedang berlangsung.
          </p>
        </div>
        <div class="bg-primary-50 dark:bg-primary-950/20 px-4 py-2 rounded-xl border border-primary-100 dark:border-primary-900/50 text-xs font-bold text-primary-700 dark:text-primary-300">
          Proses Aktif: {{ processes?.filter(p => !['REJECTED', 'CANCELLED', 'MARRIED'].includes(p.status)).length || 0 }} / 3
        </div>
      </div>
    </div>

    <!-- Skeletons while loading -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-4 shadow-xs">
        <div class="flex items-center gap-4">
          <USkeleton class="size-14 rounded-xl" />
          <div class="space-y-2 flex-1">
            <USkeleton class="h-5 w-2/3" />
            <USkeleton class="h-4 w-1/2" />
          </div>
        </div>
        <USkeleton class="h-6 w-1/3" />
        <USkeleton class="h-10 w-full rounded-lg" />
      </div>
    </div>

    <div v-else>
      <!-- Empty State -->
      <div
        v-if="!processes || processes.length === 0"
        class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-4"
      >
        <div class="bg-primary-50 dark:bg-primary-950/20 p-4 flex items-center justify-center rounded-full text-primary">
          <UIcon name="i-lucide-heart-handshake" class="size-10" />
        </div>
        <div class="space-y-1">
          <h4 class="font-bold text-gray-900 dark:text-white text-lg">
            Belum Ada Proses Ta'aruf
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Silakan lengkapi profil Anda terlebih dahulu, lalu masuk ke menu Cari Pasangan untuk mengajukan ta'aruf kepada calon pasangan.
          </p>
        </div>
        <UButton to="/dashboard/user/cari-pasangan" size="sm" color="primary">
          Cari Calon Pasangan
        </UButton>
      </div>

      <!-- Processes Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaarufUserCard
          v-for="p in processes"
          :key="p.id"
          :proses="p"
          @riwayat="viewHistory"
          @batal="cancelTaaruf"
        />
      </div>
    </div>
  </div>
</template>
