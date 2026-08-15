<script setup lang="ts">
import { computed } from "vue";
import { useFetch, useRuntimeConfig } from "#imports";
import CardEbook from "./CardEbook.vue";

const config = useRuntimeConfig();

const { data, status } = await useFetch("/api/v1/produk", {
  query: {
    type: "EBOOK",
    status: true,
  },
});

const items = computed(() => (data.value?.data ?? []) as any[]);

function getImageUrl(foto?: string) {
  if (!foto)
    return "/images/ebook-image-1.webp";
  if (foto.startsWith("http") || foto.startsWith("/"))
    return foto;
  return `${config.public.imageUrl}/${foto}`;
}
</script>

<template>
  <div class="flex items-center gap-3 border-b border-muted pb-2">
    <UIcon name="i-lucide-book-open" class="text-2xl text-primary sm:text-3xl" />
    <h2 class="text-xl font-medium text-default sm:text-2xl">
      EBook
    </h2>
  </div>

  <div class="py-4 sm:py-5">
    <div v-if="status === 'pending'" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <USkeleton v-for="i in 4" :key="i" class="h-80 w-full rounded-xl" />
    </div>

    <div v-else-if="!items || items.length === 0" class="py-8 text-center text-muted">
      Belum ada e-book yang tersedia saat ini.
    </div>

    <UCarousel
      v-else
      v-slot="{ item }"
      :items="items"
      :ui="{
        item: 'basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 flex py-2',
        prev: 'start-2 sm:-start-5 lg:-start-12',
        next: 'end-2 sm:-end-5 lg:-end-12',
      }"
      arrows
    >
      <CardEbook
        :id="item.id"
        :key="item.id"
        :title="item.judul"
        :penulis="item.namaPublisher || 'Tim Keluarga Bahagia'"
        :harga="item.harga"
        :image="getImageUrl(item.foto)"
      />
    </UCarousel>
  </div>
</template>
