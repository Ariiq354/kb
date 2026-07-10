<script setup lang="ts">
useHead({
  title: "Ta'aruf",
});
</script>

<template>
  <UDashboardPanel
    :ui="{
      body: 'bg-gray-50 dark:bg-gray-900',
    }"
  >
    <template #header>
      <UDashboardNavbar title="Ta'aruf">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div>
        Ini Ta'aruf
      </div>
    </template>
  </UDashboardPanel>
</template>
