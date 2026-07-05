<script setup lang="ts">
import LoginContainer from "~/features/auth/LoginContainer.vue";

useHead({
  title: "Keluarga Bahagia - Login",
});
definePageMeta({
  layout: "auth",
});
</script>

<template>
  <LoginContainer />
</template>
