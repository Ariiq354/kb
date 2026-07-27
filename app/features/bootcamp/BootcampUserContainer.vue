<script setup lang="ts">
import { DUMMY_BOOTCAMP } from "~/features/landing/products/constant";
import UserBootcampCard from "./components/UserBootcampCard.vue";
</script>

<template>
  <div class="py-2">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <UserBootcampCard
        v-for="item in DUMMY_BOOTCAMP"
        :id="item.id"
        :key="item.id"
        :title="item.title"
        :deskripsi="item.deskripsi"
        :harga="item.harga"
        :tempat="item.tempat"
        :tanggal="item.tanggal"
        :image="item.image"
      />
    </div>
  </div>
</template>
