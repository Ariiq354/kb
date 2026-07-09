<script setup lang="ts">
import ProductsContainer from "~/features/landing/products/ProductsContainer.vue";
import { useLandingSeo } from "~/utils/seo";

useLandingSeo({
  title: "Layanan",
  description: "Jelajahi layanan Keluarga Bahagia: bootcamp pranikah, course online, ebook panduan keluarga, dan program taaruf untuk membangun hubungan yang sehat.",
  path: "/products",
});

definePageMeta({
  layout: "landing",
});
</script>

<template>
  <ProductsContainer />
</template>
