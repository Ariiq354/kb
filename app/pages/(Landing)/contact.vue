<script setup lang="ts">
import ContactContainer from "~/features/landing/contact/ContactContainer.vue";
import { useLandingSeo } from "~/utils/seo";

useLandingSeo({
  title: "Kontak",
  description: "Hubungi Keluarga Bahagia untuk konsultasi, pertanyaan layanan, atau dukungan seputar persiapan pernikahan, taaruf, dan penguatan keluarga.",
  path: "/contact",
  image: "/images/kontak-image-kb.avif",
});

definePageMeta({
  layout: "landing",
});
</script>

<template>
  <ContactContainer />
</template>
