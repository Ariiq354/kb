<script setup lang="ts">
useHead({
  title: "Kelola Order",
});
</script>

<template>
  <UDashboardPanel
    :ui="{
      body: 'bg-gray-50 dark:bg-gray-900',
    }"
  >
    <template #header>
      <UDashboardNavbar title="Kelola Order">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div>
        Ini Kelola Order
      </div>
    </template>
  </UDashboardPanel>
</template>
