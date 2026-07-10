<script setup lang="ts">
import { formatRupiah } from "~/utils/number";

defineProps<{
  id: number;
  title: string;
  penulis: string;
  harga: number;
  image: string;
}>();

function goToDetail(id: number) {
  navigateTo(`/products/detail/ebook/${id}`);
}
</script>

<template>
  <div class="mt-3 w-full cursor-pointer overflow-hidden rounded-xl border border-muted p-4 shadow-sm transition-transform hover:-translate-y-2 sm:p-5" @click="goToDetail(id)">
    <NuxtImg
      :src="image"
      class="mx-auto aspect-[3/4] w-full object-cover"
    />

    <div class="flex flex-col gap-2 mt-2">
      <h3 class="line-clamp-2 flex-1 text-wrap text-base leading-6 font-semibold text-default sm:text-lg">
        {{ title }}
      </h3>
      <p class="line-clamp-1 text-sm text-muted">
        {{ penulis }}
      </p>
      <p class="font-semibold text-primary">
        {{ formatRupiah(harga) }}
      </p>
    </div>
  </div>
</template>
