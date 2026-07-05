<script setup lang="ts">
import DashboardSidebar from "~/components/App/DashboardSidebar.vue";

defineProps<{
  title?: string;
}>();
</script>

<template>
  <UDashboardGroup unit="rem">
    <DashboardSidebar />
    <UDashboardPanel
      :ui="{
        body: 'bg-gray-50 dark:bg-gray-900',
      }"
    >
      <template #header>
        <UDashboardNavbar :title="title">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
        </UDashboardNavbar>
      </template>
      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
