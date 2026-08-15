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
  <div class="mt-3 flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border border-muted shadow-sm transition-transform hover:-translate-y-2">
    <NuxtImg
      :src="image"
      class="aspect-video w-full object-cover object-center"
    />

    <div class="flex flex-1 flex-col p-4 sm:p-6">
      <h3 class="line-clamp-2 flex-1 text-base font-semibold text-default sm:text-lg">
        {{ title }}
      </h3>
      <div class="mt-auto">
        <div class="my-4 flex items-center justify-between gap-3 border-b border-dashed border-muted pb-3">
          <div class="flex items-center gap-1">
            <UIcon name="i-lucide-video" class="text-lg text-muted" />
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
  </div>
</template>
