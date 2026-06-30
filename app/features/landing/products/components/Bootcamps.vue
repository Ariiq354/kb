<script setup lang="ts">
import { DUMMY_BOOTCAMP } from "../constant";
import CardBootcamp from "./CardBootcamp.vue";
</script>

<template>
  <div class="flex items-center gap-3 border-b border-gray-300 pb-2">
    <UIcon name="i-majesticons-academic-cap-line" class="text-3xl text-primary" />
    <h2 class="text-2xl text-black font-medium">
      Bootcamps
    </h2>
  </div>

  <div class="py-5">
    <UCarousel
      v-slot="{ item }"
      :items="DUMMY_BOOTCAMP"
      :ui="{ item: 'basis-1/3' }"
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
