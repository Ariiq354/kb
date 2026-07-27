<script setup lang="ts">
import { formatRupiah } from "~/utils/number";

defineProps<{
  id: number;
  title: string;
  harga: number;
  image: string;
  totalVideo?: number;
}>();

const config = useRuntimeConfig();
</script>

<template>
  <div class="group flex flex-col overflow-hidden rounded-xl border border-muted bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
    <div class="relative overflow-hidden aspect-video w-full bg-gray-100 dark:bg-gray-700">
      <NuxtImg
        :src="image ? (image.startsWith('http') ? image : `${config.public.imageUrl}/${image}`) : undefined"
        :alt="title"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <div class="flex flex-1 flex-col p-5">
      <h3 class="line-clamp-2 text-base font-semibold text-default mb-3 min-h-12">
        {{ title }}
      </h3>

      <div v-if="totalVideo !== undefined" class="flex items-center gap-2 mb-4 text-xs text-muted">
        <div class="inline-flex items-center gap-1 rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-1">
          <UIcon name="i-lucide-video" class="text-sm text-primary" />
          <span>{{ totalVideo }} Video</span>
        </div>
      </div>

      <div class="mt-auto border-t border-muted pt-3 flex items-center justify-between gap-3">
        <div>
          <span class="block text-[10px] uppercase tracking-wider text-muted">Harga</span>
          <span class="text-sm font-bold text-primary">{{ formatRupiah(harga) }}</span>
        </div>

        <UButton
          :to="`/products/detail/course/${id}`"
          size="sm"
          variant="subtle"
          color="primary"
        >
          Lihat Detail
        </UButton>
      </div>
    </div>
  </div>
</template>
