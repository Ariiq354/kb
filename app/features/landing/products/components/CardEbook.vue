<script setup lang="ts">
import { formatRupiah } from "~/utils/index";

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
  <div class="w-80 rounded-xl overflow-hidden border border-gray-200 shadow-sm p-5 cursor-pointer transition-transform hover:-translate-y-2 mt-3" @click="goToDetail(id)">
    <NuxtImg
      :src="image"
      class="object-cover"
    />

    <div class="flex flex-col gap-2 mt-2">
      <h3 class="text-lg text-black font-semibold flex-1 text-wrap leading-6 line-clamp-2">
        {{ title }}
      </h3>
      <p class="text-sm text-gray-400 line-clamp-1">
        {{ penulis }}
      </p>
      <p class="font-semibold text-primary">
        {{ formatRupiah(harga) }}
      </p>
    </div>
  </div>
</template>
