<script setup lang="ts">
import HomeContainer from "~/features/landing/home/HomeContainer.vue";

useLandingSeo({
  title: "Keluarga Bahagia",
  description: "Keluarga Bahagia membantu persiapan pernikahan, taaruf, dan penguatan keluarga melalui bootcamp, course, ebook, serta pendampingan hubungan.",
  path: "/",
});

definePageMeta({
  layout: "landing",
});
</script>

<template>
  <HomeContainer />
</template>
