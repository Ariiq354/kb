<script setup lang="ts">
import RegisterContainer from "~/features/auth/RegisterContainer.vue";

useHead({
  title: "Keluarga Bahagia - Register",
});
definePageMeta({
  layout: "auth",
});
</script>

<template>
  <RegisterContainer />
</template>
