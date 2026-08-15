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
  <div class="mt-3 flex h-full w-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-muted p-4 shadow-sm transition-transform hover:-translate-y-2 sm:p-5" @click="goToDetail(id)">
    <NuxtImg
      :src="image"
      class="mx-auto aspect-3/4 w-full object-cover object-top"
    />

    <div class="mt-2 flex flex-1 flex-col gap-2">
      <h3 class="line-clamp-2 text-wrap text-base font-semibold leading-6 text-default sm:text-lg">
        {{ title }}
      </h3>
      <p class="line-clamp-1 text-sm text-muted">
        {{ penulis }}
      </p>
      <p class="mt-auto font-semibold text-primary">
        {{ formatRupiah(harga) }}
      </p>
    </div>
  </div>
</template>
