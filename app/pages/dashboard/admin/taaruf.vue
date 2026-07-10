<script setup lang="ts">
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
      <div>
        Ini Kelola Ta'aruf
      </div>
    </template>
  </UDashboardPanel>
</template>
