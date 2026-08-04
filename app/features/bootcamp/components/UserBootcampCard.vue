<script setup lang="ts">
import { formatRupiah } from "~/utils/number";

defineProps<{
  id: number;
  title: string;
  harga: number;
  image: string;
  deskripsi?: string;
  tempat?: string;
  tanggal?: string;
  orderStatus?: string;
}>();

const config = useRuntimeConfig();
</script>

<template>
  <div class="group flex flex-col overflow-hidden rounded-xl border border-muted bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
    <div class="relative overflow-hidden aspect-video w-full bg-gray-100 dark:bg-gray-700">
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

    <div class="flex flex-1 flex-col p-5">
      <div class="flex items-start justify-between gap-2 mb-2">
        <h3 class="line-clamp-1 text-base font-semibold text-default sm:text-lg">
          {{ title }}
        </h3>
      </div>

      <div v-if="tanggal" class="flex items-center gap-1.5 text-xs text-muted mb-3">
        <UIcon name="i-lucide-calendar" class="text-sm shrink-0" />
        <span>{{ tanggal }}</span>
      </div>

      <p v-if="deskripsi" class="line-clamp-2 text-xs text-muted mb-4 flex-1">
        {{ deskripsi }}
      </p>

      <div class="mt-auto border-t border-muted pt-3 flex items-center justify-between gap-3">
        <div>
          <span class="block text-[10px] uppercase tracking-wider text-muted">Harga</span>
          <span class="text-sm font-bold text-primary">{{ formatRupiah(harga) }}</span>
        </div>

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
          :to="`/dashboard/user/produk/bootcamp/${id}`"
          size="sm"
          color="primary"
        >
          Lihat Detail
        </UButton>
      </div>
    </div>
  </div>
</template>
