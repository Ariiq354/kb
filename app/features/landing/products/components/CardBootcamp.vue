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
  <div class="mt-3 flex h-full w-full max-w-100 flex-col justify-between overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-transform hover:-translate-y-2 hover:shadow-md">
    <NuxtImg
      :src="image"
      class="aspect-video w-full object-cover object-center"
    />

    <div class="flex flex-1 flex-col p-5 pt-2">
      <div class="flex items-start justify-between gap-4">
        <h3 class="line-clamp-2 flex-1 text-lg font-semibold text-black">
          {{ title }}
        </h3>

        <p class="mt-1 shrink-0 text-xs text-muted">
          {{ tanggal }}
        </p>
      </div>

      <p class="mt-3 mb-5 line-clamp-3 text-sm wrap-break-word">
        {{ deskripsi }}
      </p>

      <div class="mt-auto border-t border-gray-300 pt-2">
        <div class="flex items-center justify-between text-sm">
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
