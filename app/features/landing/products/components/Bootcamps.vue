<script setup lang="ts">
import { DUMMY_BOOTCAMP } from "../constant";
import CardBootcamp from "./CardBootcamp.vue";
</script>

<template>
  <div class="flex items-center gap-3 border-b border-muted pb-2">
    <UIcon name="i-majesticons-academic-cap-line" class="text-2xl text-primary sm:text-3xl" />
    <h2 class="text-xl font-medium text-default sm:text-2xl">
      Bootcamps
    </h2>
  </div>

  <div class="py-4 sm:py-5">
    <UCarousel
      v-slot="{ item }"
      :items="DUMMY_BOOTCAMP"
      :ui="{
        item: 'basis-full sm:basis-1/2 lg:basis-1/3',
        prev: 'start-2 sm:-start-5 lg:-start-12',
        next: 'end-2 sm:-end-5 lg:-end-12',
      }"
      arrows
    >
      <CardBootcamp
        :id="item.id"
        :key="item.title"
        :title="item.title"
        :deskripsi="item.deskripsi"
        :harga="item.harga"
        :tempat="item.tempat"
        :tanggal="item.tanggal"
        :image="item.image"
      />
    </UCarousel>
  </div>
</template>
