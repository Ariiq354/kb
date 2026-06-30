<script setup lang="ts">
import ProductsContainer from "~/features/landing/products/ProductsContainer.vue";

useHead({
  title: "Keluarga Bahagia - Layanan",
});

definePageMeta({
  layout: "landing",
});
</script>

<template>
  <ProductsContainer />
</template>
