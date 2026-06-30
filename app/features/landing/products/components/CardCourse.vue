<script setup lang="ts">
import { formatRupiah } from "~/utils/index";

defineProps<{
  id: number;
  totalVideo: number;
  title: string;
  harga: number;
  image: string;
}>();
</script>

<template>
  <div class="max-w-120 rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-transform hover:-translate-y-2 mt-3">
    <NuxtImg
      :src="image"
      class="w-full h-65 object-cover"
    />

    <div class="p-6">
      <h3 class="text-lg text-black font-semibold flex-1">
        {{ title }}
      </h3>
      <div class="flex items-center justify-between border-b border-dashed border-gray-300 py-3 mb-4">
        <div class="flex items-center gap-1">
          <UIcon name="i-stash-cam-video-solid" class="text-lg text-gray-500" />
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
