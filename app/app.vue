<script setup lang="ts">
useWebsiteStructuredData();

useHead({
  titleTemplate: title => title
    ? `${title} | Keluarga Bahagia`
    : "Keluarga Bahagia",
  htmlAttrs: {
    lang: "id",
  },
  meta: [
    {
      name: "robots",
      content: "index, follow",
    },
  ],
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
