<script setup lang="ts">
import { navigateTo } from "#imports";

definePageMeta({
  middleware: [
    () => navigateTo("/dashboard/user/produk/bootcamp", { replace: true }),
  ],
});
</script>

<template>
  <div />
</template>
