<script setup lang="ts">
import DiskonContainer from "~/features/diskon/DiskonContainer.vue";

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Daftar Diskon",
    },
  },
});
useHead({
  title: "Daftar Diskon",
});
</script>

<template>
  <DiskonContainer />
</template>
