<script setup lang="ts">
import { DUMMY_EBOOK } from "../constant";
import CardEbook from "./CardEbook.vue";
</script>

<template>
  <div class="flex items-center gap-3 border-b border-muted pb-2">
    <UIcon name="i-lucide-book-open" class="text-2xl text-primary sm:text-3xl" />
    <h2 class="text-xl font-medium text-default sm:text-2xl">
      EBook
    </h2>
  </div>

  <div class="py-4 sm:py-5">
    <UCarousel
      v-slot="{ item }"
      :items="DUMMY_EBOOK"
      :ui="{
        item: 'basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4',
        prev: 'start-2 sm:-start-5 lg:-start-12',
        next: 'end-2 sm:-end-5 lg:-end-12',
      }"
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
