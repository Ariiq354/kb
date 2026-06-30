<script setup lang="ts">
import { DUMMY_EBOOK } from "../constant";
import CardEbook from "./CardEbook.vue";
</script>

<template>
  <div class="flex items-center gap-3 border-b border-gray-300 pb-2">
    <UIcon name="i-lucide-book-open" class="text-3xl text-primary" />
    <h2 class="text-2xl text-black font-medium">
      EBook
    </h2>
  </div>

  <div class="py-5">
    <UCarousel
      v-slot="{ item }"
      :items="DUMMY_EBOOK"
      :ui="{ item: 'basis-1/4' }"
      arrows
    >
      <CardEbook
        :id="item.id"
        :key="item.title"
        :title="item.title"
        :penulis="item.penulis"
        :harga="item.harga"
        :image="item.image"
      />
    </UCarousel>
  </div>
</template>
