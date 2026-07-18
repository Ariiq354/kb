<script setup lang="ts">
import type { ProcessDetails } from "../types";
import { formatDateIndo } from "~/utils";
import { getStatusColor, getStatusLabel } from "../utils";

const props = defineProps<{
  prosesId: number;
}>();

const isOpen = defineModel<boolean>("open", { default: true });

const { data: details, pending: isLoading } = await useLazyFetch<ProcessDetails>(
  `/api/v1/taaruf/${props.prosesId}`,
);
</script>

<template>
  <UModal v-model:open="isOpen" title="Riwayat Progress Ta'aruf" class="max-w-xl">
    <template #body>
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="space-y-4 py-4">
        <USkeleton v-for="i in 3" :key="i" class="h-14 w-full rounded-lg" />
      </div>

      <!-- Loaded Details -->
      <div v-else-if="details" class="space-y-6">
        <!-- Partner Names Card -->
        <div class="bg-gray-50 dark:bg-gray-850 p-4 rounded-xl border border-gray-100 dark:border-gray-850 text-sm space-y-1">
          <p class="text-gray-500 dark:text-gray-400">
            Calon Pasangan: <span class="font-bold text-gray-900 dark:text-white">{{ details.requesterName }} & {{ details.targetName }}</span>
          </p>
          <p class="text-gray-500 dark:text-gray-400">
            Mulai Ta'aruf: <span class="font-medium text-gray-800 dark:text-gray-200">{{ formatDateIndo(details.createdAt) }}</span>
          </p>
        </div>

        <!-- Timeline Logs -->
        <div class="relative pl-6 border-l-2 border-primary-200 dark:border-primary-900/50 space-y-6 ml-2.5">
          <template v-if="details.logs && details.logs.length > 0">
            <div
              v-for="log in details.logs"
              :key="log.id"
              class="relative"
            >
              <!-- Indicator Dot -->
              <span class="absolute -left-7.75 top-1.5 size-3.5 rounded-full border-2 border-white dark:border-gray-900 bg-primary shadow-xs" />

              <div class="space-y-1">
                <div class="flex items-center justify-between gap-2">
                  <UBadge :color="getStatusColor(log.status)" variant="subtle" size="xs">
                    {{ getStatusLabel(log.status) }}
                  </UBadge>
                  <span class="text-xs text-gray-400 dark:text-gray-500 font-medium">
                    {{ formatDateIndo(log.createdAt) }}
                  </span>
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-300 pl-0.5">
                  {{ log.keterangan || '-' }}
                </p>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="relative">
              <!-- Indicator Dot -->
              <span class="absolute -left-7.75 top-1.5 size-3.5 rounded-full border-2 border-white dark:border-gray-900 bg-primary shadow-xs" />
              <div class="space-y-1">
                <div class="flex items-center justify-between gap-2">
                  <UBadge :color="getStatusColor(details.status)" variant="subtle" size="xs">
                    {{ getStatusLabel(details.status) }}
                  </UBadge>
                  <span class="text-xs text-gray-400 dark:text-gray-500 font-medium">
                    {{ formatDateIndo(details.createdAt) }}
                  </span>
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-300 pl-0.5">
                  Proses ta'aruf diajukan.
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end w-full">
        <UButton color="neutral" variant="subtle" @click="() => { isOpen = false; }">
          Tutup
        </UButton>
      </div>
    </template>
  </UModal>
</template>
