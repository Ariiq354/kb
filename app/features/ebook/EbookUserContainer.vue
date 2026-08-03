<script setup lang="ts">
import UserEbookCard from "./components/UserEbookCard.vue";

const { data, status } = await useFetch("/api/v1/user/produk", {
  query: {
    type: "EBOOK",
  },
});
</script>

<template>
  <div class="py-2">
    <div v-if="status === 'pending'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <USkeleton v-for="i in 4" :key="i" class="h-80 w-full rounded-xl" />
    </div>
    <div v-else-if="!data?.data || data.data.length === 0" class="py-16 text-center space-y-4">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">
        <UIcon name="i-lucide-book-open" size="32" />
      </div>
      <div>
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          Belum Ada E-Book Yang Dibeli
        </h3>
        <p class="mt-1 text-sm text-muted">
          Anda belum memiliki akses ke E-Book manapun. Silakan lakukan checkout E-Book melalui landing page.
        </p>
      </div>
      <UButton
        to="/"
        color="primary"
        variant="soft"
        icon="i-lucide-shopping-bag"
      >
        Lihat Catalog Produk
      </UButton>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <UserEbookCard
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
