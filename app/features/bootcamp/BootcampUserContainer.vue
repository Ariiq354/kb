<script setup lang="ts">
import UserBootcampCard from "./components/UserBootcampCard.vue";

const { data, status } = await useFetch("/api/v1/produk", {
  query: {
    type: "BOOTCAMP",
    status: true,
  },
});
</script>

<template>
  <div class="py-2">
    <div v-if="status === 'pending'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <USkeleton v-for="i in 4" :key="i" class="h-80 w-full rounded-xl" />
    </div>
    <div v-else-if="!data?.data || data.data.length === 0" class="py-12 text-center text-muted">
      Belum ada bootcamp yang tersedia.
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <UserBootcampCard
        v-for="item in data.data"
        :id="item.id"
        :key="item.id"
        :title="item.judul"
        :harga="item.harga"
        :image="item.foto"
      />
    </div>
  </div>
</template>
