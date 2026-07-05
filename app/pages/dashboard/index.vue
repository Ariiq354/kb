<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
useHead({
  title: "Dashboard",
});
</script>

<template>
  <div class="p-4 space-y-4">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
      Dashboard
    </h1>
    <UCard>
      <p class="text-gray-500 dark:text-gray-400">
        Welcome to your dashboard.
      </p>
    </UCard>
  </div>
</template>
