<script setup lang="ts">
import type { TaarufProsesAdmin } from "../types";
import { formatDateIndo } from "~/utils";
import { getStatusColor, getStatusLabel } from "../utils";

defineProps<{
  proses: TaarufProsesAdmin;
}>();

defineEmits<{
  riwayat: [prosesId: number];
  update: [proses: TaarufProsesAdmin];
}>();
</script>

<template>
  <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xs p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-300">
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">ID Proses: {{ proses.id }}</span>
        <UBadge :color="getStatusColor(proses.status)" variant="subtle" size="sm">
          {{ getStatusLabel(proses.status) }}
        </UBadge>
      </div>

      <div class="bg-gray-50 dark:bg-gray-855 p-4 rounded-xl border border-gray-100 dark:border-gray-850 space-y-3">
        <div class="flex items-center justify-between text-sm">
          <div class="min-w-0 flex-1">
            <span class="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Pemohon (Requester)</span>
            <span class="font-semibold text-gray-900 dark:text-white truncate block">{{ proses.requester.name }}</span>
            <span class="text-xs text-primary font-bold">{{ proses.requester.kodeUser }}</span>
          </div>
          <UIcon name="i-lucide-arrow-right" class="size-5 text-gray-300 mx-3 shrink-0" />
          <div class="min-w-0 flex-1 text-right">
            <span class="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Tujuan (Target)</span>
            <span class="font-semibold text-gray-900 dark:text-white truncate block">{{ proses.target.name }}</span>
            <span class="text-xs text-primary font-bold">{{ proses.target.kodeUser }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="text-xs text-gray-400 dark:text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
      <span>Dibuat: {{ formatDateIndo(proses.createdAt) }}</span>
      <span v-if="proses.startedAt">Dimulai: {{ formatDateIndo(proses.startedAt) }}</span>
      <span v-if="proses.finishedAt">Selesai: {{ formatDateIndo(proses.finishedAt) }}</span>
    </div>

    <!-- Actions -->
    <div class="pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
      <UButton
        variant="subtle"
        color="neutral"
        class="flex-1 justify-center"
        size="xs"
        icon="i-lucide-history"
        @click="$emit('riwayat', proses.id)"
      >
        Riwayat Log
      </UButton>
      <UButton
        variant="solid"
        color="primary"
        class="flex-1 justify-center"
        size="xs"
        icon="i-lucide-pencil-line"
        @click="$emit('update', proses)"
      >
        Update Status
      </UButton>
    </div>
  </div>
</template>
