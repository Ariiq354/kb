<script setup lang="ts">
useSeoMeta({
  description: "Keluarga Bahagia",
});

useHead({
  htmlAttrs: {
    lang: "id",
  },
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <UApp>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
