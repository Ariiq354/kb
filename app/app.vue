<script setup lang="ts">
import { useWebsiteStructuredData } from "./utils/seo";

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
    <NuxtLoadingIndicator :height="5" />
    <UApp :toaster="{ position: 'top-right' }">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
