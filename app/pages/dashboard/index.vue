<script setup lang="ts">
import DashboardContainer from "~/features/dashboard/DashboardContainer.vue";

useHead({
  title: "Dashboard",
});
</script>

<template>
  <UDashboardPanel
    :ui="{
      body: 'bg-gray-50 dark:bg-gray-900',
    }"
  >
    <template #header>
      <UDashboardNavbar title="Dashboard">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <DashboardContainer />
    </template>
  </UDashboardPanel>
</template>
