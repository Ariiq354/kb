<script setup lang="ts">
import BootcampTab from "~/features/admin/produk/BootcampTab.vue";
import CourseTab from "~/features/admin/produk/CourseTab.vue";
import EbookTab from "~/features/admin/produk/EbookTab.vue";

definePageMeta({
  layout: "dashboard",
});

const items = [
  { key: "bootcamp", label: "Bootcamp", icon: "i-heroicons-academic-cap" },
  { key: "ebook", label: "E-Book", icon: "i-heroicons-book-open" },
  { key: "course", label: "Course", icon: "i-heroicons-video-camera" },
];
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">
      Manajemen Produk
    </h1>
    <UTabs :items="items" class="w-full">
      <template #item="{ item }">
        <div class="mt-4">
          <BootcampTab v-if="item.key === 'bootcamp'" />
          <EbookTab v-else-if="item.key === 'ebook'" />
          <CourseTab v-else-if="item.key === 'course'" />
        </div>
      </template>
    </UTabs>
  </div>
</template>
