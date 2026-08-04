<script setup lang="ts">
import { formatRupiah } from "~/utils/number";

defineProps<{
  id: number;
  title: string;
  harga: number;
  image: string;
  penulis?: string;
  orderStatus?: string;
}>();

const config = useRuntimeConfig();
</script>

<template>
  <div class="group flex flex-col overflow-hidden rounded-xl border border-muted bg-white dark:bg-gray-800 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
    <div class="relative overflow-hidden aspect-3/4 w-full rounded-lg bg-gray-100 dark:bg-gray-700 mb-3">
      <div v-if="orderStatus && orderStatus !== 'PAID'" class="absolute top-2.5 right-2.5 z-10">
        <UBadge color="warning" variant="solid" size="sm" icon="i-lucide-clock">
          Menunggu Verifikasi
        </UBadge>
      </div>
      <NuxtImg
        :src="image ? (image.startsWith('http') ? image : `${config.public.imageUrl}/${image}`) : undefined"
        :alt="title"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <div class="flex flex-1 flex-col justify-between">
      <div>
        <h3 class="line-clamp-2 text-base font-semibold text-default mb-1">
          {{ title }}
        </h3>
        <p v-if="penulis" class="line-clamp-1 text-xs text-muted mb-3">
          {{ penulis }}
        </p>
      </div>

      <div class="border-t border-muted pt-3 flex items-center justify-between gap-2">
        <span class="text-sm font-bold text-primary">{{ formatRupiah(harga) }}</span>

        <UButton
          v-if="orderStatus && orderStatus !== 'PAID'"
          disabled
          size="sm"
          color="warning"
          variant="soft"
          icon="i-lucide-clock"
        >
          Menunggu Verifikasi
        </UButton>
        <UButton
          v-else
          :to="`/dashboard/user/produk/ebook/${id}`"
          size="sm"
          variant="outline"
          color="primary"
        >
          Lihat Detail
        </UButton>
      </div>
    </div>
  </div>
</template>
