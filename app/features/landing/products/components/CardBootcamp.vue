<script setup lang="ts">
import { formatRupiah } from "~/utils/number";

defineProps<{
  id: number;
  title: string;
  deskripsi: string;
  harga: number;
  tempat: string;
  tanggal: string;
  image: string;
}>();
</script>

<template>
  <div class="max-w-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-transform hover:shadow-md hover:-translate-y-2 mt-3">
    <NuxtImg
      :src="image"
      class="w-full"
    />

    <div class="p-5 pt-2">
      <div class="flex items-start justify-between gap-10">
        <h3 class="text-lg text-black font-semibold flex-1">
          {{ title }}
        </h3>

        <p class="text-xs mt-1">
          {{ tanggal }}
        </p>
      </div>

      <p class="mt-3 mb-5 text-sm wrap-break-word line-clamp-2">
        {{ deskripsi }}
      </p>

      <div class="border-t border-gray-300 pt-2">
        <div class="text-sm flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">
              Harga
            </p>
            <p class="font-semibold">
              {{ formatRupiah(harga) }}
            </p>
          </div>

          <UButton :to="`/products/detail/bootcamp/${id}`">
            Daftar
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
