<script setup lang="ts">
import DiskonContainer from "~/features/diskon/DiskonContainer.vue";

useHead({
  title: "Daftar Diskon",
});
</script>

<template>
  <UDashboardPanel
    :ui="{
      body: 'bg-gray-50 dark:bg-gray-900',
    }"
  >
    <template #header>
      <UDashboardNavbar title="Daftar Diskon">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <DiskonContainer />
    </template>
  </UDashboardPanel>
</template>
