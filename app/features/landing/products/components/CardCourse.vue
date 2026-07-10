<script setup lang="ts">
import { formatRupiah } from "~/utils/number";

defineProps<{
  id: number;
  totalVideo: number;
  title: string;
  harga: number;
  image: string;
}>();
</script>

<template>
  <div class="mt-3 w-full overflow-hidden rounded-xl border border-muted shadow-sm transition-transform hover:-translate-y-2">
    <NuxtImg
      :src="image"
      class="aspect-video w-full object-cover"
    />

    <div class="p-4 sm:p-6">
      <h3 class="flex-1 text-base font-semibold text-default sm:text-lg">
        {{ title }}
      </h3>
      <div class="mb-4 flex items-center justify-between gap-3 border-b border-dashed border-muted py-3">
        <div class="flex items-center gap-1">
          <UIcon name="i-stash-cam-video-solid" class="text-lg text-muted" />
          <p class="text-xs">
            {{ totalVideo }} Video
          </p>
        </div>

        <p class="font-semibold">
          {{ formatRupiah(harga) }}
        </p>
      </div>
      <UButton class="w-full flex justify-center" variant="subtle" :to="`/products/detail/course/${id}`">
        Lihat Detail
      </UButton>
    </div>
  </div>
</template>
