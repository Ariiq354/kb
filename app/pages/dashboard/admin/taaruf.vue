<script setup lang="ts">
import TaarufAdminContainer from "~/features/taaruf/TaarufAdminContainer.vue";

useHead({
  title: "Kelola Ta'aruf",
});
</script>

<template>
  <UDashboardPanel
    :ui="{
      body: 'bg-gray-50 dark:bg-gray-900',
    }"
  >
    <template #header>
      <UDashboardNavbar title="Kelola Ta'aruf">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <TaarufAdminContainer />
    </template>
  </UDashboardPanel>
</template>
