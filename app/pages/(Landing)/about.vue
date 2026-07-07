<script setup lang="ts">
import AboutContainer from "~/features/landing/about/AboutContainer.vue";

useLandingSeo({
  title: "Tentang Kami",
  description: "Kenali Keluarga Bahagia, platform pendidikan pranikah dan penguatan keluarga untuk membangun rumah tangga harmonis, berkualitas, dan penuh keberkahan.",
  path: "/about",
});

definePageMeta({
  layout: "landing",
});
</script>

<template>
  <AboutContainer />
</template>
