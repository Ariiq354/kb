<script setup lang="ts">
import { DUMMY_EBOOK } from "~/features/landing/products/constant";
import UserEbookCard from "./components/UserEbookCard.vue";
</script>

<template>
  <div class="py-2">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <UserEbookCard
        v-for="item in DUMMY_EBOOK"
        :id="item.id"
        :key="item.id"
        :title="item.title"
        :penulis="item.penulis"
        :harga="item.harga"
        :image="item.image"
      />
    </div>
  </div>
</template>
